import clientPromise from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state") || "/"

    if (!code) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?error=no_code`)
    }

    // Exchange code for token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?error=no_token`)
    }

    // Get user info
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    const googleUser = await userResponse.json()

    // Save or update user in database
    const client = await clientPromise
    const db = client.db("ravshan-wedding")

    let user = await db.collection("users").findOne({ googleId: googleUser.id })

    if (!user) {
      user = await db.collection("users").findOne({ email: googleUser.email })

      if (user) {
        // Update existing user with Google info
        await db.collection("users").updateOne(
          { _id: user._id },
          {
            $set: {
              googleId: googleUser.id,
              avatar: googleUser.picture,
              name: user.name || googleUser.name,
            },
          },
        )
      } else {
        // Create new user
        const newUser = {
          name: googleUser.name,
          email: googleUser.email,
          googleId: googleUser.id,
          avatar: googleUser.picture,
          createdAt: new Date(),
        }
        const result = await db.collection("users").insertOne(newUser)
        user = { ...newUser, _id: result.insertedId }
      }
    }

    // Redirect with user data
    const redirectUrl = new URL(state, process.env.NEXT_PUBLIC_APP_URL)
    redirectUrl.searchParams.append(
      "user",
      JSON.stringify({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }),
    )

    return NextResponse.redirect(redirectUrl.toString())
  } catch (error) {
    console.error("Google auth error:", error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?error=auth_failed`)
  }
}
