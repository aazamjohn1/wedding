import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ wishId: string }> }) {
  try {
    const { wishId } = await params
    const { userId, userName, userAvatar, message, parentReplyId } = await request.json()

    if (!ObjectId.isValid(wishId)) {
      return NextResponse.json({ error: "Invalid wish ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("ravshan-wedding")

    const newReply = {
      _id: new ObjectId(),
      userId,
      userName,
      userAvatar,
      message,
      parentReplyId: parentReplyId || null, // Store parent reply ID for nested comments
      createdAt: new Date(),
    }

    const result = await db
      .collection("wishes")
      .updateOne({ _id: new ObjectId(wishId) }, { $push: { replies: newReply } } as any)

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Wish not found" }, { status: 404 })
    }

    return NextResponse.json({ reply: newReply })
  } catch (error) {
    console.error("Failed to add reply:", error)
    return NextResponse.json({ error: "Failed to add reply" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ wishId: string }> }) {
  try {
    const { wishId } = await params

    if (!ObjectId.isValid(wishId)) {
      return NextResponse.json({ error: "Invalid wish ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("ravshan-wedding")

    const wish = await db.collection("wishes").findOne({ _id: new ObjectId(wishId) })

    if (!wish) {
      return NextResponse.json({ error: "Wish not found" }, { status: 404 })
    }

    return NextResponse.json({ replies: wish.replies || [] })
  } catch (error) {
    console.error("Failed to fetch replies:", error)
    return NextResponse.json({ error: "Failed to fetch replies" }, { status: 500 })
  }
}