"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Edit3,
  Eye,
  FileText,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { createInvoice, updateInvoice } from "@/services/invoice.service";
import { saveBusinessProfile } from "@/services/userDetail.service";
import { createItem } from "@/services/items.service";
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
  logo?: string;
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
  logo: string | null;
  invoice?: any | null;
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
  const discountAmt = base * ((p.discount || 0) / 100);
  const discounted = Math.max(0, base - discountAmt);
  const tax = discounted * ((p.taxSlab || 0) / 100);
  return { base, discounted, discountAmt, tax, lineTotal: discounted + tax };
}

function fmt(v: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(v);
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
  name: "",
  email: "",
  phoneNumber: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "India",
  postalCode: "",
  gstin: "",
  cin: "",
  website: "",
};

function BusinessProfileSection({
  detail,
  logo,
  onSaved,
}: {
  detail: BusinessDetail | null;
  logo: string | null;
  onSaved: (d: BusinessDetail) => void;
}) {
  const [expanded, setExpanded] = useState(!detail);
  const [form, setForm] = useState(
    detail
      ? {
          name: detail.name,
          email: detail.email,
          phoneNumber: detail.phoneNumber,
          addressLine1: detail.addressLine1,
          addressLine2: detail.addressLine2 ?? "",
          city: detail.city,
          state: detail.state,
          country: detail.country,
          postalCode: detail.postalCode,
          gstin: detail.gstin ?? "",
          cin: detail.cin ?? "",
          website: detail.website ?? "",
        }
      : { ...EMPTY_BP },
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveOk, setSaveOk] = useState(false);

  const set = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaveError("");
    setSaveOk(false);
    const required = [
      "name",
      "email",
      "phoneNumber",
      "addressLine1",
      "city",
      "state",
      "country",
      "postalCode",
    ] as const;
    const miss = required.find((k) => !form[k].trim());
    if (miss) {
      setSaveError(`"${miss}" is required.`);
      return;
    }
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
    <div
      className={
        !detail
          ? "border border-amber-400/50 rounded-lg bg-amber-50/50 dark:bg-amber-950/10"
          : "border rounded-lg border-border"
      }
    >
      <div
        className="flex flex-row items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-muted/30 transition-colors rounded-t-lg"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3">
         
             
             
          <h2 className="text-base font-semibold">
            {detail ? "Business Profile" : "Set Up Business Profile"}
          </h2>
          {!detail && (
            <span className="text-xs font-semibold text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/50 px-2.5 py-1 rounded-full">
              Required
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {saveOk && (
            <span className="text-xs text-primary font-medium">Saved ✓</span>
          )}
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Collapsed: show summary */}
      {!expanded && detail && (
        <div className="px-4 pb-4 grid gap-3 sm:grid-cols-2 text-sm">
          <div className="flex items-start gap-3">
            {logo && (
              <img
                src={logo}
                alt="Business logo"
                className="h-14 w-14 object-contain rounded-md border shrink-0"
              />
            )}
            <div>
              <p className="font-semibold">{detail.name}</p>
              <p className="text-muted-foreground">
                {detail.addressLine1}
                {detail.addressLine2 ? `, ${detail.addressLine2}` : ""}
              </p>
              <p className="text-muted-foreground">
                {detail.city}, {detail.state} — {detail.postalCode}
              </p>
            </div>
          </div>
          <div className="space-y-0.5 text-muted-foreground">
            <p>{detail.phoneNumber}</p>
            <p>{detail.email}</p>
            {detail.gstin && (
              <p>
                <span className="text-foreground font-medium">GSTIN:</span>{" "}
                {detail.gstin}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Collapsed: no profile yet */}
      {!expanded && !detail && (
        <div className="px-4 pb-4">
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Click to add your business details — required before creating an
            invoice.
          </p>
        </div>
      )}

      {/* Expanded: inline form */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-1.5">
              <Label>Business Name *</Label>
              <Input
                placeholder="Acme Pvt. Ltd."
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email *</Label>
              <Input
                type="email"
                placeholder="billing@acme.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Phone *</Label>
              <Input
                placeholder="+91 98765 43210"
                value={form.phoneNumber}
                onChange={(e) => set("phoneNumber", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label>Address Line 1 *</Label>
              <Input
                placeholder="123, MG Road"
                value={form.addressLine1}
                onChange={(e) => set("addressLine1", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label>Address Line 2</Label>
              <Input
                placeholder="Suite 4B"
                value={form.addressLine2}
                onChange={(e) => set("addressLine2", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>City *</Label>
              <Input
                placeholder="Mumbai"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>State *</Label>
              <Input
                placeholder="Maharashtra"
                value={form.state}
                onChange={(e) => set("state", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Postal Code *</Label>
              <Input
                placeholder="400001"
                value={form.postalCode}
                onChange={(e) => set("postalCode", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Country *</Label>
              <Input
                placeholder="India"
                value={form.country}
                onChange={(e) => set("country", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>GSTIN</Label>
              <Input
                placeholder="27AADCB2230M1ZX"
                value={form.gstin}
                onChange={(e) => set("gstin", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>CIN</Label>
              <Input
                placeholder="U72900MH2021PTC123456"
                value={form.cin}
                onChange={(e) => set("cin", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label>Website</Label>
              <Input
                placeholder="https://acme.com"
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
              />
            </div>
          </div>

          {saveError && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
              {saveError}
            </p>
          )}

          <div className="flex gap-2 justify-end pt-1">
            {detail && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(false)}
              >
                Cancel
              </Button>
            )}
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Saving…
                </>
              ) : detail ? (
                "Save Changes"
              ) : (
                "Save & Continue"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Bank Detail Section ──────────────────────────────────────────────────────

const BANK_TYPE_OPTIONS = [
  "Bank Transfer",
  "Payment Link",
  "Payment Instructions",
] as const;
type BankType = (typeof BANK_TYPE_OPTIONS)[number];

const EMPTY_BANK_FORM = {
  type: "Bank Transfer" as BankType,
  accountName: "",
  accountNumber: "",
  bankName: "",
  ifscCode: "",
  swiftCode: "",
  paymentLink: "",
  paymentInstructions: "",
};

function bankDetailLabel(b: BankDetail) {
  if (b.type === "Bank Transfer")
    return `${b.bankName ?? "Bank"} — ${b.accountNumber ?? ""}`;
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
    if (
      form.type === "Bank Transfer" &&
      (!form.accountName || !form.accountNumber || !form.bankName)
    ) {
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
      let payload: Record<string, string> = { type: form.type };
      if (form.type === "Bank Transfer") {
        payload = {
          ...payload,
          accountName: form.accountName,
          accountNumber: form.accountNumber,
          bankName: form.bankName,
          ...(form.ifscCode ? { ifscCode: form.ifscCode } : {}),
          ...(form.swiftCode ? { swiftCode: form.swiftCode } : {}),
        };
      } else if (form.type === "Payment Link") {
        payload.paymentLink = form.paymentLink;
      } else {
        payload.paymentInstructions = form.paymentInstructions;
      }
      const res = await fetch("/api/bankdetail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
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
    <div className="border rounded-lg border-border">
      <div
        className="flex flex-row items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-muted/30 transition-colors rounded-t-lg"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold">Payment Details</h2>
          {selected && (
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
              {selected.type}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Collapsed summary */}
      {!expanded && (
        <div className="px-4 pb-4 text-sm text-muted-foreground">
          {selected
            ? bankDetailLabel(selected)
            : "No payment details attached (optional)"}
        </div>
      )}

      {/* Expanded */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3">
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
                      <p className="text-muted-foreground line-clamp-2">
                        {b.paymentInstructions}
                      </p>
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
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Payment Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => set("type", v as BankType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BANK_TYPE_OPTIONS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {form.type === "Bank Transfer" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Account Name *</Label>
                    <Input
                      placeholder="Acme Pvt. Ltd."
                      value={form.accountName}
                      onChange={(e) => set("accountName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Account Number *</Label>
                    <Input
                      placeholder="12345678901234"
                      value={form.accountNumber}
                      onChange={(e) => set("accountNumber", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Bank Name *</Label>
                    <Input
                      placeholder="HDFC Bank"
                      value={form.bankName}
                      onChange={(e) => set("bankName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>IFSC Code</Label>
                    <Input
                      placeholder="HDFC0001234"
                      value={form.ifscCode}
                      onChange={(e) => set("ifscCode", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>SWIFT Code</Label>
                    <Input
                      placeholder="HDFCINBB"
                      value={form.swiftCode}
                      onChange={(e) => set("swiftCode", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {form.type === "Payment Link" && (
                <div className="space-y-1.5">
                  <Label>Payment Link *</Label>
                  <Input
                    placeholder="https://razorpay.com/pay/..."
                    value={form.paymentLink}
                    onChange={(e) => set("paymentLink", e.target.value)}
                  />
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
                <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                  {saveError}
                </p>
              )}

              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAdding(false);
                    setSaveError("");
                  }}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    "Save & Select"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Invoice Preview ─────────────────────────────────────────────────────────

interface PreviewProps {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  business: BusinessDetail | null;
  logo: string | null;
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
  logo,
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
          {logo ? (
            <img
              src={logo}
              alt="Company logo"
              style={{
                maxHeight: "56px",
                maxWidth: "160px",
                objectFit: "contain",
                display: "block",
                marginBottom: "8px",
              }}
            />
          ) : (
            <div className="flex items-center gap-2 mb-2">
              <img src="/invoice-logo.svg" alt="BillPartner" style={{ height: "36px", width: "36px", objectFit: "contain" }} />
            </div>
          )}
          <div className="mb-3">
            <span className="font-bold text-xl text-gray-900">
              {business?.name ?? "Your Business"}
            </span>
          </div>
          {business ? (
            <div className="text-gray-500 text-xs space-y-0.5">
              <p>
                {business.addressLine1}
                {business.addressLine2 ? `, ${business.addressLine2}` : ""}
              </p>
              <p>
                {business.city}, {business.state} {business.postalCode}
              </p>
              <p>{business.country}</p>
              <p className="mt-1">{business.phoneNumber}</p>
              <p>{business.email}</p>
              {business.gstin && <p>GSTIN: {business.gstin}</p>}
            </div>
          ) : (
            <p className="text-gray-400 text-xs italic">
              Business profile not configured
            </p>
          )}
        </div>

        <div className="text-right">
          <p className="text-3xl font-bold tracking-tight text-gray-900 mb-1">
            INVOICE
          </p>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
            # {invoiceNumber || "—"}
          </p>
          <div className="mt-3 space-y-1 text-xs text-gray-500">
            <div className="flex justify-end gap-4">
              <span className="text-gray-400">Issue Date</span>
              <span className="font-medium text-gray-700">
                {fmtDate(invoiceDate)}
              </span>
            </div>
            <div className="flex justify-end gap-4">
              <span className="text-gray-400">Due Date</span>
              <span className="font-medium text-gray-700">
                {fmtDate(dueDate)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100 mb-6" />

      {/* Bill To */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
          Bill To
        </p>
        {client ? (
          <div className="text-xs space-y-0.5">
            <p className="font-semibold text-sm text-gray-900">{client.name}</p>
            <p className="text-gray-500">
              {client.addressLine1}
              {client.addressLine2 ? `, ${client.addressLine2}` : ""}
            </p>
            <p className="text-gray-500">
              {client.city}, {client.state} {client.postalCode}
            </p>
            <p className="text-gray-500">{client.country}</p>
            <p className="text-gray-500 mt-1">{client.phoneNumber}</p>
            <p className="text-gray-500">{client.email}</p>
            {client.gstin && (
              <p className="text-gray-500">GSTIN: {client.gstin}</p>
            )}
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
              Disc. %
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
                      {p.unit && (
                        <span className="text-gray-400 font-normal">
                          {" "}
                          / {p.unit}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right text-gray-600">
                      {p.quantity}
                    </td>
                    <td className="py-2.5 px-3 text-right text-gray-600">
                      {fmt(p.productPrice)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-gray-600">
                      {p.taxSlab}%
                    </td>
                    <td className="py-2.5 px-3 text-right text-gray-600">
                      {p.discount > 0 ? `${p.discount}%` : "—"}
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
            <span className="font-semibold text-gray-900">
              {fmt(totalAmount)}
            </span>
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
            <p className="text-xs text-gray-500 whitespace-pre-line">
              {description}
            </p>
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
                  {bankDetail.accountName && (
                    <p>Account Name: {bankDetail.accountName}</p>
                  )}
                  {bankDetail.accountNumber && (
                    <p>Account No.: {bankDetail.accountNumber}</p>
                  )}
                  {bankDetail.bankName && <p>Bank: {bankDetail.bankName}</p>}
                  {bankDetail.ifscCode && <p>IFSC: {bankDetail.ifscCode}</p>}
                  {bankDetail.swiftCode && <p>SWIFT: {bankDetail.swiftCode}</p>}
                </>
              )}
              {bankDetail.type === "Payment Link" && bankDetail.paymentLink && (
                <p>{bankDetail.paymentLink}</p>
              )}
              {bankDetail.type === "Payment Instructions" &&
                bankDetail.paymentInstructions && (
                  <p className="whitespace-pre-line">
                    {bankDetail.paymentInstructions}
                  </p>
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

// ─── New Item Dialog ──────────────────────────────────────────────────────────

const TAX_STRING_OPTIONS = ["0", "5", "12", "18", "28"] as const;

function NewItemDialog({
  open,
  onOpenChange,
  initialName = "",
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialName?: string;
  onCreated: (item: CatalogItem) => void;
}) {
  const [form, setForm] = useState({
    productNo: "",
    productName: initialName,
    productPrice: 0,
    taxSlab: "18",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (open) {
      setForm({ productNo: "", productName: initialName, productPrice: 0, taxSlab: "18" });
      setErr("");
    }
  }, [open, initialName]);

  const setField = (k: keyof typeof form, v: string | number) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setErr("");
    if (!form.productNo.trim()) {
      setErr("Product No is required.");
      return;
    }
    if (form.productName.trim().length < 3) {
      setErr("Name must be at least 3 characters.");
      return;
    }
    setSaving(true);
    try {
      const res = await createItem({
        productNo: form.productNo.trim(),
        productName: form.productName.trim(),
        productPrice: form.productPrice,
        taxSlab: form.taxSlab as any,
      });
      if (res?.success) {
        onCreated(res.data);
        onOpenChange(false);
      } else {
        setErr(res?.error ?? "Failed to save item.");
      }
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Create New Item</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label>Product Name *</Label>
            <Input
              placeholder="Web Development Service"
              value={form.productName}
              onChange={(e) => setField("productName", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Product No / SKU *</Label>
            <Input
              placeholder="SVC-001"
              value={form.productNo}
              onChange={(e) => setField("productNo", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Price (₹) *</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                value={form.productPrice}
                onChange={(e) =>
                  setField("productPrice", Number(e.target.value))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tax Slab (%)</Label>
              <Select
                value={form.taxSlab}
                onValueChange={(v) => setField("taxSlab", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TAX_STRING_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}%
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {err && <p className="text-sm text-destructive">{err}</p>}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            type="button"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Saving…
              </>
            ) : (
              "Save Item"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Item Combobox ────────────────────────────────────────────────────────────

function ItemCombobox({
  value,
  itemId,
  items,
  onChange,
  onSelect,
  onItemCreated,
}: {
  value: string;
  itemId: string | undefined;
  items: CatalogItem[];
  onChange: (name: string) => void;
  onSelect: (item: CatalogItem) => void;
  onItemCreated: (item: CatalogItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [createOpen, setCreateOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = query.trim()
    ? items.filter((i) =>
        i.productName.toLowerCase().includes(query.toLowerCase())
      )
    : items;

  return (
    <div ref={containerRef} className="relative">
      <Input
        className="h-9 text-sm"
        placeholder="Search or type product name…"
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          const v = e.target.value;
          setQuery(v);
          onChange(v);
          setOpen(true);
        }}
      />
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-background shadow-md">
          {filtered.length > 0 && (
            <div className="max-h-44 overflow-y-auto py-1">
              {filtered.map((item) => (
                <button
                  key={item._id}
                  type="button"
                  className={`w-full text-left px-3 py-1.5 text-sm flex items-center justify-between hover:bg-muted transition-colors ${
                    item._id === itemId ? "bg-muted/60 font-medium" : ""
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSelect(item);
                    setQuery(item.productName);
                    setOpen(false);
                  }}
                >
                  <span>{item.productName}</span>
                  <span className="text-xs text-muted-foreground ml-2 shrink-0">
                    ₹{item.productPrice}
                  </span>
                </button>
              ))}
            </div>
          )}
          {filtered.length === 0 && query.trim() && (
            <p className="px-3 py-2 text-xs text-muted-foreground">
              No matching items
            </p>
          )}
          <div className="border-t border-border">
            <button
              type="button"
              className="w-full text-left px-3 py-2 text-sm text-primary hover:bg-primary/5 transition-colors flex items-center gap-1.5"
              onMouseDown={(e) => {
                e.preventDefault();
                setOpen(false);
                setCreateOpen(true);
              }}
            >
              <Plus className="h-3.5 w-3.5 shrink-0" />
              Create new item
              {query.trim() && (
                <span className="text-muted-foreground truncate">
                  &ldquo;{query}&rdquo;
                </span>
              )}
            </button>
          </div>
        </div>
      )}
      <NewItemDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        initialName={query}
        onCreated={(newItem) => {
          onItemCreated(newItem);
          setQuery(newItem.productName);
        }}
      />
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

function toDateInput(val: any): string {
  if (!val) return "";
  return new Date(val).toISOString().slice(0, 10);
}

export default function CreateInvoiceForm({
  clients,
  items,
  userDetail: initialUserDetail,
  bankDetails: initialBankDetails,
  logo,
  invoice,
}: Props) {
  const isEditMode = !!invoice;
  const router = useRouter();

  const [userDetail, setUserDetail] = useState<BusinessDetail | null>(
    initialUserDetail,
  );
  const userDetailId = userDetail?._id ?? "";

  const [clientsList, setClientsList] = useState<Client[]>(clients);
  const [itemsList, setItemsList] = useState<CatalogItem[]>(items);

  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [invoiceNumber, setInvoiceNumber] = useState(
    invoice?.invoiceNumber ?? genInvoiceNumber(),
  );
  const [invoiceDate, setInvoiceDate] = useState(
    invoice?.invoiceDate ? toDateInput(invoice.invoiceDate) : new Date().toISOString().slice(0, 10),
  );
  const [dueDate, setDueDate] = useState(
    invoice?.dueDate
      ? toDateInput(invoice.dueDate)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  );
  const [clientDetailId, setClientDetailId] = useState<string>(
    invoice?.clientDetailId?._id ?? invoice?.clientDetailId ?? "",
  );
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const [bankDetailsList, setBankDetailsList] =
    useState<BankDetail[]>(initialBankDetails);
  const [bankDetailId, setBankDetailId] = useState<string>(
    invoice?.bankDetails?.[0]?._id ?? invoice?.bankDetails?.[0] ?? "",
  );
  const [description, setDescription] = useState(invoice?.description ?? "");
  const [products, setProducts] = useState<LineProduct[]>(
    invoice?.products?.length
      ? invoice.products.map((p: any) => ({
          id: Math.random().toString(36).slice(2),
          itemId: p.itemId ?? undefined,
          productName: p.productName ?? "",
          productPrice: p.productPrice ?? 0,
          unit: p.unit ?? "",
          quantity: p.quantity ?? 1,
          taxSlab: p.taxSlab ?? 0,
          discount: p.discount ?? 0,
        }))
      : [emptyLine()],
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedClient =
    clientsList.find((c) => c._id === clientDetailId) ?? null;
  const selectedBankDetail =
    bankDetailsList.find((b) => b._id === bankDetailId) ?? null;

  // ─── product helpers ────────────────────────────────────────────────────────
  const updateProduct = <K extends keyof LineProduct>(
    id: string,
    key: K,
    value: LineProduct[K],
  ) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [key]: value } : p)),
    );

  const removeProduct = (id: string) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  const handleSelectCatalogItem = (rowId: string, catalogId: string) => {
    const found = itemsList.find((i) => i._id === catalogId);
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
          : p,
      ),
    );
  };

  // ─── totals ────────────────────────────────────────────────────────────────
  const { subTotal, discountTotal, taxTotal, totalAmount } = useMemo(() => {
    let subTotal = 0,
      discountTotal = 0,
      taxTotal = 0;
    for (const p of products) {
      const { base, discountAmt, tax } = lineCalc(p);
      subTotal += base;
      discountTotal += discountAmt;
      taxTotal += tax;
    }
    return {
      subTotal,
      discountTotal,
      taxTotal,
      totalAmount: Math.max(0, subTotal - discountTotal + taxTotal),
    };
  }, [products]);

  // ─── submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (status: "draft" | "due") => {
    setError("");

    if (!userDetailId) {
      setError(
        "Your business profile is not set up. Please complete your profile in Settings first.",
      );
      return;
    }
    if (!clientDetailId) {
      setError("Please select a client.");
      return;
    }
    if (!invoiceNumber.trim()) {
      setError("Invoice number is required.");
      return;
    }
    if (products.length === 0) {
      setError("Add at least one product.");
      return;
    }

    const invalidRow = products.find(
      (p) => !p.productName.trim() || p.quantity <= 0,
    );
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

      if (isEditMode) {
        const res = await updateInvoice(invoice._id, payload);
        if (res?.success) {
          router.push(`/invoices/${invoice._id}`);
        } else {
          setError(res?.error ?? "Failed to update invoice. Please try again.");
        }
      } else {
        const res = await createInvoice(payload);
        if (res?.success) {
          router.push(`/invoices/${res.data._id}`);
        } else {
          setError(res?.error ?? "Failed to create invoice. Please try again.");
        }
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
    <div className="space-y-6 pb-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditMode ? `Edit Invoice ${invoice.invoiceNumber}` : "Create New Invoice"}
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {isEditMode ? "Update the invoice details below." : "Fill in the details to generate a professional invoice"}
          </p>
        </div>

        {/* Edit / Preview toggle */}
        <div className="inline-flex items-center rounded-lg border border-border bg-background p-1 gap-1">
          <Button
            variant={tab === "edit" ? "default" : "ghost"}
            size="sm"
            className="gap-1.5 h-8 px-3 rounded-md transition-all"
            onClick={() => setTab("edit")}
          >
            <Edit3 className="h-4 w-4" /> Edit
          </Button>
          <Button
            variant={tab === "preview" ? "default" : "ghost"}
            size="sm"
            className="gap-1.5 h-8 px-3 rounded-md transition-all"
            onClick={() => setTab("preview")}
          >
            <Eye className="h-4 w-4" /> Preview
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
          logo={logo}
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
            <div className="flex items-start gap-3 rounded-xl border border-amber-400/40 bg-amber-50 dark:bg-amber-950/20 px-5 py-4 text-sm text-amber-700 dark:text-amber-400 shadow-sm">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <span>
                No clients found.{" "}
                <Link
                  href="/client"
                  className="underline underline-offset-4 font-semibold hover:text-amber-800 transition-colors"
                >
                  Add a client
                </Link>{" "}
                to get started.
              </span>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            {/* ── Left 2 cols ── */}
            <div className="lg:col-span-2 space-y-6">
              {/* Business Profile */}
              <BusinessProfileSection
                detail={userDetail}
                logo={logo}
                onSaved={(d) => setUserDetail(d)}
              />

              {/* Invoice Details */}
              <div className="border rounded-lg border-border">
                <div className="px-4 py-3 border-b border-border">
                  <h2 className="text-base font-semibold">Invoice Details</h2>
                </div>
                <div className="p-4 grid gap-4 sm:grid-cols-2">
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
                    <Label htmlFor="client">Bill To (Client)</Label>
                    <Select
                      value={clientDetailId}
                      onValueChange={(val) => {
                        if (val === "__add_client") {
                          setClientDialogOpen(true);
                        } else {
                          setClientDetailId(val);
                        }
                      }}
                    >
                      <SelectTrigger id="client">
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientsList.map((c) => (
                          <SelectItem key={c._id} value={c._id}>
                            {c.name} — {c.city}
                          </SelectItem>
                        ))}
                        <SelectItem value="__add_client" className="text-primary font-medium">
                          + Add new client
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <ClientDialogBox
                      open={clientDialogOpen}
                      onOpenChange={setClientDialogOpen}
                      onClientCreated={(client) => {
                        setClientsList((prev) => [...prev, client]);
                        setClientDetailId(client._id);
                        setClientDialogOpen(false);
                      }}
                    />
                  </div>

                  {/* Selected client preview */}
                  {selectedClient && (
                    <div className="sm:col-span-2 rounded-lg bg-muted/50 border px-4 py-3 text-sm space-y-0.5">
                      <p className="font-semibold">{selectedClient.name}</p>
                      <p className="text-muted-foreground">
                        {selectedClient.addressLine1}
                        {selectedClient.addressLine2
                          ? `, ${selectedClient.addressLine2}`
                          : ""}
                        {" — "}
                        {selectedClient.city}, {selectedClient.state}
                      </p>
                      <p className="text-muted-foreground">
                        {selectedClient.email} · {selectedClient.phoneNumber}
                      </p>
                      {selectedClient.gstin && (
                        <p className="text-muted-foreground">
                          GSTIN: {selectedClient.gstin}
                        </p>
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
                </div>
              </div>

              {/* Products */}
              <div className="border rounded-lg border-border">
                <div className="px-4 py-3 border-b border-border flex flex-row items-center justify-between">
                  <h2 className="text-base font-semibold">Products / Services</h2>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() =>
                      setProducts((prev) => [...prev, emptyLine()])
                    }
                  >
                    <Plus className="h-4 w-4" /> Add Row
                  </Button>
                </div>
                <div className="p-4 space-y-3">
                  {/* Column labels */}
                  <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-2 px-1 text-xs font-medium text-muted-foreground">
                    <span>Product</span>
                    <span>Qty</span>
                    <span>Price (₹)</span>
                    <span>Tax %</span>
                    <span>Disc. (%)</span>
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
                        <div className="col-span-2 sm:col-span-1">
                          <ItemCombobox
                            value={p.productName}
                            itemId={p.itemId}
                            items={itemsList}
                            onChange={(name) =>
                              updateProduct(p.id, "productName", name)
                            }
                            onSelect={(item) =>
                              handleSelectCatalogItem(p.id, item._id)
                            }
                            onItemCreated={(newItem) => {
                              setItemsList((prev) => [...prev, newItem]);
                              setProducts((prev) =>
                                prev.map((row) =>
                                  row.id === p.id
                                    ? {
                                        ...row,
                                        itemId: newItem._id,
                                        productName: newItem.productName,
                                        productPrice: newItem.productPrice,
                                        taxSlab: newItem.taxSlab,
                                        unit: newItem.unit ?? "",
                                      }
                                    : row,
                                ),
                              );
                            }}
                          />
                        </div>

                        <Input
                          className="h-9 text-sm"
                          type="number"
                          min={1}
                          step={1}
                          value={p.quantity}
                          onChange={(e) =>
                            updateProduct(
                              p.id,
                              "quantity",
                              Number(e.target.value),
                            )
                          }
                        />
                        <Input
                          className="h-9 text-sm"
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="0.00"
                          value={p.productPrice}
                          onChange={(e) =>
                            updateProduct(
                              p.id,
                              "productPrice",
                              Number(e.target.value),
                            )
                          }
                        />

                        <Select
                          value={String(p.taxSlab)}
                          onValueChange={(v) =>
                            updateProduct(p.id, "taxSlab", Number(v))
                          }
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

                        <div className="relative">
                          <Input
                            className="h-9 text-sm pr-7"
                            type="number"
                            min={0}
                            max={100}
                            step="0.1"
                            placeholder="0"
                            value={p.discount}
                            onChange={(e) =>
                              updateProduct(
                                p.id,
                                "discount",
                                Math.min(100, Number(e.target.value)),
                              )
                            }
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">%</span>
                        </div>

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
                </div>
              </div>

              {/* Bank / Payment Details */}
              <BankDetailSection
                bankDetails={bankDetailsList}
                selectedId={bankDetailId}
                onSelect={setBankDetailId}
                onCreated={(b) => setBankDetailsList((prev) => [...prev, b])}
              />

              {/* Notes */}
              <div className="border rounded-lg border-border">
                <div className="px-4 py-3 border-b border-border">
                  <h2 className="text-base font-semibold">Notes / Terms</h2>
                </div>
                <div className="p-4">
                  <textarea
                    className="w-full min-h-[96px] resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Payment is due within 7 days. Thank you for your business."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* ── Right col — Summary + Submit ── */}
            <div>
              <div className="sticky top-6 border rounded-lg border-border">
                <div className="px-4 py-3 border-b border-border">
                  <h2 className="text-base font-semibold">Invoice Summary</h2>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium tabular-nums">
                      {fmt(subTotal)}
                    </span>
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
                    <span className="font-medium tabular-nums">
                      {fmt(taxTotal)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg tabular-nums">
                      {fmt(totalAmount)}
                    </span>
                  </div>

                  {/* Status badge */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-muted-foreground">
                      Products
                    </span>
                    <Badge variant="secondary">
                      {products.filter((p) => p.productName).length} item(s)
                    </Badge>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-2.5 pt-2">
                    <Button
                      className="w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all"
                      disabled={submitting || noUserDetail || noClients}
                      onClick={() => handleSubmit("due")}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isEditMode ? "Saving..." : "Creating Invoice..."}
                        </>
                      ) : (
                        isEditMode ? "Save Changes" : "Create Invoice"
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full h-10 shadow-sm hover:shadow transition-all"
                      disabled={submitting || noUserDetail}
                      onClick={() => handleSubmit("draft")}
                    >
                      {isEditMode ? "Save as Draft" : "Save as Draft"}
                    </Button>
                   
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
