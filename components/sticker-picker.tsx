"use client"

import type { Sticker } from "@/lib/types"

const stickers: Sticker[] = [

  { id: "1", emoji: "🎉", name: "Bayram" },
  { id: "2", emoji: "💍", name: "Nikoh" },
  { id: "3", emoji: "❤️", name: "Muhabbat" },
  { id: "4", emoji: "🎂", name: "Tug'ilgan kun" },
  { id: "5", emoji: "🎈", name: "Shodlik" },
  { id: "6", emoji: "🌹", name: "Gul" },
  { id: "7", emoji: "🥳", name: "Bayramona" },
  { id: "8", emoji: "💐", name: "Gullar" },
  { id: "9", emoji: "🎊", name: "Tadbir"},
  { id: "10", emoji: "✨", name: "Yorqinlik" },
  { id: "11", emoji: "🌸", name: "Lola" },
  { id: "12", emoji: "🌟", name: "Yulduz" },

]

interface StickerPickerProps {
  onSelect: (sticker: string) => void
  selectedSticker?: string
}

export default function StickerPicker({ onSelect, selectedSticker }: StickerPickerProps) {
  return (
    <div className="dark-card border border-white/20 rounded-2xl p-4">
      <p className="text-sm font-medium text-gray-300 mb-4 text-center">Stiker tanlang</p>
      <div className="grid grid-cols-6 gap-3">
        {stickers.map((sticker) => (
 <button
  key={sticker.id}
  onClick={() => onSelect(sticker.emoji)}
  className={`p-1 text-lg sm:text-2xl rounded-xl transition-all hover:scale-110 ${
    selectedSticker === sticker.emoji
      ? "bg-white/20 ring-2 ring-pink-400 shadow-lg"
      : "hover:bg-white/10 hover:shadow-md"
  }`}
  title={sticker.name}
>
  {sticker.emoji}
</button>
        ))}
      </div>
    </div>
  )
}
