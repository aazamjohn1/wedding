"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Share2, Copy, Check, User, Sparkles } from "lucide-react"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [guestName, setGuestName] = useState("")
  const [copied, setCopied] = useState(false)

  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const personalizedUrl = guestName ? `${baseUrl}?guest=${encodeURIComponent(guestName)}` : baseUrl

  const handleShare = async () => {
    if (navigator.share && guestName) {
      try {
        await navigator.share({
          title: `${guestName} - Asadbek va Hilola to'yi taklifnomasi`,
          text: `Assalomu alaykum ${guestName}! Sizni Asadbek va Hilola nikoh to'yiga taklif qilamiz!`,
          url: personalizedUrl,
        })
      } catch (error) {
        console.log("Ulashish bekor qilindi")
      }
    } else {
      handleCopyLink()
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(personalizedUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Havola nusxalanmadi")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90%] max-w-md mx-auto islamic-glass-effect border-0 text-white">
        <DialogHeader>
          <div className="text-center mb-6">
            <div className="islamic-floating-glow mb-4">
              <Share2 className="w-12 h-12 text-emerald-400 mx-auto" />
            </div>
            <DialogTitle className="text-2xl font-bold islamic-glow-text mb-3">Shaxsiy Taklif Yuborish</DialogTitle>
            <p className="text-gray-300 leading-relaxed">
              Do'stingiz ismini kiriting va maxsus shaxsiy taklifnoma yuboring
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label htmlFor="guestName" className="text-gray-200 font-medium flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-emerald-400" />
              Mehmon ismi
            </Label>
            <div className="relative">
              <Input
                id="guestName"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Masalan: Akmal Karimov"
                className="bg-emerald-500/10 border-emerald-500/30 text-white placeholder:text-gray-400 focus:border-emerald-400 focus:ring-emerald-400 h-12"
              />
            </div>
          </div>

          {guestName && (
            <div className="islamic-dark-card rounded-2xl p-4 border border-emerald-500/20">
              <p className="text-sm text-gray-300 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <strong>Shaxsiy havola:</strong>
              </p>
              <p className="text-xs text-gray-400 bg-emerald-500/10 p-3 rounded-lg break-all border border-emerald-500/20">
                {personalizedUrl}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleShare}
              disabled={!guestName}
              className="flex-1 islamic-glow-button text-white font-semibold py-3 rounded-xl shadow-2xl smooth-transition"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Ulashish
            </Button>

            <Button
              onClick={handleCopyLink}
              disabled={!guestName}
              variant="outline"
              className="flex-1 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 py-3 rounded-xl bg-emerald-500/10"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Nusxalandi!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Nusxalash
                </>
              )}
            </Button>
          </div>

          <div className="bg-gradient-to-r from-emerald-500/20 to-amber-500/20 p-4 rounded-2xl border border-emerald-500/30">
            <p className="text-xs text-gray-300 text-center leading-relaxed">
              Shaxsiy havolani ulashganingizda, mehmon o'z ismi bilan maxsus taklifnomani ko'radi va Bismillah bilan
              boshlanadigan to'liq taklifni oladi
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
