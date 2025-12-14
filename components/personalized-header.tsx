"use client"

import type { WeddingInfo } from "@/lib/types"
import { Calendar, Clock, MapPin } from "lucide-react"
import { useEffect, useState } from "react"

interface PersonalizedHeaderProps {
  weddingInfo: WeddingInfo | null
  guestName?: string
}

export default function PersonalizedHeader({ weddingInfo, guestName }: PersonalizedHeaderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!weddingInfo || !mounted) return null

  return (
    <div className="min-h-screen romantic-animated-bg romantic-pattern-overlay flex items-center justify-center p-4 nav-mobile-spacing">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="romantic-floating-glow absolute top-20 left-10 text-4xl">🌿</div>
        <div className="romantic-floating-glow absolute top-40 right-16 text-3xl" style={{ animationDelay: "1s" }}>
          🍃
        </div>
        <div className="romantic-floating-glow absolute bottom-40 left-20 text-3xl" style={{ animationDelay: "2s" }}>
          💚
        </div>
        <div className="romantic-floating-glow absolute bottom-32 right-10 text-4xl" style={{ animationDelay: "3s" }}>
          🌱
        </div>
        <div className="romantic-floating-glow absolute top-1/2 left-1/4 text-2xl" style={{ animationDelay: "4s" }}>
          ✨
        </div>
      </div>

      <div className="romantic-glass-effect rounded-3xl p-8 md:p-12 max-w-2xl w-full text-center shadow-2xl relative z-10">
        {/* Bismillah */}
        <div className="mb-8">
          <p className="text-2xl md:text-3xl font-playfair font-bold text-emerald-600 mb-2">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
          <p className="text-sm text-gray-500 font-cormorant">Bismillahir Rohmanir Rohiym</p>
        </div>

        {/* Main invitation */}
        <div className="space-y-8">
          <div className="flex justify-center">
            {/* <Heart className="w-16 h-16 md:w-20 md:h-20 text-emerald-500 heart-pulse" /> */}
          </div>

          <div>
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-4 font-cormorant">
              You are invited to the wedding of
            </p>
            <h1 className="text-5xl md:text-6xl font-playfair font-bold romantic-glow-text mb-6">
              {weddingInfo.groomName}
            </h1>
            <div className="flex items-center justify-center gap-4 my-6">
              <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent flex-1 max-w-24"></div>
              <span className="text-4xl md:text-5xl romantic-floating-glow">💍</span>
              <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent flex-1 max-w-24"></div>
            </div>
            <h1 className="text-5xl md:text-6xl font-playfair font-bold romantic-glow-text">{weddingInfo.brideName}</h1>
          </div>


          <div className="romantic-card rounded-2xl p-6 md:p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-gray-700 mb-6">Wedding Details</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200 smooth-transition hover:shadow-md">
                <Calendar className="w-6 h-6 md:w-7 md:h-7 text-emerald-500" />
                <div className="text-left">
                  <p className="font-semibold text-gray-700 font-cormorant text-sm">Date</p>
                  <p className="text-gray-600 font-cormorant text-base md:text-lg">
                    {(() => {
                      const date = new Date(weddingInfo.weddingDate)
                      const year = date.getFullYear()
                      const month = String(date.getMonth() + 1).padStart(2, "0")
                      const day = String(date.getDate()).padStart(2, "0")
                      const weekday = date.toLocaleDateString("en-US", { weekday: "short" })
                      return `${year}-${month}-${day} ${weekday}`
                    })()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200 smooth-transition hover:shadow-md">
                <Clock className="w-6 h-6 md:w-7 md:h-7 text-emerald-500" />
                <div className="text-left">
                  <p className="font-semibold text-gray-700 font-cormorant text-sm">Time</p>
                  <p className="text-gray-600 font-cormorant text-lg md:text-xl font-medium">{weddingInfo.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200 smooth-transition hover:shadow-md">
                <MapPin className="w-6 h-6 md:w-7 md:h-7 text-emerald-500" />
                <div className="text-left">
                  <p className="font-semibold text-gray-700 font-cormorant text-sm">Venue</p>
                  <p className="text-gray-600 font-cormorant text-base md:text-lg font-medium">{weddingInfo.venue}</p>
                  <p className="text-sm text-gray-500 font-cormorant">{weddingInfo.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Long invitation text */}
          <div className="romantic-card rounded-2xl p-6 md:p-8 text-left">
            <div className="space-y-4 text-gray-600 leading-relaxed font-cormorant">
              <p className="text-lg md:text-xl">
                <span className="romantic-glow-text font-playfair font-bold text-xl md:text-2xl">
                  Dear {guestName ? decodeURIComponent(guestName) : "Guest"}!
                </span>
              </p>
              <p className="text-base md:text-lg">
                We want to celebrate the most important and happy day of our lives with you. We sincerely ask you to
                participate in our wedding ceremony and witness our first steps in a new life path.
              </p>
              <p className="text-base md:text-lg">
                Your presence at this sacred ceremony will make our happiness even more complete. We look forward to
                sharing these unforgettable moments with our family members and closest friends.
              </p>
              <p className="text-center mt-6">
                <span className="romantic-glow-text font-playfair font-bold text-xl md:text-2xl">
                  Your presence is our greatest gift! 💝
                </span>
              </p>
            </div>
          </div>

          {/* Islamic blessing with green theme */}
          <div className="bg-gradient-to-r from-emerald-100 to-amber-100 p-6 rounded-2xl border border-emerald-200 shadow-sm">
            <p className="text-base md:text-lg text-emerald-700 font-semibold font-cormorant">
              "May Allah unite you and bless you"
            </p>
            <p className="text-sm text-gray-500 mt-2 font-cormorant italic">
              Alloh sizlarni birlashtirsin va sizlarga baraka bersin
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
