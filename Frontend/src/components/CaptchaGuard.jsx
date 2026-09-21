import React, { useState, useEffect, useRef, useCallback } from 'react'
import { RefreshCw, Volume2, AlertCircle, CheckCircle, Clock, ShieldCheck, ChevronRight } from 'lucide-react'

/*
  CaptchaGuard — escalating visual challenges (no checkbox)
  Plan 0 (A): 3×3 image grid — click all matching category tiles
  Plan 1 (B): 4×4 harder image grid — two categories
  Plan 2 (C): Distorted text transcription + logic question
  Plan 3 (D): Lockout countdown
*/

// --- Tile pools — shuffled randomly each challenge so correct tiles never cluster ---
const BOOK_TILES_3 = [
  { emoji: '📗', cat: 'book' },
  { emoji: '📕', cat: 'book' },
  { emoji: '📘', cat: 'book' },
]
const NONBOOK_TILES_6 = [
  { emoji: '🌿', cat: 'plant' },
  { emoji: '🦋', cat: 'nature' },
  { emoji: '⚙️', cat: 'tool' },
  { emoji: '🌊', cat: 'nature' },
  { emoji: '🔬', cat: 'tool' },
  { emoji: '🎵', cat: 'music' },
  { emoji: '🌸', cat: 'plant' },
  { emoji: '💧', cat: 'nature' },
  { emoji: '🎨', cat: 'art' },
  { emoji: '🌙', cat: 'sky' },
  { emoji: '🔭', cat: 'tool' },
  { emoji: '🦜', cat: 'nature' },
  { emoji: '🌺', cat: 'plant' },
  { emoji: '🎸', cat: 'music' },
  { emoji: '🦊', cat: 'nature' },
  { emoji: '⚡', cat: 'sky' },
  { emoji: '🏺', cat: 'art' },
  { emoji: '🌍', cat: 'sky' },
]

