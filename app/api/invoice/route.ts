import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Invoice from "@/models/invoice.model";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";


export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Use request.cookies to reliably read the token whether the call
    // comes from the browser directly or is a server-to-server fetch
    // with a forwarded Cookie header.
    const token =
      request.headers.get("x-access-token") ||
      request.cookies.get("access_token")?.value ||
      (await cookies()).get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    if (!payload.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const invoices = await Invoice.find({ userId: payload.userId })
      .populate("userImageId")
      .populate("userDetailId")
      .populate("clientDetailId")
      .populate("bankDetails")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: invoices },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const token =
      request.headers.get("x-access-token") ||
      request.cookies.get("access_token")?.value ||
      (await cookies()).get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    if (!payload.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const invoice = await Invoice.create({ ...body, userId: payload.userId });

    return NextResponse.json({ success: true, data: invoice }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
