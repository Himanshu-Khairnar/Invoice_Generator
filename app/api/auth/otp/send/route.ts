import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/user.model";
import { generateOtp, hashOtp, otpExpiry } from "@/lib/otp";
import { transporter, buildOtpEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required." }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email }).select("loginOtp loginOtpExpiry fullname email");
    if (!user) {
      // Don't reveal whether the account exists
      return NextResponse.json({ success: true });
    }

    // Rate-limit: block if OTP was sent less than 1 minute ago
    if (user.loginOtpExpiry && user.loginOtpExpiry.getTime() - Date.now() > 9 * 60 * 1000) {
      return NextResponse.json(
        { success: false, error: "An OTP was already sent. Please wait before requesting another." },
        { status: 429 }
      );
    }

    const otp = generateOtp();
    user.loginOtp = await hashOtp(otp);
    user.loginOtpExpiry = otpExpiry();
    await user.save();

    await transporter.sendMail({
      from: `"BillPartner" <${process.env.EMAIL_FROM}>`,
      to: user.email,
      subject: "Your sign-in code",
      html: buildOtpEmail({ otp, purpose: "login", name: user.fullname }),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