const BOOK_TILES_6 = [
  { emoji: '📗', cat: 'book' },
  { emoji: '📕', cat: 'book' },
  { emoji: '📘', cat: 'book' },
  { emoji: '📙', cat: 'book' },
  { emoji: '📚', cat: 'book' },
  { emoji: '📖', cat: 'book' },
]
const NONBOOK_TILES_10 = [
  { emoji: '🌿', cat: 'plant' },
  { emoji: '🦋', cat: 'nature' },
  { emoji: '⚙️', cat: 'tool' },
  { emoji: '🌊', cat: 'nature' },
  { emoji: '🔬', cat: 'tool' },
  { emoji: '🎵', cat: 'music' },
  { emoji: '🌸', cat: 'plant' },
  { emoji: '🎨', cat: 'art' },
  { emoji: '🌙', cat: 'sky' },
  { emoji: '🔭', cat: 'tool' },
  { emoji: '🦜', cat: 'nature' },
  { emoji: '🌺', cat: 'plant' },
  { emoji: '🎸', cat: 'music' },
  { emoji: '🦊', cat: 'nature' },
  { emoji: '⚡', cat: 'sky' },
  { emoji: '🏺', cat: 'art' },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function makeSample(pool, n) {
  return shuffle(pool).slice(0, n)
}

function makeGrid3x3() {
  const books = makeSample(BOOK_TILES_3, 3)
  const nonbooks = makeSample(NONBOOK_TILES_6, 6)
  return shuffle([...books, ...nonbooks])
}

function makeGrid4x4() {
  const books = makeSample(BOOK_TILES_6, 6)
  const nonbooks = makeSample(NONBOOK_TILES_10, 10)
  return shuffle([...books, ...nonbooks])
}

const DISTORTED_CODE = 'K4VR9X'
const LOGIC_ANSWER = '32'

export default function CaptchaGuard({ plan = 0, onVerify, onFail, onLockout, expirySeconds = 120 }) {
  const [state, setState] = useState('idle')   // idle | verifying | success | error | expired | locked
  const [attempts, setAttempts] = useState(0)
  const [timeLeft, setTimeLeft] = useState(expirySeconds)
  const [lockoutTime, setLockoutTime] = useState(300)
  const [grid3, setGrid3] = useState(() => makeGrid3x3())
  const [grid4, setGrid4] = useState(() => makeGrid4x4())
  const timerRef = useRef(null)

  // Plan A / B
  const [selectedTiles, setSelectedTiles] = useState([])

  // Plan C
  const [textAnswer, setTextAnswer] = useState('')
  const [logicAnswer, setLogicAnswer] = useState('')

  const effectivePlan = attempts >= 6 ? 3 : attempts >= 4 ? 2 : attempts >= 2 ? 1 : plan

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current)
    setTimeLeft(expirySeconds)
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current); setState('expired'); return 0 }
        return t - 1
      })
    }, 1000)
  }, [expirySeconds])

  useEffect(() => { if (state === 'idle') startTimer(); return () => clearInterval(timerRef.current) }, [state, startTimer])

  useEffect(() => {
    if (state !== 'locked') return
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setLockoutTime((t) => {
        if (t <= 1) { clearInterval(timerRef.current); setState('idle'); setAttempts(0); return 300 }
        return t - 1
      })
    }, 1000)
  }, [state])

  const pass = () => { setState('success'); clearInterval(timerRef.current); onVerify?.() }
  const fail = () => {
    const next = attempts + 1; setAttempts(next)
    if (next >= 6) { setState('locked'); onLockout?.() }
    else {
      setState('error')
      setSelectedTiles([])
      setGrid3(makeGrid3x3())
      setGrid4(makeGrid4x4())
      onFail?.()
    }
  }

  const reset = () => {
    setState('idle')
    setSelectedTiles([])
    setTextAnswer('')
    setLogicAnswer('')
    setGrid3(makeGrid3x3())
    setGrid4(makeGrid4x4())
    startTimer()
  }

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  const handleGridSubmit = (correctIndices) => {
    setState('verifying')
    setTimeout(() => {
      const userSet = new Set(selectedTiles)
      const correctSet = new Set(correctIndices)
      const ok = userSet.size === correctSet.size && [...correctSet].every((x) => userSet.has(x))
      ok ? pass() : fail()
    }, 700)
  }

  const handleTextSubmit = () => {
    setState('verifying')
    setTimeout(() => {
      const codeOk = textAnswer.trim().toUpperCase() === DISTORTED_CODE
      const logicOk = logicAnswer.trim() === LOGIC_ANSWER
      codeOk && logicOk ? pass() : fail()
    }, 700)
  }

  // Locked
  if (effectivePlan === 3 || state === 'locked') {
    return (
      <Frame>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Clock size={28} color="var(--danger)" style={{ margin: '0 auto 12px', display: 'block' }} />
          <p style={{ color: 'var(--danger)', fontWeight: 600, fontSize: '14px', margin: '0 0 6px' }}>Access temporarily suspended</p>
          <p style={{ fontSize: '30px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>{fmt(lockoutTime)}</p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 16px' }}>Too many failed attempts. Wait or reset your password.</p>
          <a href="/Veridex/Forgot-Password" style={{ fontSize: '13px', color: 'var(--burgundy-300)', textDecoration: 'none' }}>Reset password →</a>
        </div>
      </Frame>
    )
  }

  // Success
  if (state === 'success') {
    return (
      <Frame>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px' }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(78,159,125,0.15)', border: '1px solid rgba(78,159,125,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CheckCircle size={14} color="var(--success)" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Verification complete</p>
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>Challenge passed successfully</p>
          </div>
          <ShieldCheck size={16} color="var(--success)" />
        </div>
      </Frame>
    )
  }

  // Expired
  if (state === 'expired') {
    return (
      <Frame>
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <p style={{ color: 'var(--warning)', fontSize: '13px', fontWeight: 500, margin: '0 0 10px' }}>Challenge expired — please try again</p>
          <button onClick={reset} style={ghostBtn}><RefreshCw size={12} /> New challenge</button>
        </div>
      </Frame>
    )
  }

  // ─── Shared header ───────────────────────────────────────
  const header = (prompt) => (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={13} color={state === 'error' ? 'var(--danger)' : 'var(--burgundy-400)'} />
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: state === 'error' ? 'var(--danger)' : 'var(--text-muted)' }}>
            Security verification
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: timeLeft < 30 ? 'var(--danger)' : 'var(--text-muted)' }}>{fmt(timeLeft)}</span>
          <button onClick={reset} aria-label="New challenge" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px', display: 'flex', borderRadius: '3px' }}>
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      {state === 'error' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 14px', background: 'rgba(229,72,77,0.07)', borderBottom: '1px solid rgba(229,72,77,0.18)' }}>
          <AlertCircle size={12} color="var(--danger)" />
          <span style={{ fontSize: '12px', color: 'var(--danger)' }}>Wrong selection — {6 - attempts} attempt{6 - attempts !== 1 ? 's' : ''} left</span>
        </div>
      )}

      <div style={{ padding: '12px 14px 8px', borderBottom: '1px solid var(--border-subtle)' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', margin: '0 0 3px' }}>Click all images with</p>
        <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-serif)' }}>{prompt}</p>
      </div>
    </>
  )

  // ─── Plan A — 3×3 grid ───────────────────────────────────
  if (effectivePlan === 0) {
    const tiles = grid3
    const correctIndices = tiles.reduce((acc, t, i) => { if (t.cat === 'book') acc.push(i); return acc }, [])

    return (
      <Frame>
        {header('Academic publications')}
        <div style={{ padding: '10px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', marginBottom: '10px' }}>
            {tiles.map((tile, i) => {
              const sel = selectedTiles.includes(i)
              return (
                <button
                  key={i}
                  onClick={() => setSelectedTiles((s) => sel ? s.filter((x) => x !== i) : [...s, i])}
                  aria-pressed={sel}
                  aria-label={`tile ${i + 1}`}
                  style={{
                    aspectRatio: '1', padding: '10px 6px',
                    background: sel ? 'rgba(110,22,48,0.35)' : 'var(--bg-elevated)',
                    border: `2px solid ${sel ? 'var(--burgundy-400)' : 'var(--border-subtle)'}`,
                    borderRadius: '6px', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px',
                    position: 'relative', transition: 'all 120ms ease-out',
                  }}
                >
                  <span style={{ fontSize: '26px', lineHeight: 1 }}>{tile.emoji}</span>
                  {sel && (
                    <div style={{ position: 'absolute', top: 3, right: 3, width: 15, height: 15, borderRadius: '50%', background: 'var(--burgundy-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
          <Foot onSkip={reset} onVerify={() => handleGridSubmit(correctIndices)} canVerify={selectedTiles.length > 0} verifying={state === 'verifying'} />
        </div>
      </Frame>
    )
  }

  // ─── Plan B — 4×4 harder grid ───────────────────────────
  if (effectivePlan === 1) {
    const tiles4x4 = grid4
    const correctIndices4 = tiles4x4.reduce((a, t, i) => { if (t.cat === 'book') a.push(i); return a }, [])
    return (
      <Frame>
        {header('Published volumes')}
        <div style={{ padding: '10px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3px', marginBottom: '10px' }}>
            {tiles4x4.map((tile, i) => {
              const sel = selectedTiles.includes(i)
              return (
                <button
                  key={i}
                  onClick={() => setSelectedTiles((s) => sel ? s.filter((x) => x !== i) : [...s, i])}
                  aria-pressed={sel}
                  aria-label={`tile ${i + 1}`}
                  style={{
                    aspectRatio: '1', padding: '6px 4px',
                    background: sel ? 'rgba(110,22,48,0.35)' : 'var(--bg-elevated)',
                    border: `2px solid ${sel ? 'var(--burgundy-400)' : 'var(--border-subtle)'}`,
                    borderRadius: '5px', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px',
                    position: 'relative', transition: 'all 120ms ease-out',
                  }}
                >
                  <span style={{ fontSize: '22px', lineHeight: 1 }}>{tile.emoji}</span>
                  {sel && (
                    <div style={{ position: 'absolute', top: 2, right: 2, width: 13, height: 13, borderRadius: '50%', background: 'var(--burgundy-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="7" height="5" viewBox="0 0 7 5" fill="none"><path d="M1 2.5L2.5 4L6 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
          <Foot onSkip={reset} onVerify={() => handleGridSubmit(correctIndices4)} canVerify={selectedTiles.length > 0} verifying={state === 'verifying'} />
        </div>
      </Frame>
    )
  }

  // ─── Plan C — distorted text + logic ─────────────────────
  if (effectivePlan === 2) {
    return (
      <Frame>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={13} color={state === 'error' ? 'var(--danger)' : 'var(--burgundy-400)'} />
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: state === 'error' ? 'var(--danger)' : 'var(--text-muted)' }}>Security verification</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: timeLeft < 30 ? 'var(--danger)' : 'var(--text-muted)' }}>{fmt(timeLeft)}</span>
            <button onClick={reset} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px', display: 'flex' }}><RefreshCw size={12} /></button>
          </div>
        </div>

        {state === 'error' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 14px', background: 'rgba(229,72,77,0.07)', borderBottom: '1px solid rgba(229,72,77,0.18)' }}>
            <AlertCircle size={12} color="var(--danger)" />
            <span style={{ fontSize: '12px', color: 'var(--danger)' }}>Incorrect — {6 - attempts} attempt{6 - attempts !== 1 ? 's' : ''} left</span>
          </div>
        )}

        <div style={{ padding: '14px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', margin: '0 0 8px' }}>Type the characters you see</p>
          {/* Distorted text canvas */}
          <div style={{
            background: 'var(--bg-base)', border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '10px',
            textAlign: 'center', position: 'relative', overflow: 'hidden', userSelect: 'none',
          }}>
            {/* Noise lines */}
            {[14, 28, 42, 56, 70, 84].map((x, i) => (
              <div key={i} style={{ position: 'absolute', width: '1px', height: '100%', background: 'var(--border-subtle)', left: `${x}%`, top: 0 }} />
            ))}
            <div style={{ position: 'absolute', top: '35%', left: 0, right: 0, height: '1px', background: 'var(--border-subtle)', transform: 'rotate(-1.5deg)' }} />
            <div style={{ position: 'absolute', top: '65%', left: 0, right: 0, height: '1px', background: 'var(--border-subtle)', transform: 'rotate(1deg)' }} />
            {/* Characters with individual offsets */}
            <div style={{ display: 'inline-flex', gap: '2px', position: 'relative' }}>
              {DISTORTED_CODE.split('').map((ch, i) => (
                <span key={i} style={{
                  fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 800,
                  color: ['var(--burgundy-300)', 'var(--burgundy-200)', 'var(--accent-brass)', 'var(--burgundy-400)', 'var(--text-secondary)', 'var(--burgundy-300)'][i],
                  display: 'inline-block',
                  transform: `rotate(${[-4, 3, -6, 5, -3, 4][i]}deg) translateY(${[-2, 3, -1, 2, -3, 1][i]}px)`,
                  letterSpacing: '0.05em',
                }}>
                  {ch}
                </span>
              ))}
            </div>
          </div>

          <input
            type="text" value={textAnswer} onChange={(e) => setTextAnswer(e.target.value)}
            placeholder="Type characters above" maxLength={8} autoComplete="off" spellCheck={false}
            aria-label="Enter the distorted characters"
            style={inputSt}
          />

          <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '14px 0' }} />

          <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', margin: '0 0 6px' }}>Solve the puzzle</p>
          <p style={{ fontSize: '14px', color: 'var(--text-primary)', margin: '0 0 8px' }}>
            A library has <strong>8 shelves</strong>. Each holds <strong>4 books</strong>. How many books total? <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>(number)</span>
          </p>
          <input
            type="text" value={logicAnswer} onChange={(e) => setLogicAnswer(e.target.value)}
            placeholder="Your answer" maxLength={6} inputMode="numeric" autoComplete="off"
            aria-label="Logic puzzle answer"
            style={{ ...inputSt, marginBottom: '14px' }}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', padding: 0, fontFamily: 'var(--font-sans)' }}>
              <Volume2 size={12} /> Audio
            </button>
            <button
              onClick={handleTextSubmit}
              disabled={!textAnswer.trim() || !logicAnswer.trim() || state === 'verifying'}
              style={{
                padding: '8px 20px', fontSize: '13px', fontWeight: 600,
                background: (textAnswer && logicAnswer) ? 'var(--burgundy-600)' : 'var(--bg-elevated)',
                color: (textAnswer && logicAnswer) ? 'var(--text-primary)' : 'var(--text-muted)',
                border: `1px solid ${(textAnswer && logicAnswer) ? 'var(--burgundy-500)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)', cursor: (textAnswer && logicAnswer) ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-sans)', transition: 'all var(--transition)',
              }}
            >
              {state === 'verifying' ? 'Checking…' : 'Verify →'}
            </button>
          </div>
        </div>
      </Frame>
    )
  }

  return null
}

// ── Sub-components ──────────────────────────────────────────────

function Frame({ children }) {
  return (
    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', overflow: 'hidden' }}>
      {children}
    </div>
  )
}

function Foot({ onSkip, onVerify, canVerify, verifying }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
      <button onClick={onSkip} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', padding: 0, fontFamily: 'var(--font-sans)' }}>
        <RefreshCw size={11} /> New images
      </button>
      <button
        onClick={onVerify}
        disabled={!canVerify || verifying}
        style={{
          padding: '8px 20px', fontSize: '13px', fontWeight: 600,
          background: canVerify ? 'var(--burgundy-600)' : 'var(--bg-elevated)',
          color: canVerify ? 'var(--text-primary)' : 'var(--text-muted)',
          border: `1px solid ${canVerify ? 'var(--burgundy-500)' : 'var(--border-subtle)'}`,
          borderRadius: 'var(--radius-md)', cursor: canVerify ? 'pointer' : 'not-allowed',
          fontFamily: 'var(--font-sans)', transition: 'all var(--transition)',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}
      >
        {verifying ? 'Checking…' : <><span>Verify</span><ChevronRight size={14} /></>}
      </button>
    </div>
  )
}

const ghostBtn = {
  background: 'none', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
  color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px',
  padding: '7px 16px', fontFamily: 'var(--font-sans)',
  display: 'inline-flex', alignItems: 'center', gap: '6px',
}

const inputSt = {
  width: '100%', boxSizing: 'border-box',
  background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)',
  borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
  fontSize: '14px', padding: '9px 12px', fontFamily: 'var(--font-sans)', outline: 'none',
}
