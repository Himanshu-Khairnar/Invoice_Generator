import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Invoice from "@/models/invoice.model";
import { generateOtp, hashOtp, otpExpiry } from "@/lib/otp";
import { transporter, buildOtpEmail } from "@/lib/mailer";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const invoice = await Invoice.findById(id)
      .populate("clientDetailId", "email name")
      .select("status payOtpExpiry clientDetailId");

    if (!invoice) {
      return NextResponse.json({ success: false, error: "Invoice not found." }, { status: 404 });
    }

    if (invoice.status === "payment done") {
      return NextResponse.json({ success: false, error: "Invoice is already paid." }, { status: 409 });
    }

    if (invoice.status === "cancel") {
      return NextResponse.json({ success: false, error: "Invoice is cancelled." }, { status: 403 });
    }

    const client = invoice.clientDetailId as any;
    if (!client?.email) {
      return NextResponse.json({ success: false, error: "Client has no email address." }, { status: 400 });
    }

    // Rate-limit: don't resend if a valid OTP already exists and was issued < 1 min ago
    if (invoice.payOtpExpiry && invoice.payOtpExpiry.getTime() - Date.now() > 9 * 60 * 1000) {
      return NextResponse.json(
        { success: false, error: "An OTP was already sent. Please wait before requesting another." },
        { status: 429 }
      );
    }

    const otp = generateOtp();
    const hashed = await hashOtp(otp);
    const expiry = otpExpiry();

    await Invoice.findByIdAndUpdate(id, {
      $set: { payOtp: hashed, payOtpExpiry: expiry },
    });

    await transporter.sendMail({
      from: `"BillPartner" <${process.env.EMAIL_FROM}>`,
      to: client.email,
      subject: "Your payment verification code",
      html: buildOtpEmail({ otp, purpose: "payment", name: client.name }),
    });

    // Mask email: show only first 2 chars + domain
    const [user, domain] = client.email.split("@");
    const maskedEmail = `${user.slice(0, 2)}***@${domain}`;

    return NextResponse.json({ success: true, maskedEmail });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
