"use client"

import AnimatedBackground from "@/components/animated-background"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Check, Copy, Facebook, MessageCircle, Share2, Sparkles, Twitter, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SharePage() {
  const router = useRouter()
  const [guestName, setGuestName] = useState("")
  const [copied, setCopied] = useState(false)

  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const personalizedUrl = guestName ? `${baseUrl}?guest=${encodeURIComponent(guestName)}` : baseUrl

  const handleShare = async () => {
    if (navigator.share && guestName) {
      try {
        await navigator.share({
          title: `${guestName} - Ravshanbek va Madinaxon to'yi taklifnomasi`,
          text: `Assalomu alaykum ${guestName}! Sizni Ravshanbek va Madinaxon nikoh to'yiga taklif qilamiz!`,
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

  const shareToSocial = (platform: string) => {
    if (!guestName) return

    const text = encodeURIComponent(
      `Assalomu alaykum ${guestName}! Sizni Ravshanbek va Madinaxon nikoh to'yiga taklif qilamiz!`,
    )
    const url = encodeURIComponent(personalizedUrl)

    let shareUrl = ""
    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${text}%20${url}`
        break
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400")
    }
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Back button */}
          <div className="mb-6">
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="romantic-nav-glass rounded-full px-6 py-3 text-emerald-600 hover:bg-emerald-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Orqaga
            </Button>
          </div>

          {/* Main card */}
          <div className="romantic-glass-effect rounded-3xl p-8 md:p-12 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="romantic-floating-glow mb-6 inline-block">
                <div className="bg-gradient-to-br from-emerald-400 to-amber-400 p-6 rounded-3xl shadow-xl">
                  <Share2 className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold romantic-glow-text mb-4 font-playfair">
                Share Wedding Invitation
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed font-cormorant">
                Create a personalized invitation link for your friends and family
              </p>
            </div>

            {/* Input section */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="guestName" className="text-gray-700 font-semibold flex items-center gap-2 mb-3 text-lg">
                  <User className="w-5 h-5 text-emerald-500" />
                  Guest Name
                </Label>
                <div className="relative">
                  <Input
                    id="guestName"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Enter guest name (e.g., Akmal Karimov)"
                    className="bg-white border-2 border-emerald-200 text-gray-700 placeholder:text-gray-400 focus:border-emerald-400 focus:ring-emerald-400 h-14 text-lg rounded-xl font-cormorant"
                  />
                </div>
              </div>

              {guestName && (
                <div className="romantic-card rounded-2xl p-6 border-2 border-emerald-200 animate-in fade-in slide-in-from-bottom-4">
                  <p className="text-sm text-gray-600 mb-3 flex items-center gap-2 font-cormorant">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <strong className="text-emerald-700">Personalized Link:</strong>
                  </p>
                  <p className="text-sm text-gray-700 bg-emerald-50 p-4 rounded-xl break-all border border-emerald-200 font-mono">
                    {personalizedUrl}
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={handleShare}
                    disabled={!guestName}
                    className="romantic-glow-button text-white font-semibold py-6 rounded-xl shadow-2xl text-lg"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share Invitation
                  </Button>

                  <Button
                    onClick={handleCopyLink}
                    disabled={!guestName}
                    variant="outline"
                    className="border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 py-6 rounded-xl bg-white font-semibold text-lg"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5 mr-2" />
                        Copy Link
                      </>
                    )}
                  </Button>
                </div>

                {/* Social media buttons */}
                {guestName && (
                  <div className="pt-6 border-t-2 border-emerald-100">
                    <p className="text-center text-gray-600 mb-4 font-semibold font-cormorant">
                      Share directly on social media
                    </p>
                    <div className="grid md:grid-cols-3 grid-cols-2 gap-3">
                      <Button
                        onClick={() => shareToSocial("whatsapp")}
                        className="bg-green-500 hover:bg-green-600 text-white py-6 rounded-xl shadow-lg"
                      >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        WhatsApp
                      </Button>
                      <Button
                        onClick={() => shareToSocial("facebook")}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl shadow-lg"
                      >
                        <Facebook className="w-5 h-5 mr-2" />
                        Facebook
                      </Button>
                      <Button
                        onClick={() => shareToSocial("twitter")}
                        className="bg-sky-500 hover:bg-sky-600 text-white py-6 rounded-xl shadow-lg"
                      >
                        <Twitter className="w-5 h-5 mr-2" />
                        Twitter
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Info box */}
              <div className="bg-gradient-to-r from-emerald-50 to-amber-50 p-6 rounded-2xl border-2 border-emerald-200">
                <p className="text-sm text-gray-700 leading-relaxed text-center font-cormorant">
                  When you share a personalized link, your guest will see a special invitation with their name and
                  receive the full invitation starting with Bismillah
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
