import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { images, primaryColor, secondaryColor, audioUrl } = await request.json()

    const client = await clientPromise
    const db = client.db("ravshan-wedding")

    const result = await db.collection("wedding-info").updateOne(
      {},
      {
        $set: {
          images,
          primaryColor,
          secondaryColor,
          audioUrl,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    )

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Failed to update media:", error)
    return NextResponse.json({ error: "Failed to update media" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("ravshan-wedding")

    const weddingInfo = await db.collection("wedding-info").findOne({})

    return NextResponse.json({
      images: weddingInfo?.images || [],
      primaryColor: weddingInfo?.primaryColor || "#10b981",
      secondaryColor: weddingInfo?.secondaryColor || "#fbbf24",
      audioUrl: weddingInfo?.audioUrl || "",
    })
  } catch (error) {
    console.error("Failed to fetch media:", error)
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 })
  }
}
