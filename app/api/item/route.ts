import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Item from "@/models/item.model";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// GET all items
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const token = (await cookies()).get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");

    const filter: any = {};
    if (payload.userId) filter.userId = payload.userId;
    if (status) filter.status = status;

    const items = await Item.find(filter);

    return NextResponse.json({ success: true, data: items }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new item
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
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

    const { productNo, productName, productPrice, taxSlab } =
      await request.json();

    if (!productNo || !productName || !productPrice || !taxSlab) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
    const item = await Item.create({
      userId: payload.userId,
      productNo,
      productName,
      productPrice,
      taxSlab,
    });

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
