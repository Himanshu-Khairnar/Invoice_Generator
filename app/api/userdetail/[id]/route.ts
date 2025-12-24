import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import PersonalDetail from "@/models/userDetail.model";

// GET single user detail by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const userDetail = await PersonalDetail.findById(params.id);

    if (!userDetail) {
      return NextResponse.json(
        { success: false, error: "User detail not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: userDetail },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update user detail
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const body = await request.json();
    const userDetail = await PersonalDetail.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!userDetail) {
      return NextResponse.json(
        { success: false, error: "User detail not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: userDetail },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// DELETE user detail
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const userDetail = await PersonalDetail.findByIdAndDelete(params.id);

    if (!userDetail) {
      return NextResponse.json(
        { success: false, error: "User detail not found" },
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
