import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Confetti from './Confetti.jsx'

// ⬇️ Schimbă aici numele și mesajul dacă vrei
const NAME = 'Ana'
const VIDEO_SRC = '/bosquito.mp4'

const PULL_DISTANCE = 230 // câți pixeli trebuie trasă panglica
const clamp = (n) => Math.min(1, Math.max(0, n))

const STAGES = ['ribbon', 'untied', 'opening', 'volume', 'video']
// ?stage=volume în URL sare direct la un pas (util pentru testare)
const initialStage = () => {
  if (typeof window === 'undefined') return 'ribbon'
  const s = new URLSearchParams(window.location.search).get('stage')
  return STAGES.includes(s) ? s : 'ribbon'
}

export default function App() {
  // stage: 'ribbon' -> 'untied' -> 'opening' -> 'volume' -> 'video'
  const [stage, setStage] = useState(initialStage)
  const [pull, setPull] = useState(() => (initialStage() === 'ribbon' ? 0 : 1))
  const [shake, setShake] = useState(false)
  const drag = useRef(null)
  const moved = useRef(false)
  const videoRef = useRef(null)

  const untie = useCallback(() => {
    setPull(1)
    setStage((s) => (s === 'ribbon' ? 'untied' : s))
  }, [])

  const addPull = useCallback(
    (amount) => {
      setPull((p) => {
        const next = clamp(p + amount)
        if (next >= 1) untie()
        return next
      })
    },
    [untie]
  )

  const onPointerDown = (e) => {
    if (stage !== 'ribbon') return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    drag.current = { x: e.clientX, y: e.clientY, base: pull }
    moved.current = false
  }

  const onPointerMove = (e) => {
    if (!drag.current || stage !== 'ribbon') return
    const dx = e.clientX - drag.current.x
    const dy = e.clientY - drag.current.y
    const dist = Math.hypot(dx, dy)
    if (dist > 6) moved.current = true
    const next = clamp(drag.current.base + dist / PULL_DISTANCE)
    setPull(next)
    if (next >= 1) {
      drag.current = null
      untie()
    }
  }

  const onPointerUp = () => {
    drag.current = null
  }

  // click / tap pe fundiță = alternativă la tras
  const onBowClick = () => {
    if (stage !== 'ribbon' || moved.current) return
    addPull(0.2)
  }

  const openBox = () => {
    if (stage !== 'untied') return
    setStage('opening')
    setTimeout(() => setStage('volume'), 1300)
  }

  const nudge = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const start = () => {
    // pornim videoul chiar în handler-ul de click => sunetul e permis de browser
    const v = videoRef.current
    setStage('video')
    if (v) {
      v.muted = false
      v.volume = 1
      v.play().catch(() => {})
    }
  }

  useEffect(() => {
    if (stage !== 'video') return
    const v = videoRef.current
    if (!v) return
    v.volume = 1
    v.muted = false
    v.play().catch(() => {})
  }, [stage])

  const opened = stage === 'opening' || stage === 'volume' || stage === 'video'

  const hint = useMemo(() => {
    if (stage === 'ribbon') {
      if (pull === 0) return 'Trage de fundiță ca să dezlegi panglica 🎀 (sau dă click pe ea)'
      if (pull < 0.5) return 'Mai tare… panglica se desface!'
      if (pull < 0.95) return 'Aproape, nu te opri! 💫'
      return 'Gata!'
    }
    if (stage === 'untied') return 'Panglica e dezlegată — apasă pe cadou ca să-l deschizi! 🎁'
    return ''
  }, [stage, pull])

  return (
    <div className="app">
      <div className="bokeh" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} style={{ '--i': i }} />
        ))}
      </div>

      {stage === 'opening' && <Confetti />}

      <header className={`title ${stage === 'video' ? 'title--small' : ''}`}>
        <h1>
          <span className="title__line1">La mulți ani</span>
          <span className="title__line2">{NAME}!</span>
        </h1>
        {stage !== 'video' && <p className="subtitle">un cadou mic, făcut special pentru tine</p>}
      </header>

      {stage !== 'video' && (
        <main className="stage" aria-live="polite">
          <div className={`scene ${opened ? 'scene--opened' : ''}`}>
            <div
              className={`gift ${stage === 'untied' ? 'gift--ready' : ''} ${opened ? 'gift--open' : ''} ${
                shake ? 'gift--shake' : ''
              }`}
              style={{ '--pull': pull }}
            >
              {/* corpul cutiei */}
              <div className="box">
                <div className="face front">
                  <i className="band-v" />
                </div>
                <div className="face back">
                  <i className="band-v" />
                </div>
                <div className="face right">
                  <i className="band-v" />
                </div>
                <div className="face left">
                  <i className="band-v" />
                </div>
                <div className="face bottom" />
                <div className="box-inner" />
              </div>

              {/* capacul */}
              <div className="lid">
                <div className="face lid-front" />
                <div className="face lid-back" />
                <div className="face lid-right" />
                <div className="face lid-left" />
                <div className="face lid-top">
                  <i className="band-v" />
                  <i className="band-h" />
                  <button
                    type="button"
                    className="bow"
                    aria-label="Trage de fundiță ca să dezlegi panglica"
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                    onClick={onBowClick}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        addPull(0.2)
                      }
                    }}
                  >
                    <svg viewBox="0 0 160 124" className="bow__svg" aria-hidden="true">
                      <defs>
                        <linearGradient id="goldLoop" x1="0" y1="0" x2="0.6" y2="1">
                          <stop offset="0%" stopColor="#fff6d4" />
                          <stop offset="45%" stopColor="#ffd166" />
                          <stop offset="100%" stopColor="#d1931f" />
                        </linearGradient>
                        <linearGradient id="goldKnot" x1="0.2" y1="0" x2="0.8" y2="1">
                          <stop offset="0%" stopColor="#fffbe8" />
                          <stop offset="55%" stopColor="#ffd98a" />
                          <stop offset="100%" stopColor="#c8891a" />
                        </linearGradient>
                        <g id="bowHalf">
                          <path
                            d="M78 62 C 66 82, 50 92, 30 116 C 41 111, 50 112, 56 118 C 61 95, 69 78, 80 67 Z"
                            fill="url(#goldLoop)"
                            stroke="rgba(150,96,10,.45)"
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M80 58 C 52 16, 6 22, 8 50 C 10 76, 56 75, 80 63 Z"
                            fill="url(#goldLoop)"
                            stroke="rgba(150,96,10,.45)"
                            strokeWidth="1.8"
                            strokeLinejoin="round"
                          />
                        </g>
                      </defs>
                      <use href="#bowHalf" />
                      <use href="#bowHalf" transform="translate(160,0) scale(-1,1)" />
                      <ellipse
                        cx="80"
                        cy="60"
                        rx="16"
                        ry="14"
                        fill="url(#goldKnot)"
                        stroke="rgba(150,96,10,.45)"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="shadow" aria-hidden="true" />
              <div className="glow" aria-hidden="true" />
            </div>
          </div>

          {stage === 'untied' && (
            <button type="button" className="tap-zone" onClick={openBox} aria-label="Deschide cadoul" />
          )}

          {stage === 'ribbon' && (
            <div className="meter" aria-hidden="true">
              <div className="meter__fill" style={{ width: `${pull * 100}%` }} />
            </div>
          )}

          {hint && <p className="hint">{hint}</p>}
        </main>
      )}

      {stage === 'volume' && (
        <div className="overlay">
          <div className="overlay__card">
            <div className="overlay__icon">🔊</div>
            <h2 className="overlay__title">Dă sunetul la MAXIM!</h2>
            <p className="overlay__text">
              Serios, la maxim. Urmează un videoclip și fără sunet nu are niciun sens. 🎶
            </p>
            <button type="button" className="cta" onClick={start}>
              Sunetul e la maxim ▶ Pornește
            </button>
          </div>
        </div>
      )}

      {(stage === 'volume' || stage === 'video') && (
        <main className={`player ${stage === 'volume' ? 'player--hidden' : ''}`}>
          <video
            ref={videoRef}
            className="video"
            src={VIDEO_SRC}
            controls
            playsInline
            preload="auto"
          />
          <div className="player__actions">
            <button
              type="button"
              className="ghost"
              onClick={() => {
                const v = videoRef.current
                if (v) {
                  v.currentTime = 0
                  v.play().catch(() => {})
                }
              }}
            >
              ↺ Încă o dată
            </button>
            <button
              type="button"
              className="ghost"
              onClick={() => {
                setPull(0)
                setStage('ribbon')
                nudge()
              }}
            >
              🎁 Împachetează din nou
            </button>
          </div>
        </main>
      )}
    </div>
  )
}
