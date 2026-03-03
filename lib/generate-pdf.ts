import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  renderToBuffer,
} from "@react-pdf/renderer";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(v: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(v);
}

function fmtDate(d: any) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
    padding: "15mm 15mm 15mm 15mm",
    backgroundColor: "#ffffff",
  },

  // Header
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  logo: { maxHeight: 48, maxWidth: 140, objectFit: "contain", marginBottom: 6 },
  bizName: { fontSize: 14, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  bizSub: { fontSize: 9, color: "#6b7280", marginBottom: 1 },

  invoiceLabel: { fontSize: 22, fontFamily: "Helvetica-Bold", textAlign: "right", marginBottom: 2 },
  invoiceNum: { fontSize: 9, color: "#9ca3af", textAlign: "right", marginBottom: 10 },
  dateRow: { flexDirection: "row", justifyContent: "flex-end", gap: 24, marginBottom: 2 },
  dateKey: { fontSize: 9, color: "#9ca3af" },
  dateVal: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#374151" },

  // Divider
  divider: { height: 1, backgroundColor: "#e5e7eb", marginVertical: 16 },

  // Bill section
  billRow: { flexDirection: "row", gap: 32, marginBottom: 20 },
  billBlock: { flex: 1 },
  billLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: "#9ca3af",
    marginBottom: 5,
  },
  billName: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 3 },
  billSub: { fontSize: 9, color: "#6b7280", marginBottom: 1 },

  // Table
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    color: "#6b7280",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  colItem: { flex: 3 },
  colRight: { flex: 1, textAlign: "right" },
  cellText: { fontSize: 9, color: "#374151" },
  cellSub: { fontSize: 8, color: "#9ca3af" },

  // Totals
  totalsBox: { marginTop: 12, alignSelf: "flex-end", width: 220 },
  totalsRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  totalsKey: { fontSize: 9, color: "#555" },
  totalsVal: { fontSize: 9, color: "#555" },
  totalsTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    marginTop: 4,
    borderTopWidth: 2,
    borderTopColor: "#e5e7eb",
  },
  totalsTotalKey: { fontSize: 12, fontFamily: "Helvetica-Bold" },
  totalsTotalVal: { fontSize: 12, fontFamily: "Helvetica-Bold" },
  paidRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
  paidKey: { fontSize: 9, color: "#16a34a" },
  paidVal: { fontSize: 9, color: "#16a34a" },
  balKey: { fontSize: 9, fontFamily: "Helvetica-Bold" },
  balVal: { fontSize: 9, fontFamily: "Helvetica-Bold" },

  // Payment details
  sectionLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: "#9ca3af",
    marginBottom: 6,
  },
  bankName: { fontSize: 9, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  bankSub: { fontSize: 9, color: "#555", marginBottom: 1 },

  // Notes
  notesText: { fontSize: 9, color: "#555", lineHeight: 1.5 },

  // Footer
  footer: { marginTop: 32, textAlign: "center", fontSize: 9, color: "#9ca3af" },
});

// ─── Component ────────────────────────────────────────────────────────────────

