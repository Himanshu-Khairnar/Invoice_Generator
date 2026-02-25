"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Building2, ChevronDown, ChevronUp, CreditCard, Edit3, Eye, FileText, Loader2, Plus, Trash2 } from "lucide-react";
import { createInvoice } from "@/services/invoice.service";
import { saveBusinessProfile } from "@/services/userDetail.service";
import ClientDialogBox from "@/components/Client/ClientDialogBox";


type BusinessDetail = {
  _id: string;
  name: string;
  gstin?: string;
  cin?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phoneNumber: string;
  email: string;
  website?: string;
};

type Client = {
  _id: string;
  name: string;
  gstin?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phoneNumber: string;
  email: string;
};

type CatalogItem = {
  _id: string;
  productName: string;
  productPrice: number;
  taxSlab: number;
  unit?: string;
};

type LineProduct = {
  id: string;
  itemId?: string;
  productName: string;
  productPrice: number;
  unit: string;
  quantity: number;
  taxSlab: number;
  discount: number;
};

type BankDetail = {
  _id: string;
  type: "Bank Transfer" | "Payment Link" | "Payment Instructions";
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  ifscCode?: string;
  swiftCode?: string;
  paymentLink?: string;
  paymentInstructions?: string;
};

type Props = {
  clients: Client[];
  items: CatalogItem[];
  userDetail: BusinessDetail | null;
  bankDetails: BankDetail[];
};

// ─── Constants & helpers ──────────────────────────────────────────────────────

const TAX_OPTIONS = [0, 5, 12, 18, 28] as const;

function genInvoiceNumber() {
  return `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`;
}

function emptyLine(): LineProduct {
  return {
    id: Math.random().toString(36).slice(2),
    productName: "",
    productPrice: 0,
    unit: "",
    quantity: 1,
    taxSlab: 0,
    discount: 0,
  };
}

function lineCalc(p: LineProduct) {
  const base = (p.quantity || 0) * (p.productPrice || 0);
  const discounted = Math.max(0, base - (p.discount || 0));
  const tax = discounted * ((p.taxSlab || 0) / 100);
  return { base, discounted, tax, lineTotal: discounted + tax };
}

function fmt(v: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(v);
}

function fmtDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Inline Business Profile Field ───────────────────────────────────────────

const EMPTY_BP = {
  name: "", email: "", phoneNumber: "", addressLine1: "", addressLine2: "",
  city: "", state: "", country: "India", postalCode: "", gstin: "", cin: "", website: "",
};

