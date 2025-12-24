import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/user.model";
import connectDB from "@/lib/mongodb";

export async function POST(req: Request) {
  const { fullname, email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  await connectDB();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullname,
    email,
    password: hashedPassword,
    provider: "credentials",
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  const response = NextResponse.json(
    { success: true, status: 201, data: { user, access_token: token } },
    { status: 201 }
  );

  response.cookies.set("access_token", token, {
    httpOnly: true,
    secure: true,
    path: "/",
  });

  return response;
}
