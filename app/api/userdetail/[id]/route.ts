import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import PersonalDetail from "@/models/userDetail.model";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const userDetail = await PersonalDetail.findById(id);

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const body = await request.json();
    const userDetail = await PersonalDetail.findByIdAndUpdate(id, body, {
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const userDetail = await PersonalDetail.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!userDetail) {
      return NextResponse.json(
        { success: false, error: "User detail not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: userDetail }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const userDetail = await PersonalDetail.findByIdAndDelete(id);

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
