import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/user.model";
import connectDB from "@/lib/mongodb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: code!,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: "authorization_code"
    })
  });

  const tokenData = await tokenRes.json();

  const profileRes = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`
      }
    }
  );

  const profile = await profileRes.json();

  await connectDB();

  let user = await User.findOne({ email: profile.email });

  if (!user) {
    user = await User.create({
      fullname: profile.name,
      email: profile.email,
      profilePicture: profile.picture,
      provider: "google",
      providerId: profile.sub
    });
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  const response = NextResponse.redirect("http://localhost:3000/dashboard");

  response.cookies.set("access_token", token, {
    httpOnly: true,
    secure: true,
    path: "/"
  });

  return response;
}
