"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Reply, User } from "@/lib/types"
import { ChevronDown, ChevronUp, MessageCircle, Send, X } from "lucide-react"
import { useEffect, useState } from "react"

interface ExtendedReply extends Reply {
  parentReplyId?: string
  replies?: ExtendedReply[]
}

interface WishReplySectionProps {
  wishId: string
  user: User | null
  onSignupRequired: () => void
  replyCount?: number
  onReplyCountChange?: (count: number) => void
}

export default function WishReplySection({ 
  wishId, 
  user, 
  onSignupRequired,
  replyCount = 0,
  onReplyCountChange 
}: WishReplySectionProps) {
  const [replies, setReplies] = useState<ExtendedReply[]>([])
  const [newReply, setNewReply] = useState("")
  const [loading, setLoading] = useState(false)
  const [showMainReplies, setShowMainReplies] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyingTo, setReplyingTo] = useState<{ id: string; name: string } | null>(null)
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchReplies()
  }, [wishId])

  useEffect(() => {
    if (showMainReplies && replies.length === 0) {
      fetchReplies()
    }
  }, [showMainReplies])

  const fetchReplies = async () => {
    try {
      const response = await fetch(`/api/wishes/${wishId}/replies`)
      const data = await response.json()
      if (data.replies) {
        const organized = organizeReplies(data.replies)
        setReplies(organized)
        onReplyCountChange?.(data.replies.length)
      }
    } catch (error) {
      console.error("Failed to fetch replies:", error)
    }
  }

  const organizeReplies = (allReplies: ExtendedReply[]): ExtendedReply[] => {
    const replyMap = new Map<string, ExtendedReply>()
    const rootReplies: ExtendedReply[] = []

    allReplies.forEach(reply => {
      replyMap.set(reply._id?.toString() || '', { ...reply, replies: [] })
    })

    allReplies.forEach(reply => {
      const replyObj = replyMap.get(reply._id?.toString() || '')
      if (!replyObj) return

      if (reply.parentReplyId) {
        const parent = replyMap.get(reply.parentReplyId)
        if (parent) {
          parent.replies = parent.replies || []
          parent.replies.push(replyObj)
        } else {
          rootReplies.push(replyObj)
        }
      } else {
        rootReplies.push(replyObj)
      }
    })

    return rootReplies
  }

  const handleSubmitReply = async () => {
    if (!user) {
      onSignupRequired()
      return
    }

    if (!newReply.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/wishes/${wishId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          userName: user.name,
          userAvatar: user.avatar,
          message: newReply,
          parentReplyId: replyingTo?.id || null,
        }),
      })

      const data = await response.json()
      if (data.reply) {
        await fetchReplies()
        setNewReply("")
        setShowReplyForm(false)
        setReplyingTo(null)
      }
    } catch (error) {
      console.error("Failed to submit reply:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleNestedReplies = (replyId: string) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev)
      if (newSet.has(replyId)) {
        newSet.delete(replyId)
      } else {
        newSet.add(replyId)
      }
      return newSet
    })
  }

  const renderReply = (reply: ExtendedReply) => {
    const hasReplies = reply.replies && reply.replies.length > 0
    const isExpanded = expandedReplies.has(reply._id?.toString() || '')
    
    return (
      <div key={reply._id?.toString()} className="space-y-3">
        <div className="flex gap-2 sm:gap-3">
          <Avatar className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 ring-2 ring-white shadow-sm">
            <AvatarImage src={reply.userAvatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-400 text-white text-xs font-semibold">
              {reply.userName[0]}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0 space-y-2">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-bold text-xs sm:text-sm text-gray-900">{reply.userName}</span>
                <span className="text-[10px] sm:text-xs text-gray-400">
                  {new Date(reply.createdAt).toLocaleDateString("uz-UZ", {
                    day: 'numeric',
                    month: 'short'
                  })}
                </span>
              </div>
              <p className="text-sm sm:text-[15px] text-gray-800 leading-relaxed break-words">{reply.message}</p>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4 px-1 sm:px-2 flex-wrap">
              <button
                onClick={() => {
                  if (user) {
                    setReplyingTo({ id: reply._id?.toString() || '', name: reply.userName })
                    setShowReplyForm(true)
                  } else {
                    onSignupRequired()
                  }
                }}
                className="text-[11px] sm:text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors duration-200"
              >
                Javob berish
              </button>

              {hasReplies && (
                <button
                  onClick={() => toggleNestedReplies(reply._id?.toString() || '')}
                  className="text-[11px] sm:text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200 flex items-center gap-1"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>Yashirish ({reply.replies?.length})</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>Javoblar ({reply.replies?.length})</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Nested Replies */}
            {hasReplies && isExpanded && (
              <div className="ml-4 sm:ml-6 pl-3 sm:pl-4 border-l-2 border-indigo-200 space-y-3 sm:space-y-4 mt-3 animate-in slide-in-from-left-2 duration-300">
                {reply.replies?.map(nestedReply => (
                  <div key={nestedReply._id?.toString()} className="flex gap-2 sm:gap-3">
                    <Avatar className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0 ring-2 ring-white shadow-sm">
                      <AvatarImage src={nestedReply.userAvatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-400 text-white text-[10px] sm:text-xs font-semibold">
                        {nestedReply.userName[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl px-2.5 sm:px-3 py-2 sm:py-2.5 shadow-sm hover:shadow-md transition-shadow duration-200 border border-indigo-100">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-bold text-xs sm:text-sm text-gray-900">{nestedReply.userName}</span>
                          <span className="text-[10px] sm:text-xs text-gray-400">
                            {new Date(nestedReply.createdAt).toLocaleDateString("uz-UZ", {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-800 leading-relaxed break-words">{nestedReply.message}</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          if (user) {
                            setReplyingTo({ id: reply._id?.toString() || '', name: reply.userName })
                            setShowReplyForm(true)
                          } else {
                            onSignupRequired()
                          }
                        }}
                        className="text-[11px] sm:text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors duration-200 px-1 sm:px-2"
                      >
                        Javob berish
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4 sm:mt-6 space-y-3">
      {/* Main Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => (user ? setShowReplyForm(true) : onSignupRequired())}
          className="text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 flex items-center gap-1.5 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
        >
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium">Izoh qo'shish</span>
        </Button>

        {replies.length > 0 && (
          <button
            onClick={() => setShowMainReplies(!showMainReplies)}
            className="text-[11px] sm:text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200 flex items-center gap-1 px-2"
          >
            {showMainReplies ? (
              <>
                <ChevronUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Yashirish ({replies.length || 0})</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Izohlar ({replies.length || 0})</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-indigo-200 p-3 sm:p-4 shadow-lg animate-in slide-in-from-bottom-2 duration-300">
          {replyingTo && (
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" />
                <span className="text-xs sm:text-sm text-gray-600">
                  <span className="font-semibold text-indigo-600">{replyingTo.name}</span>
                  <span className="text-gray-400"> ga javob</span>
                </span>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          )}
          
          <div className="flex gap-2 sm:gap-3">
            <Avatar className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 ring-2 ring-indigo-100">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-400 text-white text-xs font-semibold">
                {user?.name[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2 sm:space-y-3">
              <Textarea
                placeholder={replyingTo ? `${replyingTo.name}ga javob...` : "Izoh qoldiring..."}
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                className="min-h-[70px] sm:min-h-[90px] resize-none bg-gray-50 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-xl text-xs sm:text-sm"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmitReply}
                  disabled={loading || !newReply.trim()}
                  size="sm"
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-200 font-semibold h-8 sm:h-9 text-xs sm:text-sm px-3 sm:px-4"
                >
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                  {loading ? "..." : "Yuborish"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowReplyForm(false)
                    setReplyingTo(null)
                    setNewReply("")
                  }}
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
                >
                  Bekor
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Replies List */}
      {showMainReplies && (
        <div className="border-t border-gray-200 pt-3 sm:pt-4 space-y-3 sm:space-y-4 animate-in slide-in-from-top-2 duration-500">
          {replies.length > 0 ? (
            replies.map(reply => renderReply(reply))
          ) : (
            <div className="text-center py-8 sm:py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-200">
              <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-gray-300" />
              <p className="text-gray-400 text-xs sm:text-sm font-medium">Hali izohlar yo'q</p>
              <p className="text-gray-300 text-[10px] sm:text-xs mt-1">Birinchi izoh qoldiruvchi bo'ling!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}