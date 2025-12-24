import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import BankDetail from "@/models/bankDetail.model";


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const bankDetail = await BankDetail.findById(params.id);

    if (!bankDetail) {
      return NextResponse.json(
        { success: false, error: "Bank detail not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: bankDetail },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const body = await request.json();
    const bankDetail = await BankDetail.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!bankDetail) {
      return NextResponse.json(
        { success: false, error: "Bank detail not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: bankDetail },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const bankDetail = await BankDetail.findByIdAndDelete(params.id);

    if (!bankDetail) {
      return NextResponse.json(
        { success: false, error: "Bank detail not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
