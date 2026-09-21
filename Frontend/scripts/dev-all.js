import { spawn, execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const backendDir = path.resolve(rootDir, '../backend');

const services = [
  {
    name: 'eureka-server',
    cwd: path.join(backendDir, 'eureka-server'),
    command: 'mvn',
    args: ['spring-boot:run'],
  },
  {
    name: 'api-gateway',
    cwd: path.join(backendDir, 'api-gateway'),
    command: 'mvn',
    args: ['spring-boot:run'],
  },
  {
    name: 'auth-service',
    cwd: path.join(backendDir, 'auth-service'),
    command: 'mvn',
    args: ['spring-boot:run'],
  },
  {
    name: 'content-service',
    cwd: path.join(backendDir, 'content-service'),
    command: 'mvn',
    args: ['spring-boot:run'],
  },
  {
    name: 'access-service',
    cwd: path.join(backendDir, 'access-service'),
    command: 'mvn',
    args: ['spring-boot:run'],
  },
  {
    name: 'usage-service',
    cwd: path.join(backendDir, 'usage-service'),
    command: 'mvn',
    args: ['spring-boot:run'],
  },
  {
    name: 'frontend',
    cwd: rootDir,
    command: 'npm',
    args: ['run', 'dev'],
  },
];

const running = new Map();
const portsToClean = [8761, 8080, 8443, 9001, 9002, 9003, 9004];
let exitCode = 0;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function killPid(pid, reason) {
  if (!pid || Number(pid) <= 0) return;

  try {
    const safePid = Number(pid);
    if (safePid === process.pid || safePid === process.ppid) {
      return;
    }

    execSync(`taskkill /PID ${safePid} /T /F`, { stdio: 'ignore' });
    console.log(`[cleanup] Stopped PID ${safePid} (${reason})`);
  } catch (error) {
    // Ignore failed cleanup for already-terminated processes.
  }
}

function cleanupPort(port) {
  try {
    const output = execSync(
      `powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique"`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    );

    const pids = [...new Set((output.match(/\d+/g) || []).map(Number).filter((pid) => pid && pid !== process.pid && pid !== process.ppid))];
    for (const pid of pids) {
      killPid(pid, `port ${port}`);
    }
  } catch (error) {
    // Port is already free or not available for inspection.
  }
}

function cleanupProjectProcesses() {
  try {
    const command = [
      'powershell',
      '-NoProfile',
      '-ExecutionPolicy',
      'Bypass',
      '-Command',
      `"$currentPid = ${process.pid}; $currentPpid = ${process.ppid}; $ownPatterns = @('scripts\\dev-all.js', 'node.exe', 'vite'); $procs = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue; $procs | Where-Object { $_.ProcessId -ne $currentPid -and $_.ParentProcessId -ne $currentPid -and $_.ParentProcessId -ne $currentPpid -and ((($_.Name -eq 'java.exe') -and ($_.CommandLine -match 'D:\\Veridex|EurekaServerApplication|ApiGatewayApplication|AuthServiceApplication|ContentServiceApplication|AccessServiceApplication|UsageServiceApplication|spring-boot:run')) -or (($_.Name -eq 'cmd.exe') -and ($_.CommandLine -match 'mvn spring-boot:run|npm run dev|scripts\\dev-all.js')) -or (($_.Name -eq 'node.exe') -and ($_.CommandLine -match 'vite|scripts\\dev-all.js|veridex'))) } | Select-Object -ExpandProperty ProcessId -Unique"`,
    ].join(' ');

    const output = execSync(command, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    const pids = [...new Set((output.match(/\d+/g) || []).map(Number).filter((pid) => pid && pid !== process.pid && pid !== process.ppid))];

    for (const pid of pids) {
      killPid(pid, 'stale app process');
    }
  } catch (error) {
    // Ignore when no matching project processes are running.
  }
}

function cleanupStaleProcesses() {
  console.log('Cleaning stale local processes on the app ports...');
  for (const port of portsToClean) {
    cleanupPort(port);
  }

  console.log('Cleaning stale project Java and Node processes...');
  cleanupProjectProcesses();
}

async function waitForHttp(url, serviceName, timeoutMs = 60000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log(`[${serviceName}] is ready at ${url}`);
        return;
      }
    } catch (error) {
      // Retry until ready.
    }

    await wait(1500);
  }

  throw new Error(`${serviceName} did not become healthy at ${url} within ${timeoutMs}ms`);
}

function startService(service) {
  const child = spawn(service.command, service.args, {
    cwd: service.cwd,
    shell: true,
    stdio: 'inherit',
    env: { ...process.env, FORCE_COLOR: '1' },
  });

  running.set(service.name, child);

  child.on('exit', (code, signal) => {
    const state = signal ? `signal ${signal}` : `exit ${code}`;
    console.log(`[${service.name}] stopped (${state})`);
    running.delete(service.name);

    if (code !== 0 && service.name !== 'frontend') {
      exitCode = code || 1;
      for (const proc of running.values()) {
        proc.kill('SIGTERM');
      }
    }
  });
}

async function bootstrapBackend() {
  cleanupStaleProcesses();
  console.log('Installing shared backend artifacts...');
  const build = spawn('mvn', ['-q', '-f', path.join(backendDir, 'pom.xml'), 'install', '-DskipTests'], {
    cwd: backendDir,
    shell: true,
    stdio: 'inherit',
    env: { ...process.env, FORCE_COLOR: '1' },
  });

  await new Promise((resolve, reject) => {
    build.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Backend bootstrap failed with exit code ${code}`));
    });
  });
}

async function main() {
  try {
    cleanupStaleProcesses();
    await bootstrapBackend();
    console.log('Starting Veridex stack...');

    startService(services[0]);
    await waitForHttp('http://localhost:8761/actuator/health', 'eureka-server');

    for (const service of services.slice(1, services.length - 1)) {
      startService(service);
      if (service.name === 'api-gateway') {
        await waitForHttp('http://localhost:8080/actuator/health', 'api-gateway');
      }
      if (service.name === 'auth-service') {
        await waitForHttp('http://localhost:9001/actuator/health', 'auth-service');
      }
      if (service.name === 'content-service') {
        await waitForHttp('http://localhost:9002/actuator/health', 'content-service');
      }
      if (service.name === 'access-service') {
        await waitForHttp('http://localhost:9003/actuator/health', 'access-service');
      }
      if (service.name === 'usage-service') {
        await waitForHttp('http://localhost:9004/actuator/health', 'usage-service');
      }
    }

    startService(services[services.length - 1]);
    await new Promise(() => {});
  } catch (error) {
    console.error(error.message);
    exitCode = 1;
    process.exit(exitCode);
  }
}

main();

process.on('SIGINT', () => {
  for (const proc of running.values()) {
    proc.kill('SIGTERM');
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  for (const proc of running.values()) {
    proc.kill('SIGTERM');
  }
  process.exit(0);
});

process.on('exit', () => {
  if (exitCode !== 0) {
    process.exit(exitCode);
  }
});
