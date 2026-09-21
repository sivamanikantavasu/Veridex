# Veridex

Veridex is a digital scholarly-content platform for discovering, managing, reading, and analyzing academic and research resources. It provides a reader-facing library experience alongside an administrator workspace for managing users, content, subscriptions, entitlements, usage analytics, audit events, and service health.

The project is implemented as a React frontend backed by Spring Boot microservices. The services communicate through an API Gateway and register with a Eureka service registry. MySQL stores users, content, subscriptions, reading activity, collections, and audit data.

## What Veridex Provides

### Reader experience

- Create an account and sign in with JWT-based authentication.
- Browse and filter the scholarly content library.
- Open content details and read uploaded resources.
- Track reading progress, pages, and duration.
- Review reading history and engagement information.
- Create collections and save content for later.
- View subscription status, plans, and access entitlements.
- Manage profile and password settings.

### Administration experience

Administrators have a separate role-protected workspace for:

- Viewing platform KPIs and usage analytics.
- Creating, editing, deleting, and uploading content resources.
- Managing users and changing account status.
- Reviewing subscription and content entitlements.
- Reviewing audit events and security activity.
- Inspecting system health for the platform services.

## Architecture

```text
React + Vite frontend (:8443)
		  |
		  v
API Gateway (:8080) ---- Eureka Registry (:8761)
	 |          |          |          |
	 v          v          v          v
 Auth (:9001)  Content (:9002)  Access (:9003)  Usage (:9004)
	 \             |              |             /
	  \______________ MySQL: veridex __________/
```

### Backend services

| Service | Port | Responsibility |
| --- | ---: | --- |
| `eureka-server` | `8761` | Service discovery and registry |
| `api-gateway` | `8080` | Single API entry point, routing, CORS, and gateway filters |
| `auth-service` | `9001` | Registration, login, JWT tokens, profiles, passwords, users, and roles |
| `content-service` | `9002` | Scholarly content metadata and uploaded resources |
| `access-service` | `9003` | Plan-based access checks, subscriptions, and entitlements |
| `usage-service` | `9004` | Reading events, history, collections, analytics, and audit data |
| `common` | - | Shared DTOs, security filters, JWT utilities, and exceptions |

### Frontend

The frontend is a React 19 single-page application built with Vite. React Router provides public, authenticated reader, and administrator routes. Lucide supplies interface icons, Tailwind CSS is available through the Vite plugin, and the frontend API modules communicate with the gateway at `http://localhost:8080` by default.

## Repository Layout

```text
.
├── Frontend/                 React and Vite application
│   ├── src/api/              Auth, content, access, usage, and admin clients
│   ├── src/pages/             Public, reader, and admin screens
│   ├── src/routes/            Authentication context and route guards
│   └── scripts/dev-all.js     Windows development stack launcher
├── backend/
│   ├── common/                Shared backend library
│   ├── eureka-server/         Service registry
│   ├── api-gateway/           Gateway and routing
│   ├── auth-service/          Authentication and user management
│   ├── content-service/       Content management
│   ├── access-service/        Access and subscription logic
│   ├── usage-service/         Usage, collections, and audit logic
│   └── database/schema.sql    MySQL schema
└── package.json               Root frontend and full-stack scripts
```

## Prerequisites

- Java 21
- Maven 3.9 or later
- Node.js 20 or later and npm
- MySQL 8.x
- Git

The backend uses Spring Boot `3.3.4`, Spring Cloud `2023.0.3`, MySQL Connector/J `8.0.33`, and JJWT `0.12.6`.

## Local Setup

### 1. Configure MySQL

Create the application database and tables:

```powershell
mysql -u root -p < backend/database/schema.sql
```

The default local connection is:

```text
Host:     localhost
Port:     3306
Database: veridex
Username: root
Password: 2389
```

The password is only a development default. Use environment variables for a different local or deployment database:

```powershell
$env:DB_URL = 'jdbc:mysql://localhost:3306/veridex?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC'
$env:DB_USERNAME = 'root'
$env:DB_PASSWORD = 'your-password'
```

### 2. Install frontend dependencies

```powershell
cd Frontend
npm install
cd ..
```

### 3. Start the complete stack

From the repository root on Windows:

```powershell
npm run dev:all
```

The launcher builds and installs the shared backend module, starts the registry, waits for service health checks, starts the backend services, and then starts Vite. Open:

```text
http://localhost:8443
```

The frontend uses `http://localhost:8080` as its API base URL by default. To use another gateway URL:

```powershell
$env:VITE_API_BASE_URL = 'http://localhost:8080'
npm --prefix Frontend run dev
```

### 4. Start services individually

If the full-stack launcher is not being used, start the services in this order from the repository root:

