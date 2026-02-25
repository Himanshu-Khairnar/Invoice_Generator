import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Invoice from "@/models/invoice.model";
import { transporter, buildInvoiceEmail } from "@/lib/mailer";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

async function getUserId(request: NextRequest): Promise<string | null> {
  try {
    const token =
      request.headers.get("x-access-token") ||
      request.cookies.get("access_token")?.value ||
      (await cookies()).get("access_token")?.value;
    if (!token) return null;
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    return payload.userId ?? null;
  } catch {
    return null;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const invoice = await Invoice.findById(id)
      .populate("userDetailId")
      .populate("clientDetailId");

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      );
    }

    // Ensure this invoice belongs to the logged-in user
    if (invoice.userId.toString() !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const business = invoice.userDetailId as any;
    const client = invoice.clientDetailId as any;

    if (!client?.email) {
      return NextResponse.json(
        { success: false, error: "Client has no email address." },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const payUrl = `${appUrl}/pay/${id}`;

    const html = buildInvoiceEmail({
      invoiceNumber: invoice.invoiceNumber,
      businessName: business?.name ?? "Your Vendor",
      clientName: client?.name ?? "Valued Customer",
      totalAmount: invoice.totalAmount ?? 0,
      dueDate: invoice.dueDate?.toString(),
      payUrl,
      products: (invoice.products ?? []).map((p: any) => ({
        productName: p.productName,
        quantity: p.quantity,
        productPrice: p.productPrice,
        lineTotal: p.lineTotal ?? 0,
      })),
    });

    await transporter.sendMail({
      from: `"${business?.name ?? "InvoiceApp"}" <${process.env.EMAIL_FROM}>`,
      to: client.email,
      subject: `Invoice #${invoice.invoiceNumber} — ₹${(invoice.totalAmount ?? 0).toFixed(2)} due`,
      html,
    });

    return NextResponse.json({ success: true, message: "Email sent successfully." });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
