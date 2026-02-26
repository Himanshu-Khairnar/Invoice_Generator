import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import UserImage from "@/models/userImage.model";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

async function getUserId(request: NextRequest): Promise<string | null> {
  try {
    const token =
      request.headers.get("x-access-token") ||
      request.cookies.get("access_token")?.value ||
      (await cookies()).get("access_token")?.value;
    if (!token) return null;
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    return payload.userId ?? null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const image = await UserImage.findOne({ userId }).lean();
    return NextResponse.json({ success: true, data: image ?? null }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { bussinessLogo } = await request.json();
    const image = await UserImage.findOneAndUpdate(
      { userId },
      { bussinessLogo },
      { new: true, upsert: true }
    );
    return NextResponse.json({ success: true, data: image }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
