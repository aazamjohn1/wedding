"use client"

import { Button } from "@/components/ui/button"
import { Heart, Home, MapPin } from "lucide-react"
import { useState } from "react"

interface NavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export default function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { id: "home", label: "Bosh sahifa", icon: Home },
    { id: "wishes", label: "Tilaklar", icon: Heart },
    { id: "location", label: "Manzil", icon: MapPin },
  ]

  return (
    <>

      {/* Navigation */}
      <nav
        className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 md:top-6 md:bottom-auto transition-all duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-100 visible"
        }`}
      >
        <div className="romantic-nav-glass rounded-2xl p-3 shadow-2xl">
          <div className="flex justify-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id)
                    setIsMenuOpen(false)
                  }}
                  variant="ghost"
                  className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 p-3 md:px-4 md:py-3 rounded-xl smooth-transition font-cormorant ${
                    activeSection === item.id
                      ? "romantic-glow-button text-white shadow-lg"
                      : "text-emerald-600 hover:text-white hover:bg-emerald-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs md:text-sm font-medium">{item.label}</span>
                </Button>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  )
}