```powershell
cd backend
mvn install -DskipTests
mvn -pl eureka-server spring-boot:run
mvn -pl api-gateway spring-boot:run
mvn -pl auth-service,content-service,access-service,usage-service spring-boot:run
```

In a second terminal, start the frontend:

```powershell
cd Frontend
npm run dev
```

The backend actuator health endpoints are available at `/actuator/health` on each service port.

## API Overview

The frontend normally calls the gateway at `http://localhost:8080`. The gateway routes these paths to the corresponding services:

### Authentication: `/api/auth`

- `POST /register` - register a reader account
- `POST /login` - authenticate and receive a JWT
- `POST /logout` - record logout activity
- `GET /me` - retrieve the authenticated profile
- `PATCH /me/password` - change the current password
- `PATCH /me/plan` - update the current plan
- `GET /users` - list users, administrator only
- `POST /users` - create a user, administrator only
- `GET /users/{id}` - retrieve a user, administrator only
- `PUT /users/{id}` - update a user, administrator only
- `PATCH /users/{id}/status` - suspend or reactivate a user, administrator only
- `DELETE /users/{id}` - delete a user, administrator only

### Content: `/api/content`

- `GET /` - list content
- `GET /{id}` - retrieve content metadata
- `POST /` - create content
- `PUT /{id}` - update content
- `DELETE /{id}` - delete content
- `POST /{id}/file` - upload a content resource
- `GET /{id}/file` - retrieve a content resource

### Access: `/api/access`

- `POST /check` - check whether a plan can access content
- `GET /entitlements` - list available entitlements
- `GET /subscription/{userEmail}` - retrieve subscription status

### Usage: `/api/usage`

- `POST /track` - record reading activity
- `GET /history/{userId}` - retrieve reading history
- `GET /analytics/{userId}` - retrieve user analytics
- `GET /analytics` - retrieve aggregate analytics
- `GET /audit` - retrieve audit events
- `GET /collections/{userId}` - list collections
- `POST /collections/{userId}` - create a collection
- `GET /collections/{collectionId}/items` - retrieve collection contents
- `POST /collections/{collectionId}/items` - add content to a collection
- `DELETE /collections/{collectionId}/items` - remove content from a collection
- `DELETE /collections/{collectionId}` - delete a collection

Successful responses use the shared backend `ApiResponse` envelope, with returned values in the `data` field.

## Authentication and Access Control

The backend is stateless and uses bearer JWTs. After login, send the token on protected requests:

```http
Authorization: Bearer <jwt-token>
```

The auth service uses BCrypt password hashing. Public authentication endpoints are registration and login; administrator endpoints are protected with `ROLE_ADMIN`. The frontend also uses route guards to separate reader and administrator areas.

The access service currently models three plans:

| Plan | Summary |
| --- | --- |
| `reader` | Journal access with a default monthly reading limit |
| `scholar` | Broader access with higher device/concurrency limits and no-download entitlement behavior |
| `institution` | Broadest access level in access checks |

Content marked `open` is accessible without a paid plan. Journal content is accessible to the default `reader` plan; `scholar` and `institution` plans receive broader access.

## Database

`backend/database/schema.sql` defines the MySQL schema used by the services:

- `users` - identity, role, plan, and account status
- `content_items` - metadata and uploaded resource bytes
- `subscriptions` - plan status and billing dates
- `reading_events` - progress, page, and duration events
- `user_collections` - saved collection definitions
- `collection_items` - content saved to collections
- `audit_events` - security and administrative activity

The services are configured with Hibernate `ddl-auto: update`, while `schema.sql` provides the intended initial schema and indexes.

## Development Commands

From the repository root:

```powershell
npm run dev          # Start only the frontend
npm run dev:all      # Start frontend, registry, gateway, and backend services
npm run build        # Create a production frontend build
```

From `backend/`:

```powershell
mvn test             # Run backend tests
mvn package          # Build backend modules
mvn install          # Build and install shared artifacts locally
```

From `Frontend/`:

```powershell
npm run dev          # Start Vite development server
npm run build        # Build the frontend
npm run preview      # Preview the production build
npm run format       # Format frontend files with oxfmt
```

## Current Implementation Notes

- The default configuration contains development credentials and a development JWT secret. Replace both before any deployment outside a local environment.
- The API Gateway allows cross-origin requests from the local Vite addresses `http://localhost:8443` and `http://127.0.0.1:8443`.
- Several frontend account helpers, including password reset, email verification, login history, active sessions, and some entitlement administration actions, are placeholders until matching backend endpoints are implemented.
- The local full-stack launcher is Windows-oriented because its process cleanup uses PowerShell and `taskkill`.
- Uploaded content resources are stored in the `content_items` table as binary data, so production deployments should plan storage and database sizing accordingly.

## License

No license has been specified for this repository yet.
