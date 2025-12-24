import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import UserImage from "@/models/userImage.model";


export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const filter = userId ? { userId } : {};
    const userImages = await UserImage.find(filter);

    return NextResponse.json(
      { success: true, data: userImages },
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
    const userImage = await UserImage.create(body);

    return NextResponse.json(
      { success: true, data: userImage },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
