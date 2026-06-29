import { motion } from 'framer-motion'
import { useMemo } from 'react'

const ORBS = [
  { size: 420, color: 'rgba(167, 139, 250, 0.35)', x: '10%', y: '15%', delay: 0 },
  { size: 320, color: 'rgba(34, 211, 238, 0.25)', x: '75%', y: '20%', delay: 1.2 },
  { size: 280, color: 'rgba(244, 114, 182, 0.22)', x: '60%', y: '65%', delay: 0.6 },
  { size: 200, color: 'rgba(129, 140, 248, 0.3)', x: '20%', y: '70%', delay: 1.8 },
]

export default function AnimatedBackground() {
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 4 + 4,
        delay: Math.random() * 3,
      })),
    [],
  )

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#07070d]" />

      <motion.div
        className="absolute inset-0 opacity-60"
        animate={{
          background: [
            'radial-gradient(ellipse 80% 60% at 20% 30%, rgba(124,58,237,0.25), transparent 60%)',
            'radial-gradient(ellipse 70% 55% at 80% 25%, rgba(6,182,212,0.2), transparent 55%)',
            'radial-gradient(ellipse 75% 65% at 50% 70%, rgba(236,72,153,0.18), transparent 60%)',
            'radial-gradient(ellipse 80% 60% at 20% 30%, rgba(124,58,237,0.25), transparent 60%)',
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="absolute inset-0 grid-bg" />

      {ORBS.map((orb) => (
        <motion.div
          key={`${orb.x}-${orb.y}`}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: orb.color,
          }}
          animate={{
            y: [0, -30, 10, 0],
            x: [0, 15, -10, 0],
            scale: [1, 1.08, 0.95, 1],
          }}
          transition={{
            duration: 10 + orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}

      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-white/30"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
          }}
          animate={{
            opacity: [0.1, 0.6, 0.1],
            y: [0, -40, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#07070d] to-transparent" />
    </div>
  )
}
