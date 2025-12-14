"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Mail, UserIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("wedding-user")
    if (storedUser) {
      router.push("/")
    }
  }, [router])

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google"
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      })

      const data = await response.json()
      if (data.user) {
        localStorage.setItem("wedding-user", JSON.stringify(data.user))
        router.push("/")
      }
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-rose-50 via-green-50 to-white relative overflow-hidden">
      {/* Background decoration */}


      <div className="w-full max-w-md relative z-10">
        {/* Back button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-gray-600 hover:text-green-400">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Orqaga
          </Button>
        </Link>

        <Card className="romantic-glass-effect border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            {/* <div className="flex justify-center mb-4">
              <Heart className="w-16 h-16 text-green-500 heart-pulse" />
            </div> */}
            <CardTitle className="text-3xl font-bold text-gray-800 font-playfair">Xush kelibsiz!</CardTitle>
            <CardDescription className="text-gray-600 font-cormorant text-lg">
              To'y marosimimizga qo'shilish uchun kirish
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Google Login */}
            <Button
              onClick={handleGoogleLogin}
              className="w-full h-14 bg-white hover:bg-gray-50 text-gray-800 border-2 border-green-200 hover:border-green-100 font-semibold rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google orqali kirish
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 text-gray-500 bg-white">yoki</span>
              </div>
            </div>

            {/* Email Login Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  Ismingiz
                </label>
                <Input
                  type="text"
                  placeholder="To'liq ismingizni kiriting"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 border-green-200 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="email@misol.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-green-200 rounded-xl"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !name.trim() || !email.trim()}
                className="w-full h-14 romantic-glow-button text-white font-semibold rounded-xl shadow-lg text-lg"
              >
                {loading ? "Yuklanmoqda..." : "Kirish"}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6 font-cormorant">
              Kirib, siz bizning maxfiylik siyosatimiz va foydalanish shartlarimizga rozilik bildirasiz
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
