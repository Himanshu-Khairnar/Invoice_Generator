import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import UserImage from "@/models/userImage.model";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const userImage = await UserImage.findById(params.id);

    if (!userImage) {
      return NextResponse.json(
        { success: false, error: "User image not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: userImage },
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
    const userImage = await UserImage.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!userImage) {
      return NextResponse.json(
        { success: false, error: "User image not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: userImage },
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

    const userImage = await UserImage.findByIdAndDelete(params.id);

    if (!userImage) {
      return NextResponse.json(
        { success: false, error: "User image not found" },
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
