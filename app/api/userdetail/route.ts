import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import PersonalDetail from "@/models/userDetail.model";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type");

    const filter: any = {};
    if (userId) filter.userId = userId;
    if (type) filter.type = type;

    const userDetails = await PersonalDetail.find(filter);

    return NextResponse.json(
      { success: true, data: userDetails },
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
    const userDetail = await PersonalDetail.create(body);

    return NextResponse.json(
      { success: true, data: userDetail },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
