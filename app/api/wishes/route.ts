import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { type NextRequest, NextResponse } from "next/server"
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const client = await clientPromise
    const db = client.db("ravshan-wedding")
    const wishes = await db.collection("wishes").find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()

    return NextResponse.json({ wishes })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch wishes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, userName, message, sticker } = await request.json()

    const client = await clientPromise
    const db = client.db("ravshan-wedding")

    const newWish = {
      userId,
      userName,
      message,
      sticker,
      createdAt: new Date(),
      reactions: {
        like: [],
        funny: [],
        insightful: [],
      },
      replies: [],
    }

    const result = await db.collection("wishes").insertOne(newWish)
    const wish = { ...newWish, _id: result.insertedId }

    return NextResponse.json({ wish })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create wish" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { _id, userId, message, sticker } = await request.json()

    if (!ObjectId.isValid(_id)) {
      return NextResponse.json({ error: "Invalid wish ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("ravshan-wedding")

    const result = await db.collection("wishes").updateOne(
      { _id: new ObjectId(_id), userId: userId }, // Ensure only the owner can edit
      { $set: { message, sticker, updatedAt: new Date() } },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Wish not found or unauthorized" }, { status: 404 })
    }

    const updatedWish = await db.collection("wishes").findOne({ _id: new ObjectId(_id) })

    return NextResponse.json({ wish: updatedWish })
  } catch (error) {
    console.error("Failed to update wish:", error)
    return NextResponse.json({ error: "Failed to update wish" }, { status: 500 })
  }
}
