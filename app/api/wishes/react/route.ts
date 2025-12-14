import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // console.log("Reaction updated successfully")
    const { wishId, userId, reactionType } = await request.json()

    if (!ObjectId.isValid(wishId)) {
      return NextResponse.json({ error: "Invalid wish ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("ravshan-wedding")

    const wishCollection = db.collection("wishes")

    const wish = await wishCollection.findOne({ _id: new ObjectId(wishId) })

    if (!wish) {
      return NextResponse.json({ error: "Wish not found" }, { status: 404 })
    }

    const currentReactions = wish.reactions || { like: [], funny: [], insightful: [] }
    const reactionArray = currentReactions[reactionType as keyof typeof currentReactions] || []

    let updateOperation: any

    if (reactionArray.includes(userId)) {
      // User already reacted, so remove the reaction (toggle off)
      updateOperation = { $pull: { [`reactions.${reactionType}`]: userId } }
    } else {
      // User has not reacted, so add the reaction (toggle on)
      updateOperation = { $addToSet: { [`reactions.${reactionType}`]: userId } }
    }

    const result = await wishCollection.updateOne({ _id: new ObjectId(wishId) }, updateOperation)

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Failed to update reaction" }, { status: 500 })
    }

    const updatedWish = await wishCollection.findOne({ _id: new ObjectId(wishId) })

    return NextResponse.json({ wish: updatedWish })
  } catch (error) {
    console.error("Failed to update reaction:", error)
    return NextResponse.json({ error: "Failed to update reaction" }, { status: 500 })
  }
  
}
