"use client"

import { useEffect, useState } from "react"

export default function CelebrationAnimation() {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: string; color: string; delay: string }>>([])
  const [fireworks, setFireworks] = useState<
    Array<{ id: number; left: string; top: string; color: string; delay: string }>
  >([])

  useEffect(() => {
    // Generate confetti pieces
    const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: ["#ff6b9d", "#ffa07a", "#ffd700", "#ff69b4", "#ffb6c1"][Math.floor(Math.random() * 5)],
      delay: `${Math.random() * 3}s`,
    }))
    setConfetti(confettiPieces)

    // Generate firework particles
    const fireworkParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${20 + Math.random() * 60}%`,
      top: `${20 + Math.random() * 40}%`,
      color: ["#ff6b9d", "#ffa07a", "#ffd700", "#ff69b4", "#ffb6c1"][Math.floor(Math.random() * 5)],
      delay: `${Math.random() * 2}s`,
    }))
    setFireworks(fireworkParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Confetti */}
      {confetti.map((piece) => (
        <div
          key={`confetti-${piece.id}`}
          className="confetti-piece"
          style={{
            left: piece.left,
            backgroundColor: piece.color,
            animation: `confetti-fall ${3 + Math.random() * 2}s linear infinite`,
            animationDelay: piece.delay,
          }}
        />
      ))}

      {/* Fireworks */}
      {fireworks.map((particle) => (
        <div
          key={`firework-${particle.id}`}
          className="firework-particle"
          style={{
            left: particle.left,
            top: particle.top,
            backgroundColor: particle.color,
            animation: `firework 1s ease-out infinite`,
            animationDelay: particle.delay,
            // @ts-ignore
            "--x": `${(Math.random() - 0.5) * 200}px`,
            "--y": `${(Math.random() - 0.5) * 200}px`,
          }}
        />
      ))}
    </div>
  )
}
