import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import BankDetail from "@/models/bankDetail.model";


export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const filter = userId ? { userId } : {};
    const bankDetails = await BankDetail.find(filter);

    return NextResponse.json(
      { success: true, data: bankDetails },
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
    const bankDetail = await BankDetail.create(body);

    return NextResponse.json(
      { success: true, data: bankDetail },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
