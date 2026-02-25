"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, Clock, FileText, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type Invoice = {
  _id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  status: string;
  totalAmount: number;
  balanceDue: number;
  products: { productName: string; quantity: number; productPrice: number; taxSlab: number; lineTotal: number }[];
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

export default function PayInvoicePage() {
  const params = useParams();
  const invoiceId = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/pay/${invoiceId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setInvoice(data.data);
          if (data.data.status === "payment done") setPaid(true);
        } else {
          setError(data.error ?? "Invoice not found.");
        }
      })
      .catch(() => setError("Failed to load invoice."))
      .finally(() => setLoading(false));
  }, [invoiceId]);

  const handlePay = async () => {
    setPaying(true);
    try {
      const res = await fetch(`/api/pay/${invoiceId}`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setPaid(true);
        setInvoice((prev) => prev ? { ...prev, status: "payment done", balanceDue: 0 } : prev);
      } else {
        setError(data.error ?? "Failed to update payment status.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-2">
          <XCircle className="h-10 w-10 text-red-500 mx-auto" />
          <p className="text-gray-700 font-medium">{error || "Invoice not found."}</p>
        </div>
      </div>
    );
  }

  const business = invoice.userDetailId;
  const client = invoice.clientDetailId;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Invoice #{invoice.invoiceNumber}</h1>
              <p className="text-sm text-gray-500">
                From <span className="font-medium">{business?.name}</span>
                {invoice.dueDate && (
                  <> · Due {new Date(invoice.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</>
                )}
              </p>
            </div>
          </div>
          {paid ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 bg-green-100 px-3 py-1.5 rounded-full">
              <CheckCircle2 className="h-4 w-4" /> Paid
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-yellow-700 bg-yellow-100 px-3 py-1.5 rounded-full">
              <Clock className="h-4 w-4" /> Payment Due
            </span>
          )}
        </div>

        {/* Items */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Items</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-3 py-3 font-medium text-center">Qty</th>
                <th className="px-3 py-3 font-medium text-right">Price</th>
                <th className="px-6 py-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.products.map((p, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="px-6 py-3 font-medium text-gray-900">{p.productName}</td>
                  <td className="px-3 py-3 text-center text-gray-600">{p.quantity}</td>
                  <td className="px-3 py-3 text-right text-gray-600">{fmt(p.productPrice)}</td>
                  <td className="px-6 py-3 text-right font-semibold text-gray-900">{fmt(p.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td colSpan={3} className="px-6 py-4 text-right font-bold text-gray-800 text-base">Amount Due</td>
                <td className="px-6 py-4 text-right font-bold text-gray-900 text-lg">{fmt(invoice.totalAmount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Bank Details */}
        {invoice.bankDetails && invoice.bankDetails.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6 space-y-3">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Payment Instructions</h2>
            {invoice.bankDetails.map((b) => (
              <div key={b._id} className="rounded-lg border bg-gray-50 p-4 text-sm space-y-1">
                <p className="font-medium text-gray-800">{b.type}</p>
                {b.type === "Bank Transfer" && (
                  <>
                    {b.accountName && <p className="text-gray-600">Account: <span className="font-medium">{b.accountName}</span></p>}
                    {b.accountNumber && <p className="text-gray-600">Number: <span className="font-medium">{b.accountNumber}</span></p>}
                    {b.bankName && <p className="text-gray-600">Bank: <span className="font-medium">{b.bankName}</span></p>}
                    {b.ifscCode && <p className="text-gray-600">IFSC: <span className="font-medium">{b.ifscCode}</span></p>}
                  </>
                )}
                {b.type === "Payment Link" && b.paymentLink && (
                  <a href={b.paymentLink} target="_blank" rel="noopener noreferrer"
                    className="text-blue-600 underline break-all">{b.paymentLink}</a>
                )}
                {b.type === "Payment Instructions" && (
                  <p className="text-gray-600 whitespace-pre-line">{b.paymentInstructions}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        {paid ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center space-y-2">
            <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto" />
            <p className="text-green-800 font-semibold text-lg">Payment Confirmed!</p>
            <p className="text-green-700 text-sm">Thank you. This invoice has been marked as paid.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Total Amount Due</span>
              <span className="text-2xl font-bold text-gray-900">{fmt(invoice.totalAmount)}</span>
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}
            <Button
              className="w-full h-12 text-base font-semibold"
              onClick={handlePay}
              disabled={paying}
            >
              {paying ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing…</>
              ) : (
                "Confirm Payment Done"
              )}
            </Button>
            <p className="text-xs text-gray-400 text-center">
              Clicking this confirms you have completed the payment to {business?.name}.
            </p>
          </div>
        )}

        <p className="text-center text-xs text-gray-400">
          Billed to {client?.name} · {client?.email}
        </p>
      </div>
    </div>
  );
}
