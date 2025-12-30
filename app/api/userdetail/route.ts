import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import PersonalDetail from "@/models/userDetail.model";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

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

    const {
      type,
      name,
      phoneNumber,
      email,
      website,
      cin,
      gstin,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      postalCode,
    } = await request.json();
    if (
      type === undefined ||
      !name ||
      !phoneNumber ||
      !email ||
      !addressLine1 ||
      !city ||
      !state ||
      !country ||
      !postalCode
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
    const token = (await cookies()).get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    if (!payload.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (type === "userDetail") {
      const existingDetail = await PersonalDetail.findOne({
        userId: payload.userId,
        type: "userDetail",
      });
      if (existingDetail) {
        const updatedDetail = await PersonalDetail.findByIdAndUpdate(
          existingDetail._id,
          {
            name,
            phoneNumber,
            email,
            website,
            cin,
            gstin,
            addressLine1,
            addressLine2,
            city,
            state,
            country,
            postalCode,
          },
          { new: true }
        );
        return NextResponse.json(
          { success: true, data: updatedDetail },
          { status: 200 }
        );
      }
    }

    const userDetail = await PersonalDetail.create({
      userId: payload.userId,
      type,
      name,
      phoneNumber,
      email,
      website,
      cin,
      gstin,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      postalCode,
    });

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
