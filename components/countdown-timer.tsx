"use client"

import { Heart } from "lucide-react"
import { useEffect, useState } from "react"

interface CountdownTimerProps {
  weddingDate: string
  onComplete?: () => void
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  isComplete: boolean
}

export default function CountdownTimer({ weddingDate, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(weddingDate).getTime() - new Date().getTime()

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isComplete: true,
        })
        if (onComplete) {
          onComplete()
        }
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds, isComplete: false })
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [weddingDate, onComplete])

  if (timeLeft.isComplete) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-sage-50 rounded-2xl p-12 shadow-lg border border-emerald-200 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Heart className="w-12 h-12 text-emerald-600 fill-emerald-600 animate-pulse" />
          <h2 className="text-5xl font-bold text-emerald-700">To'y Boshlandi!</h2>
          <Heart className="w-12 h-12 text-emerald-600 fill-emerald-600 animate-pulse" />
        </div>
        <p className="text-2xl text-sage-700 font-medium">Bizning baxtli kunimiz keldi!</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-white to-emerald-50/30 rounded-3xl p-10 shadow-xl border border-emerald-100">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-sage-800 mb-2">To'ygacha qoldi</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-sage-500 rounded-full mx-auto"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Days */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-white rounded-2xl p-6 shadow-lg border-2 border-emerald-200 hover:border-emerald-300 transition-all hover:scale-105 text-center">
            <div className="text-5xl font-bold text-emerald-600 mb-2">{timeLeft.days}</div>
            <div className="text-sm font-semibold text-sage-600 uppercase tracking-wider">Kun</div>
          </div>
        </div>

        {/* Hours */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-sage-400 to-sage-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-white rounded-2xl p-6 shadow-lg border-2 border-sage-200 hover:border-sage-300 transition-all hover:scale-105 text-center">
            <div className="text-5xl font-bold text-sage-600 mb-2">{timeLeft.hours}</div>
            <div className="text-sm font-semibold text-sage-600 uppercase tracking-wider">Soat</div>
          </div>
        </div>

        {/* Minutes */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-sage-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-white rounded-2xl p-6 shadow-lg border-2 border-emerald-200 hover:border-emerald-300 transition-all hover:scale-105 text-center">
            <div className="text-5xl font-bold text-emerald-700 mb-2">{timeLeft.minutes}</div>
            <div className="text-sm font-semibold text-sage-600 uppercase tracking-wider">Daqiqa</div>
          </div>
        </div>

        {/* Seconds */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-sage-500 to-emerald-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-white rounded-2xl p-6 shadow-lg border-2 border-sage-200 hover:border-sage-300 transition-all hover:scale-105 text-center">
            <div className="text-5xl font-bold text-sage-700 mb-2">{timeLeft.seconds}</div>
            <div className="text-sm font-semibold text-sage-600 uppercase tracking-wider">Soniya</div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2">
        <Heart className="w-5 h-5 text-emerald-500 fill-emerald-500" />
        <p className="text-sage-600 text-sm font-medium">Sizni kutamiz</p>
        <Heart className="w-5 h-5 text-emerald-500 fill-emerald-500" />
      </div>
    </div>
  )
}