function BusinessProfileSection({
  detail,
  onSaved,
}: {
  detail: BusinessDetail | null;
  onSaved: (d: BusinessDetail) => void;
}) {
  const [expanded, setExpanded] = useState(!detail);
  const [form, setForm] = useState(
    detail
      ? { name: detail.name, email: detail.email, phoneNumber: detail.phoneNumber,
          addressLine1: detail.addressLine1, addressLine2: detail.addressLine2 ?? "",
          city: detail.city, state: detail.state, country: detail.country,
          postalCode: detail.postalCode, gstin: detail.gstin ?? "",
          cin: detail.cin ?? "", website: detail.website ?? "" }
      : { ...EMPTY_BP }
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveOk, setSaveOk] = useState(false);

  const set = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaveError(""); setSaveOk(false);
    const required = ["name","email","phoneNumber","addressLine1","city","state","country","postalCode"] as const;
    const miss = required.find((k) => !form[k].trim());
    if (miss) { setSaveError(`"${miss}" is required.`); return; }
    setSaving(true);
    try {
      const res = await saveBusinessProfile(form);
      if (res?.success) {
        setSaveOk(true);
        onSaved(res.data);
        setExpanded(false);
        setTimeout(() => setSaveOk(false), 3000);
      } else {
        setSaveError(res?.error ?? "Failed to save.");
      }
    } catch (e: any) {
      setSaveError(e.message ?? "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className={!detail ? "border-amber-400/50 bg-amber-50/50 dark:bg-amber-950/10" : ""}>
      <CardHeader
        className="flex flex-row items-center justify-between pb-3 cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <Building2 className={`h-4 w-4 ${detail ? "text-primary" : "text-amber-600"}`} />
          <CardTitle className="text-base">
            {detail ? "Business Profile" : "Set Up Business Profile"}
          </CardTitle>
          {!detail && (
            <span className="text-xs font-medium text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
              Required
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {saveOk && (
            <span className="text-xs text-primary font-medium">Saved ✓</span>
          )}
          {expanded
            ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
            : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </CardHeader>

      {/* Collapsed: show summary */}
      {!expanded && detail && (
        <CardContent className="grid gap-3 sm:grid-cols-2 text-sm pt-0">
          <div>
            <p className="font-semibold">{detail.name}</p>
            <p className="text-muted-foreground">
              {detail.addressLine1}{detail.addressLine2 ? `, ${detail.addressLine2}` : ""}
            </p>
            <p className="text-muted-foreground">{detail.city}, {detail.state} — {detail.postalCode}</p>
          </div>
          <div className="space-y-0.5 text-muted-foreground">
            <p>{detail.phoneNumber}</p>
            <p>{detail.email}</p>
            {detail.gstin && <p><span className="text-foreground font-medium">GSTIN:</span> {detail.gstin}</p>}
          </div>
        </CardContent>
      )}

      {/* Collapsed: no profile yet */}
      {!expanded && !detail && (
        <CardContent className="pt-0">
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Click to add your business details — required before creating an invoice.
          </p>
        </CardContent>
      )}

      {/* Expanded: inline form */}
      {expanded && (
        <CardContent className="space-y-4 pt-0">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-1.5">
              <Label>Business Name *</Label>
              <Input placeholder="Acme Pvt. Ltd." value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Email *</Label>
              <Input type="email" placeholder="billing@acme.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Phone *</Label>
              <Input placeholder="+91 98765 43210" value={form.phoneNumber} onChange={(e) => set("phoneNumber", e.target.value)} />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label>Address Line 1 *</Label>
              <Input placeholder="123, MG Road" value={form.addressLine1} onChange={(e) => set("addressLine1", e.target.value)} />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label>Address Line 2</Label>
              <Input placeholder="Suite 4B" value={form.addressLine2} onChange={(e) => set("addressLine2", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>City *</Label>
              <Input placeholder="Mumbai" value={form.city} onChange={(e) => set("city", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>State *</Label>
              <Input placeholder="Maharashtra" value={form.state} onChange={(e) => set("state", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Postal Code *</Label>
              <Input placeholder="400001" value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Country *</Label>
              <Input placeholder="India" value={form.country} onChange={(e) => set("country", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>GSTIN</Label>
              <Input placeholder="27AADCB2230M1ZX" value={form.gstin} onChange={(e) => set("gstin", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>CIN</Label>
              <Input placeholder="U72900MH2021PTC123456" value={form.cin} onChange={(e) => set("cin", e.target.value)} />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label>Website</Label>
              <Input placeholder="https://acme.com" value={form.website} onChange={(e) => set("website", e.target.value)} />
            </div>
          </div>

          {saveError && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">{saveError}</p>
          )}

          <div className="flex gap-2 justify-end pt-1">
            {detail && (
              <Button variant="ghost" size="sm" onClick={() => setExpanded(false)}>
                Cancel
              </Button>
            )}
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />Saving…</> : detail ? "Save Changes" : "Save & Continue"}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// ─── Bank Detail Section ──────────────────────────────────────────────────────

const BANK_TYPE_OPTIONS = ["Bank Transfer", "Payment Link", "Payment Instructions"] as const;
type BankType = typeof BANK_TYPE_OPTIONS[number];

const EMPTY_BANK_FORM = {
  type: "Bank Transfer" as BankType,
  accountName: "", accountNumber: "", bankName: "", ifscCode: "", swiftCode: "",
  paymentLink: "", paymentInstructions: "",
};

function bankDetailLabel(b: BankDetail) {
  if (b.type === "Bank Transfer") return `${b.bankName ?? "Bank"} — ${b.accountNumber ?? ""}`;
  if (b.type === "Payment Link") return b.paymentLink ?? "Payment Link";
  return "Payment Instructions";
}

function BankDetailSection({
  bankDetails,
  selectedId,
  onSelect,
  onCreated,
}: {
  bankDetails: BankDetail[];
  selectedId: string;
  onSelect: (id: string) => void;
  onCreated: (b: BankDetail) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [adding, setAdding] = useState(bankDetails.length === 0);
  const [form, setForm] = useState({ ...EMPTY_BANK_FORM });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const set = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaveError("");
    if (form.type === "Bank Transfer" && (!form.accountName || !form.accountNumber || !form.bankName)) {
      setSaveError("Account name, number, and bank name are required.");
      return;
    }
    if (form.type === "Payment Link" && !form.paymentLink) {
      setSaveError("Payment link is required.");
      return;
    }
    if (form.type === "Payment Instructions" && !form.paymentInstructions) {
      setSaveError("Payment instructions are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/bankdetail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        onCreated(data.data);
        onSelect(data.data._id);
        setAdding(false);
        setForm({ ...EMPTY_BANK_FORM });
      } else {
        setSaveError(data.error ?? "Failed to save.");
      }
    } catch {
      setSaveError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const selected = bankDetails.find((b) => b._id === selectedId);

  return (
    <Card>
      <CardHeader
        className="flex flex-row items-center justify-between pb-3 cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">Payment Details</CardTitle>
          {selected && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {selected.type}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </CardHeader>

      {/* Collapsed summary */}
      {!expanded && (
        <CardContent className="pt-0 text-sm text-muted-foreground">
          {selected ? bankDetailLabel(selected) : "No payment details attached (optional)"}
        </CardContent>
      )}

      {/* Expanded */}
      {expanded && (
        <CardContent className="space-y-3 pt-0">
          {bankDetails.length > 0 && (
            <div className="space-y-2">
              <label className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/40 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <input
                  type="radio"
                  name="bankDetail"
                  value=""
                  checked={selectedId === ""}
                  onChange={() => onSelect("")}
                  className="accent-primary"
                />
                <span className="text-sm text-muted-foreground">None</span>
              </label>
              {bankDetails.map((b) => (
                <label
                  key={b._id}
                  className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/40 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                >
                  <input
                    type="radio"
                    name="bankDetail"
                    value={b._id}
                    checked={selectedId === b._id}
                    onChange={() => onSelect(b._id)}
                    className="accent-primary mt-0.5"
                  />
                  <div className="text-sm">
                    <p className="font-medium">{b.type}</p>
                    {b.type === "Bank Transfer" && (
                      <p className="text-muted-foreground">
                        {b.bankName} · {b.accountNumber}
                        {b.ifscCode ? ` · IFSC: ${b.ifscCode}` : ""}
                      </p>
                    )}
                    {b.type === "Payment Link" && (
                      <p className="text-muted-foreground">{b.paymentLink}</p>
                    )}
                    {b.type === "Payment Instructions" && (
                      <p className="text-muted-foreground line-clamp-2">{b.paymentInstructions}</p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}

          {!adding ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setAdding(true)}
            >
              <Plus className="h-3.5 w-3.5" /> Add Payment Details
            </Button>
          ) : (
            <div className="rounded-lg border p-4 space-y-3 bg-muted/20">
              <div className="space-y-1.5">
                <Label>Payment Type</Label>
                <Select value={form.type} onValueChange={(v) => set("type", v as BankType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BANK_TYPE_OPTIONS.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {form.type === "Bank Transfer" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Account Name *</Label>
                    <Input placeholder="Acme Pvt. Ltd." value={form.accountName} onChange={(e) => set("accountName", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Account Number *</Label>
                    <Input placeholder="12345678901234" value={form.accountNumber} onChange={(e) => set("accountNumber", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Bank Name *</Label>
                    <Input placeholder="HDFC Bank" value={form.bankName} onChange={(e) => set("bankName", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>IFSC Code</Label>
                    <Input placeholder="HDFC0001234" value={form.ifscCode} onChange={(e) => set("ifscCode", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>SWIFT Code</Label>
                    <Input placeholder="HDFCINBB" value={form.swiftCode} onChange={(e) => set("swiftCode", e.target.value)} />
                  </div>
                </div>
              )}

              {form.type === "Payment Link" && (
                <div className="space-y-1.5">
                  <Label>Payment Link *</Label>
                  <Input placeholder="https://razorpay.com/pay/..." value={form.paymentLink} onChange={(e) => set("paymentLink", e.target.value)} />
                </div>
              )}

              {form.type === "Payment Instructions" && (
                <div className="space-y-1.5">
                  <Label>Instructions *</Label>
                  <textarea
                    className="w-full min-h-[80px] resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Please transfer to UPI ID: acme@upi..."
                    value={form.paymentInstructions}
                    onChange={(e) => set("paymentInstructions", e.target.value)}
                  />
                </div>
              )}

              {saveError && (
                <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">{saveError}</p>
              )}

              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={() => { setAdding(false); setSaveError(""); }}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={saving}>
                  {saving ? <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />Saving…</> : "Save & Select"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

// ─── Invoice Preview ──────────────────────────────────────────────────────────

interface PreviewProps {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  business: BusinessDetail | null;
  client: Client | null;
  products: LineProduct[];
  description: string;
  subTotal: number;
  discountTotal: number;
  taxTotal: number;
  totalAmount: number;
  bankDetail: BankDetail | null;
}

function InvoicePreview({
  invoiceNumber,
  invoiceDate,
  dueDate,
  business,
  client,
  products,
  description,
  subTotal,
  discountTotal,
  taxTotal,
  totalAmount,
  bankDetail,
}: PreviewProps) {
  return (
    <div className="bg-white text-gray-900 rounded-xl border shadow-md p-10 max-w-3xl mx-auto text-sm font-sans">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-gray-900">
              {business?.name ?? "Your Business"}
            </span>
          </div>
          {business ? (
            <div className="text-gray-500 text-xs space-y-0.5">
              <p>{business.addressLine1}{business.addressLine2 ? `, ${business.addressLine2}` : ""}</p>
              <p>{business.city}, {business.state} {business.postalCode}</p>
              <p>{business.country}</p>
              <p className="mt-1">{business.phoneNumber}</p>
              <p>{business.email}</p>
              {business.gstin && <p>GSTIN: {business.gstin}</p>}
            </div>
          ) : (
            <p className="text-gray-400 text-xs italic">Business profile not configured</p>
          )}
        </div>

        <div className="text-right">
          <p className="text-3xl font-bold tracking-tight text-gray-900 mb-1">INVOICE</p>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wide"># {invoiceNumber || "—"}</p>
          <div className="mt-3 space-y-1 text-xs text-gray-500">
            <div className="flex justify-end gap-4">
              <span className="text-gray-400">Issue Date</span>
              <span className="font-medium text-gray-700">{fmtDate(invoiceDate)}</span>
            </div>
            <div className="flex justify-end gap-4">
              <span className="text-gray-400">Due Date</span>
              <span className="font-medium text-gray-700">{fmtDate(dueDate)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100 mb-6" />

      {/* Bill To */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Bill To</p>
        {client ? (
          <div className="text-xs space-y-0.5">
            <p className="font-semibold text-sm text-gray-900">{client.name}</p>
            <p className="text-gray-500">{client.addressLine1}{client.addressLine2 ? `, ${client.addressLine2}` : ""}</p>
            <p className="text-gray-500">{client.city}, {client.state} {client.postalCode}</p>
            <p className="text-gray-500">{client.country}</p>
            <p className="text-gray-500 mt-1">{client.phoneNumber}</p>
            <p className="text-gray-500">{client.email}</p>
            {client.gstin && <p className="text-gray-500">GSTIN: {client.gstin}</p>}
          </div>
        ) : (
          <p className="text-gray-400 text-xs italic">No client selected</p>
        )}
      </div>

      {/* Products table */}
      <table className="w-full text-xs mb-6">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left py-2.5 px-3 font-semibold text-gray-500 uppercase tracking-wide rounded-l-md">
              Item
            </th>
            <th className="text-right py-2.5 px-3 font-semibold text-gray-500 uppercase tracking-wide">
              Qty
            </th>
            <th className="text-right py-2.5 px-3 font-semibold text-gray-500 uppercase tracking-wide">
              Rate
            </th>
            <th className="text-right py-2.5 px-3 font-semibold text-gray-500 uppercase tracking-wide">
              Tax
            </th>
            <th className="text-right py-2.5 px-3 font-semibold text-gray-500 uppercase tracking-wide">
              Disc.
            </th>
            <th className="text-right py-2.5 px-3 font-semibold text-gray-500 uppercase tracking-wide rounded-r-md">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.filter((p) => p.productName).length === 0 ? (
            <tr>
              <td colSpan={6} className="py-6 text-center text-gray-400 italic">
                No products added yet
              </td>
            </tr>
          ) : (
            products
              .filter((p) => p.productName)
              .map((p, i) => {
                const { lineTotal } = lineCalc(p);
                return (
                  <tr key={p.id} className={i % 2 === 0 ? "" : "bg-gray-50/50"}>
                    <td className="py-2.5 px-3 text-gray-900 font-medium">
                      {p.productName}
                      {p.unit && <span className="text-gray-400 font-normal"> / {p.unit}</span>}
                    </td>
                    <td className="py-2.5 px-3 text-right text-gray-600">{p.quantity}</td>
                    <td className="py-2.5 px-3 text-right text-gray-600">{fmt(p.productPrice)}</td>
                    <td className="py-2.5 px-3 text-right text-gray-600">{p.taxSlab}%</td>
                    <td className="py-2.5 px-3 text-right text-gray-600">
                      {p.discount > 0 ? `−${fmt(p.discount)}` : "—"}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-gray-900">
                      {fmt(lineTotal)}
                    </td>
                  </tr>
                );
              })
          )}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-60 space-y-1.5 text-xs">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>{fmt(subTotal)}</span>
          </div>
          {discountTotal > 0 && (
            <div className="flex justify-between text-gray-500">
              <span>Discount</span>
              <span className="text-red-500">−{fmt(discountTotal)}</span>
            </div>
          )}
          {taxTotal > 0 && (
            <div className="flex justify-between text-gray-500">
              <span>Tax</span>
              <span>{fmt(taxTotal)}</span>
            </div>
          )}
          <div className="h-px bg-gray-200 my-1" />
          <div className="flex justify-between font-bold text-sm text-gray-900">
            <span>Total</span>
            <span>{fmt(totalAmount)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Balance Due</span>
            <span className="font-semibold text-gray-900">{fmt(totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {description && (
        <>
          <div className="h-px bg-gray-100 my-6" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Notes / Terms
            </p>
            <p className="text-xs text-gray-500 whitespace-pre-line">{description}</p>
          </div>
        </>
      )}

      {/* Bank / Payment Details */}
      {bankDetail && (
        <>
          <div className="h-px bg-gray-100 my-6" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Payment Details
            </p>
            <div className="text-xs text-gray-500 space-y-0.5">
              <p className="font-semibold text-gray-700">{bankDetail.type}</p>
              {bankDetail.type === "Bank Transfer" && (
                <>
                  {bankDetail.accountName && <p>Account Name: {bankDetail.accountName}</p>}
                  {bankDetail.accountNumber && <p>Account No.: {bankDetail.accountNumber}</p>}
                  {bankDetail.bankName && <p>Bank: {bankDetail.bankName}</p>}
                  {bankDetail.ifscCode && <p>IFSC: {bankDetail.ifscCode}</p>}
                  {bankDetail.swiftCode && <p>SWIFT: {bankDetail.swiftCode}</p>}
                </>
              )}
              {bankDetail.type === "Payment Link" && bankDetail.paymentLink && (
                <p>{bankDetail.paymentLink}</p>
              )}
              {bankDetail.type === "Payment Instructions" && bankDetail.paymentInstructions && (
                <p className="whitespace-pre-line">{bankDetail.paymentInstructions}</p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <div className="mt-10 pt-4 border-t border-gray-100 text-center text-gray-400 text-[11px]">
        Thank you for your business!
      </div>
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

export default function CreateInvoiceForm({ clients, items, userDetail: initialUserDetail, bankDetails: initialBankDetails }: Props) {
  const router = useRouter();

  const [userDetail, setUserDetail] = useState<BusinessDetail | null>(initialUserDetail);
  const userDetailId = userDetail?._id ?? "";

  const [clientsList, setClientsList] = useState<Client[]>(clients);

  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [invoiceNumber, setInvoiceNumber] = useState(genInvoiceNumber());
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [clientDetailId, setClientDetailId] = useState("");
  const [bankDetailsList, setBankDetailsList] = useState<BankDetail[]>(initialBankDetails);
  const [bankDetailId, setBankDetailId] = useState("");
  const [description, setDescription] = useState("");
  const [products, setProducts] = useState<LineProduct[]>([emptyLine()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedClient = clientsList.find((c) => c._id === clientDetailId) ?? null;
  const selectedBankDetail = bankDetailsList.find((b) => b._id === bankDetailId) ?? null;

  // ─── product helpers ────────────────────────────────────────────────────────
  const updateProduct = <K extends keyof LineProduct>(id: string, key: K, value: LineProduct[K]) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, [key]: value } : p)));

  const removeProduct = (id: string) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  const handleSelectCatalogItem = (rowId: string, catalogId: string) => {
    if (catalogId === "__manual") {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === rowId
            ? { ...p, itemId: undefined, productName: "", productPrice: 0, taxSlab: 0, unit: "" }
            : p
        )
      );
      return;
    }
    const found = items.find((i) => i._id === catalogId);
    if (!found) return;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === rowId
          ? {
              ...p,
              itemId: found._id,
              productName: found.productName,
              productPrice: found.productPrice,
              taxSlab: found.taxSlab,
              unit: found.unit ?? "",
            }
          : p
      )
    );
  };

  // ─── totals ────────────────────────────────────────────────────────────────
  const { subTotal, discountTotal, taxTotal, totalAmount } = useMemo(() => {
    let subTotal = 0, discountTotal = 0, taxTotal = 0;
    for (const p of products) {
      const { base, tax } = lineCalc(p);
      subTotal += base;
      discountTotal += p.discount || 0;
      taxTotal += tax;
    }
    return { subTotal, discountTotal, taxTotal, totalAmount: Math.max(0, subTotal - discountTotal + taxTotal) };
  }, [products]);

  // ─── submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (status: "draft" | "due") => {
    setError("");

    if (!userDetailId) {
      setError("Your business profile is not set up. Please complete your profile in Settings first.");
      return;
    }
    if (!clientDetailId) { setError("Please select a client."); return; }
    if (!invoiceNumber.trim()) { setError("Invoice number is required."); return; }
    if (products.length === 0) { setError("Add at least one product."); return; }

    const invalidRow = products.find((p) => !p.productName.trim() || p.quantity <= 0);
    if (invalidRow) {
      setError("Every product must have a name and a quantity greater than 0.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        userDetailId,
        clientDetailId,
        invoiceNumber: invoiceNumber.trim(),
        invoiceDate,
        dueDate,
        description,
        status,
        products: products.map(({ id, itemId, ...rest }) => ({
          ...rest,
          ...(itemId ? { itemId } : {}),
          lineTotal: lineCalc({ id, itemId, ...rest }).lineTotal,
        })),
        subTotal,
        discountTotal,
        taxTotal,
        totalAmount,
        balanceDue: totalAmount,
        ...(bankDetailId ? { bankDetails: [bankDetailId] } : {}),
      };

      const res = await createInvoice(payload);
      if (res?.success) {
        router.push(`/invoices/${res.data._id}`);
      } else {
        setError(res?.error ?? "Failed to create invoice. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const noUserDetail = !userDetailId;
  const noClients = clientsList.length === 0;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Invoice</h1>
          <p className="text-muted-foreground mt-1">Fill in the details to create a new invoice.</p>
        </div>

        {/* Edit / Preview toggle */}
        <div className="inline-flex items-center rounded-lg border bg-muted p-1 gap-1">
          <Button
            variant={tab === "edit" ? "default" : "ghost"}
            size="sm"
            className="gap-1.5 h-8"
            onClick={() => setTab("edit")}
          >
            <Edit3 className="h-3.5 w-3.5" /> Edit
          </Button>
          <Button
            variant={tab === "preview" ? "default" : "ghost"}
            size="sm"
            className="gap-1.5 h-8"
            onClick={() => setTab("preview")}
          >
            <Eye className="h-3.5 w-3.5" /> Preview
          </Button>
        </div>
      </div>

      {/* ── PREVIEW TAB ── */}
      {tab === "preview" && (
        <InvoicePreview
          invoiceNumber={invoiceNumber}
          invoiceDate={invoiceDate}
          dueDate={dueDate}
          business={userDetail}
          client={selectedClient}
          products={products}
          description={description}
          subTotal={subTotal}
          discountTotal={discountTotal}
          taxTotal={taxTotal}
          totalAmount={totalAmount}
          bankDetail={selectedBankDetail}
        />
      )}

      {/* ── EDIT TAB ── */}
      {tab === "edit" && (
        <>
          {/* Top-level warnings */}
          {noClients && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-400/40 bg-amber-50 dark:bg-amber-950/20 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                No clients found.{" "}
                <Link href="/client" className="underline font-medium">
                  Add a client
                </Link>{" "}
                first.
              </span>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            {/* ── Left 2 cols ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Business Profile */}
              <BusinessProfileSection
                detail={userDetail}
                onSaved={(d) => setUserDetail(d)}
              />

              {/* Invoice Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Invoice Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="invoiceNumber">Invoice Number</Label>
                    <Input
                      id="invoiceNumber"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      placeholder="INV-2025-0001"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="client">Bill To (Client)</Label>
                      <ClientDialogBox
                        triggerSize="sm"
                        onClientCreated={(client) => {
                          setClientsList((prev) => [...prev, client]);
                          setClientDetailId(client._id);
                        }}
                      />
                    </div>
                    <Select value={clientDetailId} onValueChange={setClientDetailId}>
                      <SelectTrigger id="client">
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientsList.length === 0 ? (
                          <SelectItem value="__none" disabled>
                            No clients available
                          </SelectItem>
                        ) : (
                          clientsList.map((c) => (
                            <SelectItem key={c._id} value={c._id}>
                              {c.name} — {c.city}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Selected client preview */}
                  {selectedClient && (
                    <div className="sm:col-span-2 rounded-lg bg-muted/50 border px-4 py-3 text-sm space-y-0.5">
                      <p className="font-semibold">{selectedClient.name}</p>
                      <p className="text-muted-foreground">
                        {selectedClient.addressLine1}
                        {selectedClient.addressLine2 ? `, ${selectedClient.addressLine2}` : ""}
                        {" — "}
                        {selectedClient.city}, {selectedClient.state}
                      </p>
                      <p className="text-muted-foreground">{selectedClient.email} · {selectedClient.phoneNumber}</p>
                      {selectedClient.gstin && (
                        <p className="text-muted-foreground">GSTIN: {selectedClient.gstin}</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="invoiceDate">Invoice Date</Label>
                    <Input
                      id="invoiceDate"
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Products */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base">Products / Services</CardTitle>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-1"
                    onClick={() => setProducts((prev) => [...prev, emptyLine()])}
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Row
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Column labels */}
                  <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-2 px-1 text-xs font-medium text-muted-foreground">
                    <span>Product</span>
                    <span>Qty</span>
                    <span>Price (₹)</span>
                    <span>Tax %</span>
                    <span>Disc. (₹)</span>
                    <span className="text-right">Amount</span>
                    <span />
                  </div>

                  {products.map((p) => {
                    const { lineTotal } = lineCalc(p);
                    return (
                      <div
                        key={p.id}
                        className="grid grid-cols-2 sm:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-2 items-start"
                      >
                        <div className="col-span-2 sm:col-span-1 space-y-1">
                          {items.length > 0 && (
                            <Select
                              value={p.itemId ?? "__manual"}
                              onValueChange={(val) => handleSelectCatalogItem(p.id, val)}
                            >
                              <SelectTrigger className="h-9 text-sm">
                                <SelectValue placeholder="Pick from catalog…" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="__manual">— Enter manually —</SelectItem>
                                {items.map((item) => (
                                  <SelectItem key={item._id} value={item._id}>
                                    {item.productName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          <Input
                            className="h-9 text-sm"
                            placeholder="Product name"
                            value={p.productName}
                            onChange={(e) => updateProduct(p.id, "productName", e.target.value)}
                          />
                        </div>

                        <Input
                          className="h-9 text-sm"
                          type="number"
                          min={1}
                          step={1}
                          value={p.quantity}
                          onChange={(e) => updateProduct(p.id, "quantity", Number(e.target.value))}
                        />
                        <Input
                          className="h-9 text-sm"
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="0.00"
                          value={p.productPrice}
                          onChange={(e) =>
                            updateProduct(p.id, "productPrice", Number(e.target.value))
                          }
                        />

                        <Select
                          value={String(p.taxSlab)}
                          onValueChange={(v) => updateProduct(p.id, "taxSlab", Number(v))}
                        >
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TAX_OPTIONS.map((t) => (
                              <SelectItem key={t} value={String(t)}>
                                {t}%
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Input
                          className="h-9 text-sm"
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="0.00"
                          value={p.discount}
                          onChange={(e) =>
                            updateProduct(p.id, "discount", Number(e.target.value))
                          }
                        />

                        <div className="h-9 flex items-center justify-end text-sm font-medium tabular-nums">
                          {fmt(lineTotal)}
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-muted-foreground hover:text-destructive"
                          disabled={products.length === 1}
                          onClick={() => removeProduct(p.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Bank / Payment Details */}
              <BankDetailSection
                bankDetails={bankDetailsList}
                selectedId={bankDetailId}
                onSelect={setBankDetailId}
                onCreated={(b) => setBankDetailsList((prev) => [...prev, b])}
              />

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Notes / Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    className="w-full min-h-[96px] resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Payment is due within 7 days. Thank you for your business."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </CardContent>
              </Card>
            </div>

            {/* ── Right col — Summary + Submit ── */}
            <div>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-base">Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium tabular-nums">{fmt(subTotal)}</span>
                  </div>
                  {discountTotal > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="font-medium tabular-nums text-destructive">
                        −{fmt(discountTotal)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium tabular-nums">{fmt(taxTotal)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg tabular-nums">{fmt(totalAmount)}</span>
                  </div>

                  {/* Status badge */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-muted-foreground">Products</span>
                    <Badge variant="secondary">{products.filter((p) => p.productName).length} item(s)</Badge>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-2 pt-1">
                    <Button
                      className="w-full"
                      disabled={submitting || noUserDetail || noClients}
                      onClick={() => handleSubmit("due")}
                    >
                      {submitting ? "Creating…" : "Create Invoice"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={submitting || noUserDetail}
                      onClick={() => handleSubmit("draft")}
                    >
                      Save as Draft
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full text-muted-foreground"
                      onClick={() => setTab("preview")}
                    >
                      <Eye className="mr-2 h-4 w-4" /> Preview Invoice
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
