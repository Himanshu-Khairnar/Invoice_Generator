export function fmt(v: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(v);
}

export function fmtDate(d: any) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function generateInvoiceHTML(
  invoice: any,
  userDetail: any,
  clientDetail: any,
  businessLogo: string | null,
  /** Pass true when opening in a new tab for manual print-to-PDF */
  autoprint = false
): string {
  const bankDetails: any[] = invoice.bankDetails ?? [];

  const productsRows = (invoice.products ?? [])
    .map(
      (p: any) => `
    <tr>
      <td style="padding:8px 10px;border-bottom:1px solid #f0f0f0">${p.productName}${p.unit ? ` <span style="color:#999;font-size:11px">(${p.unit})</span>` : ""}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:right">${fmt(p.productPrice)}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:right">${p.quantity}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:right">${p.taxSlab}%</td>
      <td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:right">${p.discount ? `-${fmt(p.discount)}` : "—"}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:500">${fmt(p.lineTotal ?? 0)}</td>
    </tr>`
    )
    .join("");

  const bankSection = bankDetails.length
    ? bankDetails
        .map((b: any) => {
          if (b.type === "Bank Transfer")
            return `
      <div style="margin-top:4px">
        <p style="font-weight:600;margin:0 0 4px">${b.bankName ?? ""} — Bank Transfer</p>
        ${b.accountName ? `<p style="margin:2px 0;color:#555">Account Name: ${b.accountName}</p>` : ""}
        ${b.accountNumber ? `<p style="margin:2px 0;color:#555">Account No: ${b.accountNumber}</p>` : ""}
        ${b.ifscCode ? `<p style="margin:2px 0;color:#555">IFSC: ${b.ifscCode}</p>` : ""}
        ${b.swiftCode ? `<p style="margin:2px 0;color:#555">SWIFT: ${b.swiftCode}</p>` : ""}
      </div>`;
          if (b.type === "Payment Link")
            return `
      <div style="margin-top:4px">
        <p style="font-weight:600;margin:0 0 4px">Payment Link</p>
        <p style="margin:2px 0;color:#555">${b.paymentLink}</p>
      </div>`;
          if (b.type === "Payment Instructions")
            return `
      <div style="margin-top:4px">
        <p style="font-weight:600;margin:0 0 4px">Payment Instructions</p>
        <p style="margin:2px 0;color:#555;white-space:pre-line">${b.paymentInstructions}</p>
      </div>`;
          return "";
        })
        .join("")
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Invoice ${invoice.invoiceNumber}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#1a1a1a;background:#fff;padding:40px}
    @media print{
      body{padding:20px}
      @page{size:A4;margin:15mm}
    }
    .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px}
    .divider{height:1px;background:#e5e7eb;margin:24px 0}
    .bill-row{display:flex;gap:40px;margin-bottom:28px}
    .bill-block{flex:1}
    .label{font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#9ca3af;margin-bottom:6px}
    table{width:100%;border-collapse:collapse;margin-bottom:24px}
    thead tr{background:#f9fafb}
    th{padding:9px 10px;text-align:left;font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#6b7280}
    th:not(:first-child){text-align:right}
    .totals{margin-left:auto;width:260px}
    .totals-row{display:flex;justify-content:space-between;padding:4px 0;color:#555}
    .totals-total{display:flex;justify-content:space-between;padding:10px 0 4px;border-top:2px solid #e5e7eb;font-weight:700;font-size:15px}
    .footer{margin-top:40px;text-align:center;font-size:11px;color:#9ca3af}
  </style>
</head>
<body>
  <div class="header">
    <div>
      ${businessLogo ? `<img src="${businessLogo}" alt="Logo" style="max-height:56px;max-width:160px;object-fit:contain;display:block;margin-bottom:10px"/>` : ""}
      <p style="font-size:20px;font-weight:700;margin-bottom:6px">${userDetail?.name ?? ""}</p>
      <p style="color:#6b7280;font-size:12px">${userDetail?.addressLine1 ?? ""}${userDetail?.addressLine2 ? ", " + userDetail.addressLine2 : ""}</p>
      <p style="color:#6b7280;font-size:12px">${userDetail?.city ?? ""}, ${userDetail?.state ?? ""} ${userDetail?.postalCode ?? ""}</p>
      <p style="color:#6b7280;font-size:12px">${userDetail?.country ?? ""}</p>
      ${userDetail?.phoneNumber ? `<p style="color:#6b7280;font-size:12px;margin-top:4px">${userDetail.phoneNumber}</p>` : ""}
      ${userDetail?.email ? `<p style="color:#6b7280;font-size:12px">${userDetail.email}</p>` : ""}
      ${userDetail?.gstin ? `<p style="color:#6b7280;font-size:12px">GSTIN: ${userDetail.gstin}</p>` : ""}
    </div>
    <div style="text-align:right">
      <p style="font-size:28px;font-weight:800;letter-spacing:-.5px;margin-bottom:2px">INVOICE</p>
      <p style="color:#9ca3af;font-size:11px;font-weight:600;letter-spacing:.06em"># ${invoice.invoiceNumber}</p>
      <div style="margin-top:12px;font-size:12px;color:#6b7280">
        <div style="display:flex;justify-content:flex-end;gap:24px;margin-bottom:3px">
          <span style="color:#9ca3af">Issue Date</span><span style="font-weight:600;color:#374151">${fmtDate(invoice.invoiceDate)}</span>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:24px">
          <span style="color:#9ca3af">Due Date</span><span style="font-weight:600;color:#374151">${fmtDate(invoice.dueDate)}</span>
        </div>
      </div>
    </div>
  </div>

  <div class="divider"></div>

  <div class="bill-row">
    <div class="bill-block">
      <p class="label">Bill To</p>
      <p style="font-weight:700;font-size:14px;margin-bottom:4px">${clientDetail?.name ?? ""}</p>
      <p style="color:#6b7280;font-size:12px">${clientDetail?.addressLine1 ?? ""}${clientDetail?.addressLine2 ? ", " + clientDetail.addressLine2 : ""}</p>
      <p style="color:#6b7280;font-size:12px">${clientDetail?.city ?? ""}, ${clientDetail?.state ?? ""} ${clientDetail?.postalCode ?? ""}</p>
      <p style="color:#6b7280;font-size:12px">${clientDetail?.country ?? ""}</p>
      ${clientDetail?.phoneNumber ? `<p style="color:#6b7280;font-size:12px;margin-top:4px">${clientDetail.phoneNumber}</p>` : ""}
      ${clientDetail?.email ? `<p style="color:#6b7280;font-size:12px">${clientDetail.email}</p>` : ""}
      ${clientDetail?.gstin ? `<p style="color:#6b7280;font-size:12px">GSTIN: ${clientDetail.gstin}</p>` : ""}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="text-align:left">Item</th>
        <th>Rate</th>
        <th>Qty</th>
        <th>Tax</th>
        <th>Disc.</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>${productsRows}</tbody>
  </table>

  <div class="totals">
    <div class="totals-row"><span>Subtotal</span><span>${fmt(invoice.subTotal ?? 0)}</span></div>
    <div class="totals-row"><span>Tax</span><span>${fmt(invoice.taxTotal ?? 0)}</span></div>
    ${invoice.discountTotal ? `<div class="totals-row"><span>Discount</span><span>-${fmt(invoice.discountTotal)}</span></div>` : ""}
    <div class="totals-total"><span>Total</span><span>${fmt(invoice.totalAmount ?? 0)}</span></div>
    ${invoice.paidAmount ? `
    <div class="totals-row" style="color:#16a34a;margin-top:6px"><span>Paid</span><span>${fmt(invoice.paidAmount)}</span></div>
    <div class="totals-row" style="font-weight:700"><span>Balance Due</span><span>${fmt(invoice.balanceDue ?? 0)}</span></div>` : ""}
  </div>

  ${bankSection ? `<div class="divider"></div><div><p class="label" style="margin-bottom:8px">Payment Details</p>${bankSection}</div>` : ""}
  ${invoice.description ? `<div class="divider"></div><div><p class="label" style="margin-bottom:6px">Notes</p><p style="color:#555;font-size:12px">${invoice.description}</p></div>` : ""}

  <div class="footer">Thank you for your business!</div>
  ${autoprint ? `<script>window.onload=function(){window.print()}<\/script>` : ""}
</body>
</html>`;
}
