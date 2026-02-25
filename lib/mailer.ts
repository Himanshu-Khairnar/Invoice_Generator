import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export function buildInvoiceEmail({
  invoiceNumber,
  businessName,
  clientName,
  totalAmount,
  dueDate,
  payUrl,
  products,
}: {
  invoiceNumber: string;
  businessName: string;
  clientName: string;
  totalAmount: number;
  dueDate?: string;
  payUrl: string;
  products: { productName: string; quantity: number; productPrice: number; lineTotal: number }[];
}) {
  const rows = products
    .map(
      (p) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">${p.productName}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${p.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;">₹${p.productPrice.toFixed(2)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;">₹${p.lineTotal.toFixed(2)}</td>
      </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">

        <!-- Header -->
        <tr>
          <td style="background:#1a1a2e;padding:28px 36px;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;">Invoice from ${businessName}</h1>
            <p style="margin:6px 0 0;color:#a0aec0;font-size:14px;">Invoice #${invoiceNumber}</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 36px;">
            <p style="margin:0 0 20px;color:#4a5568;font-size:15px;">Hi <strong>${clientName}</strong>,</p>
            <p style="margin:0 0 24px;color:#4a5568;font-size:15px;">
              You have a new invoice waiting for payment.
              ${dueDate ? `Payment is due by <strong>${new Date(dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</strong>.` : ""}
            </p>

            <!-- Items Table -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:24px;">
              <thead>
                <tr style="background:#f7fafc;">
                  <th style="padding:10px 12px;text-align:left;font-size:12px;color:#718096;font-weight:600;text-transform:uppercase;">Item</th>
                  <th style="padding:10px 12px;text-align:center;font-size:12px;color:#718096;font-weight:600;text-transform:uppercase;">Qty</th>
                  <th style="padding:10px 12px;text-align:right;font-size:12px;color:#718096;font-weight:600;text-transform:uppercase;">Price</th>
                  <th style="padding:10px 12px;text-align:right;font-size:12px;color:#718096;font-weight:600;text-transform:uppercase;">Total</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
              <tfoot>
                <tr style="background:#f7fafc;">
                  <td colspan="3" style="padding:12px;text-align:right;font-weight:700;font-size:15px;color:#2d3748;">Amount Due</td>
                  <td style="padding:12px;text-align:right;font-weight:700;font-size:18px;color:#1a1a2e;">₹${totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            <!-- CTA Button -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding:8px 0 28px;">
                  <a href="${payUrl}"
                     style="display:inline-block;background:#1a1a2e;color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;padding:14px 40px;border-radius:8px;">
                    View &amp; Pay Invoice
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0;color:#a0aec0;font-size:13px;text-align:center;">
              Or copy this link: <a href="${payUrl}" style="color:#667eea;">${payUrl}</a>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f7fafc;padding:20px 36px;text-align:center;">
            <p style="margin:0;color:#a0aec0;font-size:12px;">This email was sent by ${businessName} via InvoiceApp.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return html;
}
