import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Invoice from "@/models/invoice.model";
import Item from "@/models/item.model";
import PersonalDetail from "@/models/userDetail.model";
import { transporter, buildInvoiceEmail } from "@/lib/mailer";
import { calcLineTotals, calcInvoiceTotals } from "@/lib/invoice-calc";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";


export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Use request.cookies to reliably read the token whether the call
    // comes from the browser directly or is a server-to-server fetch
    // with a forwarded Cookie header.
    const token =
      request.headers.get("x-access-token") ||
      request.cookies.get("access_token")?.value ||
      (await cookies()).get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    if (!payload.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const invoices = await Invoice.find({ userId: payload.userId })
      .populate("userImageId")
      .populate("userDetailId")
      .populate("clientDetailId")
      .populate("bankDetails")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: invoices },
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

    const token =
      request.headers.get("x-access-token") ||
      request.cookies.get("access_token")?.value ||
      (await cookies()).get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    if (!payload.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Recalculate line totals and invoice totals server-side
    const products = calcLineTotals(body.products ?? []);
    const totals = calcInvoiceTotals(products, body.paidAmount);

    const invoice = await Invoice.create({
      ...body,
      userId: payload.userId,
      products,
      ...totals,
    });

    // Update catalog items: increment timesInvoiced and sync productPrice
    const catalogProducts = products.filter((p: any) => p.itemId);
    if (catalogProducts.length) {
      await Promise.all([
        Item.updateMany(
          { _id: { $in: catalogProducts.map((p: any) => p.itemId) } },
          { $inc: { timesInvoiced: 1 } }
        ),
        ...catalogProducts.map((p: any) =>
          Item.findByIdAndUpdate(p.itemId, { productPrice: p.productPrice })
        ),
      ]);
    }

    // Increment timesInvoiced on the client used in this invoice
    if (body.clientDetailId) {
      await PersonalDetail.findByIdAndUpdate(body.clientDetailId, {
        $inc: { timesInvoiced: 1 },
      });
    }

    // Send invoice email to client automatically (non-blocking)
    if (invoice.status !== "draft") {
      try {
        const [business, client] = await Promise.all([
          PersonalDetail.findById(body.userDetailId),
          PersonalDetail.findById(body.clientDetailId),
        ]);

        if (client?.email) {
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
          const payUrl = `${appUrl}/pay/${invoice._id}`;

          const html = buildInvoiceEmail({
            invoiceNumber: invoice.invoiceNumber,
            businessName: business?.name ?? "Your Vendor",
            clientName: client.name,
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
        }
      } catch (emailErr) {
        // Email failure should not block invoice creation
        console.error("Failed to send invoice email:", emailErr);
      }
    }

    return NextResponse.json({ success: true, data: invoice }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
