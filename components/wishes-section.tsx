"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import type { User, Wish } from "@/lib/types"
import { ChevronDown, Edit, Laugh, Lightbulb, Loader2, MessageCircle, Send, ThumbsUp } from "lucide-react"
import { useEffect, useState } from "react"
import StickerPicker from "./sticker-picker"
import WishReplySection from "./wish-reply-section"

interface WishesSectionProps {
  user: User | null
  onSignupRequired: () => void
}

export default function WishesSection({ user, onSignupRequired }: WishesSectionProps) {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [newWish, setNewWish] = useState("")
  const [selectedSticker, setSelectedSticker] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [showStickerPicker, setShowStickerPicker] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const [editingWishId, setEditingWishId] = useState<string | null>(null)
  const [editedWishMessage, setEditedWishMessage] = useState("")
  const [editedWishSticker, setEditedWishSticker] = useState("")

  useEffect(() => {
    fetchWishes()
  }, [])

  const fetchWishes = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoading(true)
      else setLoadingMore(true)

      const response = await fetch(`/api/wishes?page=${pageNum}&limit=5`)
      const data = await response.json()

      if (data.wishes) {
        if (append) {
          setWishes((prev) => [...prev, ...data.wishes])
        } else {
          setWishes(data.wishes)
        }
        setHasMore(data.wishes.length === 5)
      }
    } catch (error) {
      console.error("Tilaklar yuklanmadi:", error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMoreWishes = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchWishes(nextPage, true)
  }

  const handleSubmitWish = async () => {
    if (!user) {
      onSignupRequired()
      return
    }

    if (!newWish.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          userName: user.name,
          message: newWish,
          sticker: selectedSticker,
        }),
      })

      const data = await response.json()
      if (data.wish) {
        setWishes([data.wish, ...wishes])
        setNewWish("")
        setSelectedSticker("")
        setShowStickerPicker(false)
      }
    } catch (error) {
      console.error("Tilak yuborilmadi:", error)
    } finally {
      setLoading(false)
    }
  }
  const handleEditClick = (wish: Wish) => {
    setEditingWishId(wish._id || null)
    setEditedWishMessage(wish.message)
    setEditedWishSticker(wish.sticker || "")
    setShowStickerPicker(false)
  }

  const handleSaveEdit = async (wishId: string) => {
    if (!user || !editedWishMessage.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/wishes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: wishId,
          userId: user._id,
          message: editedWishMessage,
          sticker: editedWishSticker,
        }),
      })

      const data = await response.json()
      if (data.wish) {
        setWishes((prevWishes) =>
          prevWishes.map((w) =>
            w._id === wishId ? { ...w, message: data.wish.message, sticker: data.wish.sticker } : w,
          ),
        )
        setEditingWishId(null)
        setEditedWishMessage("")
        setEditedWishSticker("")
      } else {
        console.error("Failed to save edit:", data.error)
      }
    } catch (error) {
      console.error("Failed to save edit:", error)
    } finally {
      setLoading(false)
    }
  }
  const handleCancelEdit = () => {
    setEditingWishId(null)
    setEditedWishMessage("")
    setEditedWishSticker("")
  }

  const handleReaction = async (wishId: string, reactionType: "like" | "funny" | "insightful") => {
    if (!user) {
      onSignupRequired()
      return
    }

    try {
      const response = await fetch("/api/wishes/react", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wishId, userId: user._id, reactionType }),
      })

      const data = await response.json()
      if (data.wish) {
        setWishes((prevWishes) =>
          prevWishes.map((w) => (w._id === wishId ? { ...w, reactions: data.wish.reactions } : w)),
        )
      } else {
        console.error("Failed to update reaction:", data.error)
      }
    } catch (error) {
      console.error("Failed to update reaction:", error)
    }
  }

  return (
    <div className="min-h-screen dark-romantic-bg animated-bg islamic-pattern-overlay flex items-center justify-center p-4 nav-mobile-spacing mt-6">
      <div className="md:max-w-xl max-w-sm mx-auto p-4 space-y-6 pt-8">
        {/* Header */}
        <div className="text-center dark-glass-effect rounded-3xl p-6 mt-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            {/* <Heart className="w-7 h-7 text-pink-400 floating-hearts-glow" /> */}
            <h2 className="text-3xl font-bold glow-text">Tilaklar va Tabriklar</h2>
            {/* <Heart className="w-7 h-7 text-green-400 floating-hearts-glow" /> */}
          </div>
          <p className="text-gray-300 leading-relaxed">
            Yosh juftlikka o'z tilak va tabriklaringizni qoldiring va ularning baxtiga hissa qo'shing
          </p>
        </div>

        {/* New Wish Form */}
        <Card className="islamic-glass-effect border-0 shadow-2xl">
          <CardContent className="p-6 space-y-6">
            <Textarea
              placeholder={
                user
                  ? "Juftlikka tilak va tabriklaringizni yozing..."
                  : "Tilak yozish uchun avval ro'yxatdan o'ting!"
              }
              value={newWish}
              onChange={(e) => setNewWish(e.target.value)}
              className="min-h-[120px] resize-none bg-white/10 border-white/20 text-gray-900 placeholder:text-green-gray-100 focus:ring-pink-400"
              disabled={!user}
            />

            {user && (
              <>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowStickerPicker(!showStickerPicker)}
                    className="border-green-500 text-gray-500 hover:bg-green/10 bg-gray-100 hover:text-gray-900"
                  >
                    {selectedSticker || "😊"} Stiker qo'shish
                  </Button>
                  {selectedSticker && (
                    <span className="text-sm text-gray-500 bg-red/60 px-2 py-1 rounded-full border border-green-500 hover:text-gray-900">
                      Tanlangan: {selectedSticker}
                    </span>
                  )}
                </div>

                {showStickerPicker && (
                  <StickerPicker
                    onSelect={(sticker) => {
                      setSelectedSticker(sticker)
                      setShowStickerPicker(false)
                    }}
                    selectedSticker={selectedSticker}
                  />
                )}
              </>
            )}

            <Button
              onClick={user ? handleSubmitWish : onSignupRequired}
              disabled={loading || (!newWish.trim() && user)}
              className="w-full glow-button text-white font-semibold py-4 rounded-xl shadow-2xl smooth-transition h-14 text-lg"
            >
              <Send className="w-5 h-5 mr-2" />
              {loading ? "Yuborilmoqda..." : user ? "Tilak Yuborish" : "Ro'yxatdan O'tish"}
            </Button>
          </CardContent>
        </Card>

        {/* Wishes List */}
        <div className="space-y-4">
          {wishes.map((wish) => (
            <Card key={wish._id} className="clean-glass-effect rounded-2xl p-5 border border-gray-200 shadow-md">
              <CardContent className="p-6">
                {editingWishId === wish._id ? (
                  // Edit mode
                  <div className="space-y-4">
                    <Textarea
                      value={editedWishMessage}
                      onChange={(e) => setEditedWishMessage(e.target.value)}
                      className="min-h-[100px] resize-none bg-gray-100 border-gray-300 text-gray-800 focus:border-green-500 focus:ring-green-500"
                    />
                    <StickerPicker onSelect={setEditedWishSticker} selectedSticker={editedWishSticker} />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSaveEdit(wish._id!)}
                        disabled={loading || !editedWishMessage.trim()}
                        className="flex-1 screenshot-button-gradient text-white font-semibold"
                      >
                        {loading ? "Saqlanmoqda..." : "Saqlash"}
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                        className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 bg-transparent"
                      >
                        Bekor qilish
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Display mode
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {wish.userName === "Ravshanbek" && <span className="text-2xl">😊</span>}
                        {wish.userName === "Madinaxon" && <span className="text-2xl">💍</span>}
                        <span className="font-bold text-gray-800 text-lg">{wish.userName.split("@")[0]}</span>
                      </div>
                      <span className="wish-card-date-pill">
                        {new Date(wish.createdAt).toLocaleDateString("uz-UZ", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="wish-card-message-bubble">
                      <p className="text-gray-700 leading-relaxed">{wish.message}</p>
                    </div>
                    {wish.sticker && <div className="text-3xl text-right mt-2">{wish.sticker}</div>}

                    {/* Reactions and Edit Button */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex gap-2">
                        {user ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReaction(wish._id!, "like")}
                              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                                wish.reactions?.like.includes(user._id!)
                                  ? "bg-blue-100 text-blue-600"
                                  : "text-gray-500 hover:bg-gray-100"
                              }`}
                            >
                              <ThumbsUp className="w-4 h-4" />
                              {wish.reactions?.like.length || 0}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReaction(wish._id!, "funny")}
                              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                                wish.reactions?.funny.includes(user._id!)
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "text-gray-500 hover:bg-gray-100"
                              }`}
                            >
                              <Laugh className="w-4 h-4" />
                              {wish.reactions?.funny.length || 0}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReaction(wish._id!, "insightful")}
                              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                                wish.reactions?.insightful.includes(user._id!)
                                  ? "bg-purple-100 text-purple-600"
                                  : "text-gray-500 hover:bg-gray-100"
                              }`}
                            >
                              <Lightbulb className="w-4 h-4" />
                              {wish.reactions?.insightful.length || 0}
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={onSignupRequired}
                              className="text-gray-500 hover:bg-gray-100"
                            >
                              <ThumbsUp className="w-4 h-4" />
                              {wish.reactions?.like.length || 0}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={onSignupRequired}
                              className="text-gray-500 hover:bg-gray-100"
                            >
                              <Laugh className="w-4 h-4" />
                              {wish.reactions?.funny.length || 0}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={onSignupRequired}
                              className="text-gray-500 hover:bg-gray-100"
                            >
                              <Lightbulb className="w-4 h-4" />
                              {wish.reactions?.insightful.length || 0}
                            </Button>
                          </>
                        )}
                      </div>
                      {user && wish.userId === user._id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(wish)}
                          className="border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Tahrirlash
                        </Button>
                      )}
                    </div>

                    <WishReplySection wishId={wish._id!} user={user} onSignupRequired={onSignupRequired} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {/* Load More Button */}
 {hasMore && wishes.length > 0 && (
  <div className="text-center py-6">
    <Button
      onClick={loadMoreWishes}
      disabled={loadingMore}
      className="relative overflow-hidden px-6 py-3 rounded-full group border-0 romantic-glow-button text-white font-semibold shadow-lg smooth-transition"
    >
      <span className="relative z-10 flex items-center gap-2">
        {loadingMore ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-base">Yuklanmoqda...</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-5 h-5" />
            <span className="text-base">Ko'proq ko'rish</span>
            {/* <ChevronDown className="w-5 h-5 group-hover:animate-bounce" /> */}
          </>
        )}
      </span>
      {/* <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
    </Button>
  </div>
)}

          {wishes.length === 0 && !loading && (
            <div className="text-center py-16 dark-glass-effect rounded-3xl">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-300 text-lg mb-2">Hali tilaklar yo'q</p>
              <p className="text-gray-400">Birinchi bo'lib tilak yozing va yosh juftlikni xursand qiling!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
