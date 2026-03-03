import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import User from "@/models/user.model";
import { verifyOtp } from "@/lib/otp";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ success: false, error: "Email and OTP are required." }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email }).select("loginOtp loginOtpExpiry _id");
    if (!user || !user.loginOtp || !user.loginOtpExpiry) {
      return NextResponse.json({ success: false, error: "Invalid or expired OTP." }, { status: 400 });
    }

    if (user.loginOtpExpiry < new Date()) {
      return NextResponse.json({ success: false, error: "OTP has expired. Please request a new one." }, { status: 400 });
    }

    const valid = await verifyOtp(otp, user.loginOtp);
    if (!valid) {
      return NextResponse.json({ success: false, error: "Invalid OTP. Please try again." }, { status: 400 });
    }

    // Clear OTP after successful use
    await User.findByIdAndUpdate(user._id, { $unset: { loginOtp: "", loginOtpExpiry: "" } });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.set("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
