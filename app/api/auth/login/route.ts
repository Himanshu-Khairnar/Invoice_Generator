import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/user.model";
import connectDB from "@/lib/mongodb";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  await connectDB();

  const user = await User.findOne({ email });

  if (!user || !user.password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  
  const { password: _, ...safeUser } = user.toObject();
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

const response = NextResponse.json(
    { success: true, status: 201, data: {user: safeUser, access_token: token } },
    { status: 201 }
  );
  response.cookies.set("access_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/"
  });

  return response;
}
