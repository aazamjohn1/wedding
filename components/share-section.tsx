"use client"

import { Button } from "@/components/ui/button"
import { Check, Copy, Share2, Users } from "lucide-react"
import { useState } from "react"

export default function ShareSection() {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "To'y taklifnomasi - Ravshanbek va Madinaxon",
          text: "Bizning to'y marosimimizga taklif qilamiz!",
          url: shareUrl,
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
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Havola nusxalanmadi")
    }
  }

  return (
    <div className="p-6 bg-gradient-to-r from-emerald-100 via-green-50 to-amber-100 islamic-pattern">
      <div className="islamic-border">
        <div className="islamic-border-content p-6 text-center space-y-4">
          <Users className="w-12 h-12 text-emerald-600 mx-auto" />
          <div>
            <h3 className="text-xl font-bold text-emerald-800 mb-2">Do'stlaringizni taklif qiling!</h3>
            <p className="text-gray-600">
              Oila a'zolari va do'stlaringizni bizning baxtli kunimizda ishtirok etishga taklif qiling
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleShare}
              className="bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-700 hover:to-amber-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Taklifnomani Ulashish
            </Button>

            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-6 py-3 rounded-lg bg-transparent"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Nusxalandi!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Havolani Nusxalash
                </>
              )}
            </Button>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-amber-50 rounded-lg">
            <p className="text-sm text-emerald-800 font-medium">"Yaxshi xabarni tarqating va ajr oling"</p>
          </div>
        </div>
      </div>
    </div>
  )
}
