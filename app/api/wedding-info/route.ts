import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("ravshan-wedding")
    const weddingInfo = await db.collection("wedding-info").findOne({})

    return NextResponse.json({ weddingInfo })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch wedding info" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const weddingData = await request.json()

    const client = await clientPromise
    const db = client.db("ravshan-wedding")

    // Update or insert wedding info
    const result = await db
      .collection("wedding-info")
      .replaceOne({}, { ...weddingData, updatedAt: new Date() }, { upsert: true })

    return NextResponse.json({ success: true, result })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save wedding info" }, { status: 500 })
  }
}
