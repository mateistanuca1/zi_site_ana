import { useMemo } from 'react'

const COLORS = ['#ff5d8f', '#ffd166', '#8ec5ff', '#b388ff', '#7ef7c3', '#fff1a8']

export default function Confetti({ count = 110 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        left: Math.random() * 100,
        delay: Math.random() * 1.2,
        duration: 2.6 + Math.random() * 2.4,
        size: 6 + Math.random() * 8,
        rot: Math.random() * 360,
        drift: -60 + Math.random() * 120,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        round: Math.random() > 0.65,
      })),
    [count]
  )

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * (p.round ? 1 : 1.8)}px`,
            background: p.color,
            borderRadius: p.round ? '50%' : '2px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--rot': `${p.rot}deg`,
            '--drift': `${p.drift}px`,
          }}
        />
      ))}
    </div>
  )
}
