import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/user.model";
import connectDB from "@/lib/mongodb";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const loginUrl = new URL("/login", req.url);

  // Handle user denying permission
  if (error) {
    loginUrl.searchParams.set("error", "oauth_denied");
    return NextResponse.redirect(loginUrl);
  }

  // Validate required params
  if (!code || !state) {
    loginUrl.searchParams.set("error", "oauth_invalid");
    return NextResponse.redirect(loginUrl);
  }

  // Verify CSRF state
  const cookieStore = await cookies();
  const savedState = cookieStore.get("oauth_state")?.value;

  if (!savedState || savedState !== state) {
    loginUrl.searchParams.set("error", "oauth_state_mismatch");
    return NextResponse.redirect(loginUrl);
  }

  // Exchange authorization code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: "authorization_code"
    })
  });

  if (!tokenRes.ok) {
    loginUrl.searchParams.set("error", "oauth_token_failed");
    return NextResponse.redirect(loginUrl);
  }

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    loginUrl.searchParams.set("error", "oauth_no_token");
    return NextResponse.redirect(loginUrl);
  }

  // Fetch user profile from Google
  const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` }
  });

  if (!profileRes.ok) {
    loginUrl.searchParams.set("error", "oauth_profile_failed");
    return NextResponse.redirect(loginUrl);
  }

  const profile = await profileRes.json();

  if (!profile.email) {
    loginUrl.searchParams.set("error", "oauth_no_email");
    return NextResponse.redirect(loginUrl);
  }

  await connectDB();

  // Find or create user
  let user = await User.findOne({ email: profile.email });

  if (!user) {
    user = await User.create({
      fullname: profile.name,
      email: profile.email,
      profilePicture: profile.picture,
      provider: "google",
      providerId: profile.sub
    });
  } else if (user.provider === "google" && user.profilePicture !== profile.picture) {
    // Keep profile picture in sync
    user.profilePicture = profile.picture;
    await user.save();
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  const response = NextResponse.redirect(new URL("/homepage", req.url));

  // Clear the CSRF state cookie
  response.cookies.set("oauth_state", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/"
  });

  response.cookies.set("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });

  return response;
}
