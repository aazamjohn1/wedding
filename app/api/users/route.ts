import clientPromise from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json()

    const client = await clientPromise
    const db = client.db("ravshan-wedding")

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ user: existingUser })
    }

    // Create new user
    const newUser = {
      name,
      email,
      createdAt: new Date(),
    }

    const result = await db.collection("users").insertOne(newUser)
    const user = { ...newUser, _id: result.insertedId }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("[v0] Failed to create user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("ravshan-wedding")
    const users = await db.collection("users").find({}).toArray()

    return NextResponse.json({ users })
  } catch (error) {
    console.error("[v0] Failed to fetch users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
