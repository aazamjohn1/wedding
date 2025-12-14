export interface User {
  _id?: string
  name: string
  email?: string
  googleId?: string
  avatar?: string
  createdAt: Date
}

export interface WeddingInfo {
  _id?: string
  brideName: string
  groomName: string
  weddingDate: string
  venue: string
  address: string
  time: string
  description: string
  images?: string[]
  primaryColor?: string
  secondaryColor?: string
  audioUrl?: string
}

export interface Wish {
  _id?: string
  userId: string
  userName: string
  message: string
  sticker?: string
  createdAt: Date
  reactions?: {
    like: string[]
    funny: string[]
    insightful: string[]
  }
  replies?: Reply[]
}

export interface Reply {
  _id?: string
  userId: string
  userName: string
  userAvatar?: string
  message: string
  createdAt: Date
}

export interface Sticker {
  id: string
  emoji: string
  name: string
}
