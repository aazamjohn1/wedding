"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { WeddingInfo } from "@/lib/types"
import { Car, Clock, Compass, MapPin, Navigation, Phone } from "lucide-react"
import { useState } from "react"

interface LocationSectionProps {
  weddingInfo: WeddingInfo | null
}

export default function LocationSection({ weddingInfo }: LocationSectionProps) {
  const [mapLoaded, setMapLoaded] = useState(false)

  if (!weddingInfo) return null

  const openInMaps = () => {
    const address = encodeURIComponent(`${weddingInfo.venue}, ${weddingInfo.address}`)
    const mapsUrl = `https://yandex.com/maps/org/137312223024?si=8rrhkurfevka3dexmmm1b289cw`
    window.open(mapsUrl, "_blank")
  }

  const getDirections = () => {
    const directionsUrl = `https://yandex.com/maps/org/137312223024?si=8rrhkurfevka3dexmmm1b289cw`
    window.open(directionsUrl, "_blank")
  }

  return (
    <div className="min-h-screen islamic-dark-bg islamic-animated-bg islamic-pattern-overlay nav-mobile-spacing mt-6">
      <div className="max-w-4xl mx-auto p-4 space-y-6 pt-8 mt-6">
        {/* Header */}
        <div className="text-center islamic-glass-effect rounded-3xl p-6 mt-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <MapPin className="w-7 h-7 text-emerald-400 islamic-floating-glow" />
            <h2 className="text-3xl font-bold islamic-glow-text">To'y Manzili</h2>
            <Compass className="w-7 h-7 text-emerald-400 islamic-floating-glow" />
          </div>
          <p className="text-gray-400 leading-relaxed">
            Bizning baxtli kunimizga yo'l topishingiz uchun batafsil ma'lumot
          </p>
        </div>

        {/* Venue Information */}
        <Card className="islamic-glass-effect border-0 shadow-2xl">
          <CardContent className="p-6">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold islamic-glow-text mb-3">{weddingInfo.venue}</h3>
              <p className="text-gray-400 text-lg leading-relaxed">{weddingInfo.address}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Event Details */}
              <div className="space-y-6">
                <div className="islamic-dark-card rounded-2xl p-5 border border-emerald-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-6 h-6 text-emerald-600" />
                    <h4 className="font-semibold text-gray-500 text-lg">Marosim vaqti</h4>
                  </div>
                  <div className="ml-9 space-y-2">
                    <p className="text-gray-400">
                   {(() => {
    const date = new Date(weddingInfo.weddingDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
    return `${year}-${month}-${day} ${weekday}`;
  })()}
                    </p>
                    <p className="text-emerald-500 font-semibold text-xl">{weddingInfo.time}</p>
                  </div>
                </div>

                <div className="islamic-dark-card rounded-2xl p-5 border border-emerald-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Car className="w-6 h-6 text-emerald-600" />
                    <h4 className="font-semibold text-gray-500 text-lg">Transport</h4>
                  </div>
                  <div className="ml-9 space-y-2">
                    <p className="text-gray-400">Bepul avtoturargoh mavjud</p>
                    <p className="text-gray-400 ">Taksi: Yandex Go</p>
                  </div>
                </div>

                <div className="islamic-dark-card rounded-2xl p-5 border border-emerald-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Phone className="w-6 h-6 text-emerald-600" />
                    <h4 className="font-semibold text-gray-500 text-lg">Aloqa</h4>
                  </div>
                  <div className="ml-9 space-y-2">
                    <p className="text-gray-400">+998 94 970 77 09</p>
                    <p className="text-gray-400">Savollar va yo'l ko'rsatish uchun</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-6">
                <Button
                  onClick={openInMaps}
                  className="w-full islamic-glow-button text-white font-semibold py-4 rounded-xl shadow-2xl smooth-transition h-16 text-lg"
                >
                  <MapPin className="w-6 h-6 mr-3" />
                  Xaritada Ko'rish
                </Button>

                <Button
                  onClick={getDirections}
                  variant="outline"
                  className="w-full islamic-dark-card border-emerald-500/30 text-gray-700 hover:bg-emerald-500/20 py-4 rounded-xl bg-emerald-500/10 h-16 text-lg font-semibold"
                >
                  <Navigation className="w-6 h-6 mr-3" />
                  Yo'nalish Olish
                </Button>

                <div className="bg-gradient-to-r from-emerald-500/20 to-amber-500/20 p-5 rounded-2xl border border-emerald-500/30">
                  <p className="text-sm text-gray-500 text-center leading-relaxed">
                    <strong className="text-gray-600">Muhim eslatma:</strong> Marosim vaqtidan 30 daqiqa oldin
                    kelishingizni so'raymiz. Kechikish holatida aloqa raqamiga qo'ng'iroq qiling.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Embedded Map */}
        <Card className="islamic-glass-effect border-0 shadow-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="relative h-80 md:h-96">
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-500/20 to-amber-500/20">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-emerald-400 mx-auto mb-4 islamic-floating-glow" />
                    <p className="text-gray-400 text-lg">Xarita yuklanmoqda...</p>
                  </div>
                </div>
              )}
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1381.338144269265!2d72.6534769505116!3d40.59676681691484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38bc55007bd609d7%3A0xe9bcb02c0e756c32!2sMuhammadyahyo!5e0!3m2!1sen!2s!4v1752749767658!5m2!1sen!2s"  width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setMapLoaded(true)}
                className="rounded-b-3xl"></iframe>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="islamic-dark-card border border-emerald-500/20 shadow-lg">
            <CardContent className="p-6 text-center">
              <h4 className="font-semibold text-gray-500 mb-2 flex items-center justify-center gap-2">
                <span className="text-gray-500">👔</span>
                Kiyim-kechak
              </h4>
              <p className="text-gray-400 text-sm">Rasmiy kiyim tavsiya etiladi</p>
            </CardContent>
          </Card>

          <Card className="islamic-dark-card border border-emerald-500/20 shadow-lg">
            <CardContent className="p-6 text-center">
              <h4 className="font-semibold text-gray-500 mb-2 flex items-center justify-center gap-2">
                <span className="text-amber-400">🎁</span>
                Sovg'alar
              </h4>
              <p className="text-gray-400 text-sm">Sizning kelishingiz eng yaxshi sovg'a!</p>
            </CardContent>
          </Card>

          <Card className="islamic-dark-card border border-emerald-500/20 shadow-lg">
            <CardContent className="p-6 text-center">
              <h4 className="font-semibold text-gray-500 mb-2 flex items-center justify-center gap-2">
                <span className="text-emerald-400">🕌</span>
                Marosim
              </h4>
              <p className="text-gray-400 text-sm">Nikoh va to'y marosimi</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
