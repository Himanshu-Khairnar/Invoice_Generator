import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import BankDetail from "@/models/bankDetail.model";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

function getToken(request: NextRequest) {
  return (
    request.headers.get("x-access-token") ||
    request.cookies.get("access_token")?.value ||
    null
  );
}

async function getUserId(request: NextRequest): Promise<string | null> {
  try {
    const token =
      getToken(request) ?? (await cookies()).get("access_token")?.value;
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
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const bankDetails = await BankDetail.find({ userId });
    return NextResponse.json({ success: true, data: bankDetails }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const bankDetail = await BankDetail.create({ ...body, userId });
    return NextResponse.json({ success: true, data: bankDetail }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
