import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Invoice from "@/models/invoice.model";


export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const filter = userId ? { userId } : {};
    const invoices = await Invoice.find(filter)
      .populate("userImageId")
      .populate("userDetailId")
      .populate("clientDetailId")
      .populate("bankDetails");

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

    const body = await request.json();
    const invoice = await Invoice.create(body);

    return NextResponse.json({ success: true, data: invoice }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
