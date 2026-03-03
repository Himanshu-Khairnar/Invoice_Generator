"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  XCircle,
  Building2,
  User,
  CreditCard,
  Link2,
  AlignLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Invoice = {
  _id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  status: string;
  subTotal: number;
  taxTotal: number;
  discountTotal?: number;
  totalAmount: number;
  balanceDue: number;
  products: {
    productName: string;
    quantity: number;
    productPrice: number;
    taxSlab: number;
    discount?: number;
    lineTotal: number;
  }[];
  userDetailId: { name: string; email: string; phoneNumber: string; city: string };
  clientDetailId: { name: string; email: string; phoneNumber: string; city: string };
  bankDetails?: {
    _id: string;
    type: string;
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    ifscCode?: string;
    paymentLink?: string;
    paymentInstructions?: string;
  }[];
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);
}

function initials(name?: string) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function PayInvoicePage() {
  const params = useParams();
  const invoiceId = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [loadError, setLoadError] = useState(""); // fatal — shows full-page error
  const [actionError, setActionError] = useState(""); // inline — shown inside the CTA area
  // OTP flow
  const [otpStep, setOtpStep] = useState<"idle" | "sent" | "verifying">("idle");
  const [otp, setOtp] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);

  useEffect(() => {
    fetch(`/api/pay/${invoiceId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setInvoice(data.data);
          if (data.data.status === "payment done") setPaid(true);
          if (data.data.status === "cancel") setCancelled(true);
        } else {
          setLoadError(data.error ?? "Invoice not found.");
        }
      })
      .catch(() => setLoadError("Failed to load invoice."))
      .finally(() => setLoading(false));
  }, [invoiceId]);

  const handleRequestOtp = async () => {
    setSendingOtp(true);
    setActionError("");
    try {
      const res = await fetch(`/api/pay/${invoiceId}/send-otp`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setMaskedEmail(data.maskedEmail ?? "your email");
        setOtpStep("sent");
      } else {
        setActionError(data.error ?? "Failed to send OTP.");
      }
    } catch {
      setActionError("Network error. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) { setActionError("Please enter the 6-digit code."); return; }
    setPaying(true);
    setActionError("");
    try {
      const res = await fetch(`/api/pay/${invoiceId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();
      if (data.success) {
        setPaid(true);
        setInvoice((prev) => prev ? { ...prev, status: "payment done", balanceDue: 0 } : prev);
      } else {
        setActionError(data.error ?? "Failed to verify OTP.");
      }
    } catch {
      setActionError("Network error. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm">Loading invoice…</p>
        </div>
      </div>
    );
  }

  if (loadError || !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3 max-w-sm px-4">
          <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <XCircle className="h-7 w-7 text-destructive" />
          </div>
          <h2 className="text-lg font-semibold">Invoice Not Found</h2>
          <p className="text-sm text-muted-foreground">{loadError || "This invoice link is invalid or has expired."}</p>
        </div>
      </div>
    );
  }

  const business = invoice.userDetailId;
  const client = invoice.clientDetailId;

  return (
    <div className="min-h-screen bg-muted/30 py-10 px-4">
      <div className="max-w-xl mx-auto space-y-4">

        {/* Branding bar */}
        <div className="flex items-center justify-center gap-2 pb-2">
          <div className="h-7 w-7 rounded-md overflow-hidden flex items-center justify-center">
            <img src="/invoice-logo.svg" alt="BillPartner" className="h-7 w-7" />
          </div>
          <span className="text-sm font-semibold text-foreground">BillPartner</span>
        </div>

        {/* Main card */}
        <div className="border border-border rounded-xl bg-background overflow-hidden">

          {/* Status header */}
          {paid ? (
            <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">Payment Confirmed</p>
                <p className="text-xs text-emerald-600">This invoice has been marked as paid.</p>
              </div>
            </div>
          ) : cancelled ? (
            <div className="bg-red-50 border-b border-red-100 px-6 py-4 flex items-center gap-3">
              <XCircle className="h-5 w-5 text-red-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-800">Invoice Cancelled</p>
                <p className="text-xs text-red-600">This invoice has been cancelled and is no longer payable.</p>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border-b border-amber-100 px-6 py-4 flex items-center gap-3">
              <Clock className="h-5 w-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Payment Due</p>
                {invoice.dueDate && (
                  <p className="text-xs text-amber-600">
                    Due by {new Date(invoice.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Invoice meta */}
          <div className="px-6 py-5 border-b border-border">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">Invoice</p>
                <h1 className="text-2xl font-bold text-foreground">#{invoice.invoiceNumber}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(invoice.invoiceDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">Amount Due</p>
                <p className="text-2xl font-bold text-foreground">{fmt(invoice.totalAmount)}</p>
              </div>
            </div>
          </div>

          {/* From / To */}
          <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
            <div className="px-5 py-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">
                <Building2 className="h-3.5 w-3.5" /> From
              </div>
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground shrink-0">
                  {initials(business?.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-tight">{business?.name}</p>
                  <p className="text-xs text-muted-foreground">{business?.city}</p>
                </div>
              </div>
            </div>
            <div className="px-5 py-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">
                <User className="h-3.5 w-3.5" /> To
              </div>
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground shrink-0">
                  {initials(client?.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-tight">{client?.name}</p>
                  <p className="text-xs text-muted-foreground">{client?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items table */}
          <div className="border-b border-border">
            <div className="px-5 py-3 bg-muted/40 border-b border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Line Items</p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs">
                  <th className="px-5 py-2.5 text-left font-medium">Item</th>
                  <th className="px-3 py-2.5 text-center font-medium">Qty</th>
                  <th className="px-3 py-2.5 text-right font-medium">Rate</th>
                  <th className="px-5 py-2.5 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.products.map((p, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 font-medium text-foreground">{p.productName}</td>
                    <td className="px-3 py-3 text-center text-muted-foreground">{p.quantity}</td>
                    <td className="px-3 py-3 text-right text-muted-foreground">{fmt(p.productPrice)}</td>
                    <td className="px-5 py-3 text-right font-semibold text-foreground">{fmt(p.lineTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="px-5 py-4 space-y-1.5 border-b border-border bg-muted/20">
            {invoice.subTotal !== undefined && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>{fmt(invoice.subTotal)}</span>
              </div>
            )}
            {invoice.taxTotal !== undefined && invoice.taxTotal > 0 && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Tax</span>
                <span>{fmt(invoice.taxTotal)}</span>
              </div>
            )}
            {invoice.discountTotal !== undefined && invoice.discountTotal > 0 && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Discount</span>
                <span>−{fmt(invoice.discountTotal)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-foreground pt-1.5 border-t border-border">
              <span>Total</span>
              <span>{fmt(invoice.totalAmount)}</span>
            </div>
          </div>

          {/* CTA */}
          <div className="px-5 py-5">
            {paid ? (
              <div className="flex items-center justify-center gap-2 py-3 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-semibold">Payment Complete — Thank you!</span>
              </div>
            ) : cancelled ? (
              <div className="flex items-center justify-center gap-2 py-3 text-red-600">
                <XCircle className="h-5 w-5" />
                <span className="font-semibold">This invoice is no longer active.</span>
              </div>
            ) : otpStep === "idle" ? (
              <div className="space-y-3">
                {actionError && (
                  <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{actionError}</p>
                )}
                <Button
                  className="w-full h-11 text-sm font-semibold"
                  onClick={handleRequestOtp}
                  disabled={sendingOtp}
                >
                  {sendingOtp
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending code…</>
                    : "Confirm Payment Done"
                  }
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  A verification code will be sent to your email.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground text-center">
                  We sent a 6-digit code to <span className="font-medium text-foreground">{maskedEmail}</span>. Enter it below to confirm payment.
                </p>
                {actionError && (
                  <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{actionError}</p>
                )}
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-center text-2xl font-bold tracking-[0.5em] border border-border rounded-lg px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button
                  className="w-full h-11 text-sm font-semibold"
                  onClick={handleVerifyOtp}
                  disabled={paying || otp.length !== 6}
                >
                  {paying
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying…</>
                    : "Verify & Confirm Payment"
                  }
                </Button>
                <button
                  onClick={() => { setOtpStep("idle"); setOtp(""); setActionError(""); }}
                  className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Didn't get a code? Resend
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bank / Payment details */}
        {invoice.bankDetails && invoice.bankDetails.length > 0 && (
          <div className="border border-border rounded-xl bg-background overflow-hidden">
            <div className="px-5 py-3 bg-muted/40 border-b border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Payment Details</p>
            </div>
            <div className="divide-y divide-border">
              {invoice.bankDetails.map((b) => (
                <div key={b._id} className="px-5 py-4 space-y-2">
                  <div className="flex items-center gap-2">
                    {b.type === "Bank Transfer" && <CreditCard className="h-4 w-4 text-muted-foreground" />}
                    {b.type === "Payment Link" && <Link2 className="h-4 w-4 text-muted-foreground" />}
                    {b.type === "Payment Instructions" && <AlignLeft className="h-4 w-4 text-muted-foreground" />}
                    <p className="text-sm font-semibold text-foreground">{b.type}</p>
                  </div>
                  {b.type === "Bank Transfer" && (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm pl-6">
                      {b.accountName && (
                        <><span className="text-muted-foreground">Account Name</span><span className="font-medium">{b.accountName}</span></>
                      )}
                      {b.accountNumber && (
                        <><span className="text-muted-foreground">Account No.</span><span className="font-medium font-mono">{b.accountNumber}</span></>
                      )}
                      {b.bankName && (
                        <><span className="text-muted-foreground">Bank</span><span className="font-medium">{b.bankName}</span></>
                      )}
                      {b.ifscCode && (
                        <><span className="text-muted-foreground">IFSC</span><span className="font-medium font-mono">{b.ifscCode}</span></>
                      )}
                    </div>
                  )}
                  {b.type === "Payment Link" && b.paymentLink && (
                    <a
                      href={b.paymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-blue-600 hover:underline break-all pl-6"
                    >
                      {b.paymentLink}
                    </a>
                  )}
                  {b.type === "Payment Instructions" && (
                    <p className="text-sm text-muted-foreground whitespace-pre-line pl-6">{b.paymentInstructions}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground pb-4">
          Powered by BillPartner
        </p>
      </div>
    </div>
  );
}