function InvoicePDF({
  invoice,
  userDetail,
  clientDetail,
  businessLogo,
}: {
  invoice: any;
  userDetail: any;
  clientDetail: any;
  businessLogo: string | null;
}) {
  const bankDetails: any[] = invoice.bankDetails ?? [];

  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A4", style: s.page },

      // ── Header ──────────────────────────────────────────────────────────
      React.createElement(
        View,
        { style: s.header },
        // Left: business info
        React.createElement(
          View,
          null,
          businessLogo
            ? React.createElement(Image, { src: businessLogo, style: s.logo })
            : null,
          React.createElement(Text, { style: s.bizName }, userDetail?.name ?? ""),
          React.createElement(Text, { style: s.bizSub },
            [userDetail?.addressLine1, userDetail?.addressLine2].filter(Boolean).join(", ")
          ),
          React.createElement(Text, { style: s.bizSub },
            [userDetail?.city, userDetail?.state, userDetail?.postalCode].filter(Boolean).join(", ")
          ),
          userDetail?.country
            ? React.createElement(Text, { style: s.bizSub }, userDetail.country)
            : null,
          userDetail?.phoneNumber
            ? React.createElement(Text, { style: s.bizSub }, userDetail.phoneNumber)
            : null,
          userDetail?.email
            ? React.createElement(Text, { style: s.bizSub }, userDetail.email)
            : null,
          userDetail?.gstin
            ? React.createElement(Text, { style: s.bizSub }, `GSTIN: ${userDetail.gstin}`)
            : null,
        ),

        // Right: invoice meta
        React.createElement(
          View,
          null,
          React.createElement(Text, { style: s.invoiceLabel }, "INVOICE"),
          React.createElement(Text, { style: s.invoiceNum }, `# ${invoice.invoiceNumber}`),
          React.createElement(
            View,
            { style: s.dateRow },
            React.createElement(Text, { style: s.dateKey }, "Issue Date"),
            React.createElement(Text, { style: s.dateVal }, fmtDate(invoice.invoiceDate)),
          ),
          React.createElement(
            View,
            { style: s.dateRow },
            React.createElement(Text, { style: s.dateKey }, "Due Date"),
            React.createElement(Text, { style: s.dateVal }, fmtDate(invoice.dueDate)),
          ),
        ),
      ),

      React.createElement(View, { style: s.divider }),

      // ── Bill To ─────────────────────────────────────────────────────────
      React.createElement(
        View,
        { style: s.billRow },
        React.createElement(
          View,
          { style: s.billBlock },
          React.createElement(Text, { style: s.billLabel }, "Bill To"),
          React.createElement(Text, { style: s.billName }, clientDetail?.name ?? ""),
          React.createElement(Text, { style: s.billSub },
            [clientDetail?.addressLine1, clientDetail?.addressLine2].filter(Boolean).join(", ")
          ),
          React.createElement(Text, { style: s.billSub },
            [clientDetail?.city, clientDetail?.state, clientDetail?.postalCode].filter(Boolean).join(", ")
          ),
          clientDetail?.country
            ? React.createElement(Text, { style: s.billSub }, clientDetail.country)
            : null,
          clientDetail?.phoneNumber
            ? React.createElement(Text, { style: s.billSub }, clientDetail.phoneNumber)
            : null,
          clientDetail?.email
            ? React.createElement(Text, { style: s.billSub }, clientDetail.email)
            : null,
          clientDetail?.gstin
            ? React.createElement(Text, { style: s.billSub }, `GSTIN: ${clientDetail.gstin}`)
            : null,
        ),
      ),

      // ── Items table ─────────────────────────────────────────────────────
      React.createElement(
        View,
        { style: s.tableHeader },
        React.createElement(Text, { style: [s.tableHeaderText, s.colItem] }, "Item"),
        React.createElement(Text, { style: [s.tableHeaderText, s.colRight] }, "Rate"),
        React.createElement(Text, { style: [s.tableHeaderText, s.colRight] }, "Qty"),
        React.createElement(Text, { style: [s.tableHeaderText, s.colRight] }, "Tax"),
        React.createElement(Text, { style: [s.tableHeaderText, s.colRight] }, "Disc."),
        React.createElement(Text, { style: [s.tableHeaderText, s.colRight] }, "Amount"),
      ),
      ...(invoice.products ?? []).map((p: any, i: number) =>
        React.createElement(
          View,
          { key: i, style: s.tableRow },
          React.createElement(
            View,
            { style: s.colItem },
            React.createElement(Text, { style: s.cellText }, p.productName),
            p.unit ? React.createElement(Text, { style: s.cellSub }, p.unit) : null,
          ),
          React.createElement(Text, { style: [s.cellText, s.colRight] }, fmt(p.productPrice)),
          React.createElement(Text, { style: [s.cellText, s.colRight] }, String(p.quantity)),
          React.createElement(Text, { style: [s.cellText, s.colRight] }, `${p.taxSlab}%`),
          React.createElement(Text, { style: [s.cellText, s.colRight] },
            p.discount ? `-${fmt(p.discount)}` : "—"
          ),
          React.createElement(Text, { style: [s.cellText, s.colRight] }, fmt(p.lineTotal ?? 0)),
        )
      ),

      // ── Totals ──────────────────────────────────────────────────────────
      React.createElement(
        View,
        { style: s.totalsBox },
        React.createElement(
          View,
          { style: s.totalsRow },
          React.createElement(Text, { style: s.totalsKey }, "Subtotal"),
          React.createElement(Text, { style: s.totalsVal }, fmt(invoice.subTotal ?? 0)),
        ),
        React.createElement(
          View,
          { style: s.totalsRow },
          React.createElement(Text, { style: s.totalsKey }, "Tax"),
          React.createElement(Text, { style: s.totalsVal }, fmt(invoice.taxTotal ?? 0)),
        ),
        invoice.discountTotal
          ? React.createElement(
              View,
              { style: s.totalsRow },
              React.createElement(Text, { style: s.totalsKey }, "Discount"),
              React.createElement(Text, { style: s.totalsVal }, `-${fmt(invoice.discountTotal)}`),
            )
          : null,
        React.createElement(
          View,
          { style: s.totalsTotal },
          React.createElement(Text, { style: s.totalsTotalKey }, "Total"),
          React.createElement(Text, { style: s.totalsTotalVal }, fmt(invoice.totalAmount ?? 0)),
        ),
        invoice.paidAmount
          ? React.createElement(
              View,
              null,
              React.createElement(
                View,
                { style: s.paidRow },
                React.createElement(Text, { style: s.paidKey }, "Paid"),
                React.createElement(Text, { style: s.paidVal }, fmt(invoice.paidAmount)),
              ),
              React.createElement(
                View,
                { style: s.paidRow },
                React.createElement(Text, { style: s.balKey }, "Balance Due"),
                React.createElement(Text, { style: s.balVal }, fmt(invoice.balanceDue ?? 0)),
              ),
            )
          : null,
      ),

      // ── Bank / Payment details ───────────────────────────────────────────
      bankDetails.length > 0
        ? React.createElement(
            View,
            null,
            React.createElement(View, { style: s.divider }),
            React.createElement(Text, { style: s.sectionLabel }, "Payment Details"),
            ...bankDetails.map((b: any, i: number) => {
              if (b.type === "Bank Transfer")
                return React.createElement(
                  View,
                  { key: i, style: { marginBottom: 6 } },
                  React.createElement(Text, { style: s.bankName }, `${b.bankName ?? ""} — Bank Transfer`),
                  b.accountName ? React.createElement(Text, { style: s.bankSub }, `Account Name: ${b.accountName}`) : null,
                  b.accountNumber ? React.createElement(Text, { style: s.bankSub }, `Account No: ${b.accountNumber}`) : null,
                  b.ifscCode ? React.createElement(Text, { style: s.bankSub }, `IFSC: ${b.ifscCode}`) : null,
                  b.swiftCode ? React.createElement(Text, { style: s.bankSub }, `SWIFT: ${b.swiftCode}`) : null,
                );
              if (b.type === "Payment Link")
                return React.createElement(
                  View,
                  { key: i, style: { marginBottom: 6 } },
                  React.createElement(Text, { style: s.bankName }, "Payment Link"),
                  React.createElement(Text, { style: s.bankSub }, b.paymentLink),
                );
              if (b.type === "Payment Instructions")
                return React.createElement(
                  View,
                  { key: i, style: { marginBottom: 6 } },
                  React.createElement(Text, { style: s.bankName }, "Payment Instructions"),
                  React.createElement(Text, { style: s.bankSub }, b.paymentInstructions),
                );
              return null;
            }),
          )
        : null,

      // ── Notes ────────────────────────────────────────────────────────────
      invoice.description
        ? React.createElement(
            View,
            null,
            React.createElement(View, { style: s.divider }),
            React.createElement(Text, { style: s.sectionLabel }, "Notes"),
            React.createElement(Text, { style: s.notesText }, invoice.description),
          )
        : null,

      // ── Footer ───────────────────────────────────────────────────────────
      React.createElement(Text, { style: s.footer }, "Thank you for your business!"),
    )
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function generatePDFFromHTML(
  _html: string,
  invoice?: any,
  userDetail?: any,
  clientDetail?: any,
  businessLogo?: string | null
): Promise<Buffer> {
  const element = React.createElement(InvoicePDF, {
    invoice,
    userDetail,
    clientDetail,
    businessLogo: businessLogo ?? null,
  });
  return await renderToBuffer(element as any);
}
