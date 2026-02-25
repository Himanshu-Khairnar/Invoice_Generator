import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Invoice from "@/models/invoice.model";

// Public endpoint — no auth required.
// The client (invoice receiver) clicks "Pay" from the email link.

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const invoice = await Invoice.findById(id)
      .populate("userDetailId")
      .populate("clientDetailId")
      .populate("bankDetails");

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: invoice }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const invoice = await Invoice.findByIdAndUpdate(
      id,
      { status: "payment done", paidAmount: undefined, balanceDue: 0 },
      { new: true }
    );

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      );
    }

    // Set paidAmount = totalAmount on payment
    invoice.paidAmount = invoice.totalAmount ?? 0;
    invoice.balanceDue = 0;
    await invoice.save();

    return NextResponse.json({ success: true, data: invoice }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
