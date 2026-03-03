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
    const { otp } = await request.json();

    if (!otp) {
      return NextResponse.json({ success: false, error: "OTP is required." }, { status: 400 });
    }

    const existing = await Invoice.findById(id).select("payOtp payOtpExpiry status totalAmount");

    if (!existing) {
      return NextResponse.json({ success: false, error: "Invoice not found." }, { status: 404 });
    }

    if (existing.status === "payment done") {
      return NextResponse.json({ success: false, error: "Invoice is already paid." }, { status: 409 });
    }

    if (existing.status === "cancel") {
      return NextResponse.json({ success: false, error: "This invoice has been cancelled and cannot be paid." }, { status: 403 });
    }

    if (!existing.payOtp || !existing.payOtpExpiry) {
      return NextResponse.json({ success: false, error: "No OTP found. Please request a new one." }, { status: 400 });
    }

    if (existing.payOtpExpiry < new Date()) {
      return NextResponse.json({ success: false, error: "OTP has expired. Please request a new one." }, { status: 400 });
    }

    const { verifyOtp } = await import("@/lib/otp");
    const valid = await verifyOtp(otp, existing.payOtp);
    if (!valid) {
      return NextResponse.json({ success: false, error: "Invalid OTP. Please try again." }, { status: 400 });
    }

    const invoice = await Invoice.findByIdAndUpdate(
      id,
      {
        status: "payment done",
        paidAmount: existing.totalAmount ?? 0,
        balanceDue: 0,
        $unset: { payOtp: "", payOtpExpiry: "" },
      },
      { new: true }
    );

    return NextResponse.json({ success: true, data: invoice }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
