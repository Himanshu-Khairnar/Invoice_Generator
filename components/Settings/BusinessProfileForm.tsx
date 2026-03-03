"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  CheckCircle2,
  Edit3,
  Globe,
  ImagePlus,
  Loader2,
  Mail,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import {
  saveBusinessProfile,
  type BusinessProfileForm as BPForm,
} from "@/services/userDetail.service";

export type BusinessDetail = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  gstin?: string;
  cin?: string;
  website?: string;
};

type Props = {
  initial?: BusinessDetail | null;
  initialLogo?: string | null;
  onSaved?: (detail: BusinessDetail) => void;
};

const EMPTY: BPForm = {
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

function toForm(d?: BusinessDetail | null): BPForm {
  if (!d) return { ...EMPTY };
  return {
    name: d.name ?? "",
    email: d.email ?? "",
    phoneNumber: d.phoneNumber ?? "",
    addressLine1: d.addressLine1 ?? "",
    addressLine2: d.addressLine2 ?? "",
    city: d.city ?? "",
    state: d.state ?? "",
    country: d.country ?? "India",
    postalCode: d.postalCode ?? "",
    gstin: d.gstin ?? "",
    cin: d.cin ?? "",
    website: d.website ?? "",
  };
}

// ── Profile summary card (read-only) ─────────────────────────────────────────
function ProfileSummary({
  detail,
  logo,
  onEdit,
}: {
  detail: BusinessDetail;
  logo: string;
  onEdit: () => void;
}) {
  return (
    <div className="border rounded-lg border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-6 py-5 bg-muted/30">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border bg-background overflow-hidden shadow-sm">
            {logo ? (
              <img src={logo} alt="Company logo" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
            ) : (
              <Building2 className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="font-semibold text-lg leading-tight">{detail.name}</p>
            {detail.website && (
              <a href={detail.website} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mt-0.5">
                <Globe className="h-3 w-3" />{detail.website}
              </a>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="shrink-0" onClick={onEdit}>
          <Edit3 className="h-4 w-4" />
        </Button>
      </div>

      {/* Body */}
      <div className="grid divide-y sm:divide-y-0 sm:grid-cols-3 sm:divide-x divide-border">
        {/* Contact */}
        <div className="px-6 py-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{detail.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-3.5 w-3.5 shrink-0" />
            <span>{detail.phoneNumber}</span>
          </div>
        </div>

        {/* Address */}
        <div className="px-6 py-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Address</p>
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              {detail.addressLine1}{detail.addressLine2 ? `, ${detail.addressLine2}` : ""}<br />
              {detail.city}, {detail.state} — {detail.postalCode}<br />
              {detail.country}
            </span>
          </div>
        </div>

        {/* Tax */}
        <div className="px-6 py-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tax & Registration</p>
          {detail.gstin ? (
            <div className="text-sm">
              <span className="text-muted-foreground">GSTIN </span>
              <span className="font-medium tracking-wide">{detail.gstin}</span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground/50">No GSTIN added</p>
          )}
          {detail.cin ? (
            <div className="text-sm">
              <span className="text-muted-foreground">CIN </span>
              <span className="font-medium tracking-wide">{detail.cin}</span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground/50">No CIN added</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/";

export default function BusinessProfileForm({ initial, initialLogo, onSaved }: Props) {
  const [editing, setEditing] = useState(!initial); // open form if no profile yet
  const [savedDetail, setSavedDetail] = useState<BusinessDetail | null>(
    initial ?? null
  );
  const [form, setForm] = useState<BPForm>(toForm(initial));
  const [logo, setLogo] = useState<string>(initialLogo ?? "");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof BPForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setError("");
    setSuccess(false);

    const required: (keyof BPForm)[] = [
      "name",
      "email",
      "phoneNumber",
      "addressLine1",
      "city",
      "state",
      "country",
      "postalCode",
    ];
    const missing = required.find((k) => !form[k]?.toString().trim());
    if (missing) {
      setError(`"${missing}" is required.`);
      return;
    }

    setSaving(true);
    try {
      const [res] = await Promise.all([
        saveBusinessProfile(form),
        fetch(`${baseUrl}userimage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ bussinessLogo: logo }),
        }),
      ]);
      if (res?.success) {
        const updated: BusinessDetail = res.data;
        setSavedDetail(updated);
        setEditing(false);
        setSuccess(true);
        onSaved?.(updated);
        setTimeout(() => setSuccess(false), 4000);
      } else {
        setError(res?.error ?? "Failed to save. Please try again.");
      }
    } catch (e: any) {
      setError(e.message ?? "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setForm(toForm(savedDetail));
    setError("");
    setSuccess(false);
    setEditing(true);
  };

  const handleCancel = () => {
    setForm(toForm(savedDetail));
    setError("");
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* ── Success toast ── */}
      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Business profile saved successfully.
        </div>
      )}

      {/* ── Summary card when profile exists and not editing ── */}
      {savedDetail && !editing && (
        <ProfileSummary detail={savedDetail} logo={logo} onEdit={handleEdit} />
      )}

      {/* ── No profile banner ── */}
      {!savedDetail && !editing && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">No business profile yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add your business details to appear on invoices.
              </p>
            </div>
            <Button onClick={() => setEditing(true)}>Set Up Profile</Button>
          </CardContent>
        </Card>
      )}

      {/* ── Edit form ── */}
      {editing && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">

            {/* ── Left column: Identity + Address ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Business Identity */}
              <div className="border rounded-lg border-border">
                <div className="px-6 py-4 border-b border-border">
                  <p className="font-semibold">
                    {savedDetail ? "Edit Business Profile" : "Set Up Business Profile"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    This information appears on all invoices you generate.
                  </p>
                </div>
                <div className="px-6 py-5 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="bp-name">Business / Company Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="bp-name"
                      placeholder="Acme Pvt. Ltd."
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      className="bg-muted/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bp-email">Business Email <span className="text-destructive">*</span></Label>
                    <Input
                      id="bp-email"
                      type="email"
                      placeholder="billing@acme.com"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      className="bg-muted/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bp-phone">Phone Number <span className="text-destructive">*</span></Label>
                    <Input
                      id="bp-phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phoneNumber}
                      onChange={(e) => set("phoneNumber", e.target.value)}
                      className="bg-muted/30"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="bp-website">Website</Label>
                    <Input
                      id="bp-website"
                      placeholder="https://acme.com"
                      value={form.website}
                      onChange={(e) => set("website", e.target.value)}
                      className="bg-muted/30"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="border rounded-lg border-border">
                <div className="px-6 py-4 border-b border-border">
                  <p className="font-semibold">Address</p>
                </div>
                <div className="px-6 py-5 grid gap-4 sm:grid-cols-4">
                  <div className="sm:col-span-4 space-y-1.5">
                    <Label htmlFor="bp-addr1">Address Line 1 <span className="text-destructive">*</span></Label>
                    <Input
                      id="bp-addr1"
                      placeholder="123, MG Road"
                      value={form.addressLine1}
                      onChange={(e) => set("addressLine1", e.target.value)}
                      className="bg-muted/30"
                    />
                  </div>
                  <div className="sm:col-span-4 space-y-1.5">
                    <Label htmlFor="bp-addr2">Address Line 2</Label>
                    <Input
                      id="bp-addr2"
                      placeholder="Suite 4B, Tower 1"
                      value={form.addressLine2}
                      onChange={(e) => set("addressLine2", e.target.value)}
                      className="bg-muted/30"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="bp-city">City <span className="text-destructive">*</span></Label>
                    <Input
                      id="bp-city"
                      placeholder="Mumbai"
                      value={form.city}
                      onChange={(e) => set("city", e.target.value)}
                      className="bg-muted/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bp-state">State <span className="text-destructive">*</span></Label>
                    <Input
                      id="bp-state"
                      placeholder="Maharashtra"
                      value={form.state}
                      onChange={(e) => set("state", e.target.value)}
                      className="bg-muted/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bp-postal">Postal Code <span className="text-destructive">*</span></Label>
                    <Input
                      id="bp-postal"
                      placeholder="400001"
                      value={form.postalCode}
                      onChange={(e) => set("postalCode", e.target.value)}
                      className="bg-muted/30"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="bp-country">Country <span className="text-destructive">*</span></Label>
                    <Input
                      id="bp-country"
                      placeholder="India"
                      value={form.country}
                      onChange={(e) => set("country", e.target.value)}
                      className="bg-muted/30"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right column: Logo + Tax ── */}
            <div className="space-y-6">

              {/* Logo upload */}
              <div className="border rounded-lg border-border">
                <div className="px-6 py-4 border-b border-border">
                  <p className="font-semibold">Company Logo</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Displayed on invoices.</p>
                </div>
                <div className="px-6 py-5 space-y-4">
                  <div className="flex items-center justify-center rounded-lg border border-dashed bg-muted overflow-hidden h-32">
                    {logo ? (
                      <img
                        src={logo}
                        alt="Logo preview"
                        style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                      />
                    ) : (
                      <ImagePlus className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="bp-logo"
                      className="flex-1 text-center cursor-pointer inline-flex justify-center items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                    >
                      <ImagePlus className="h-3.5 w-3.5" />
                      {logo ? "Change" : "Upload"}
                      <input
                        id="bp-logo"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => setLogo(reader.result as string);
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                    {logo && (
                      <button
                        type="button"
                        onClick={() => setLogo("")}
                        className="inline-flex items-center gap-1 rounded-md border border-input px-3 py-1.5 text-sm text-muted-foreground hover:text-destructive hover:border-destructive/50"
                      >
                        <X className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">PNG, JPG or SVG</p>
                </div>
              </div>

              {/* Tax & Registration */}
              <div className="border rounded-lg border-border">
                <div className="px-6 py-4 border-b border-border">
                  <p className="font-semibold">Tax & Registration</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Optional — shown on invoices.</p>
                </div>
                <div className="px-6 py-5 space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="bp-gstin">GSTIN</Label>
                    <Input
                      id="bp-gstin"
                      placeholder="27AADCB2230M1ZX"
                      value={form.gstin}
                      onChange={(e) => set("gstin", e.target.value)}
                      className="bg-muted/30 uppercase"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bp-cin">CIN</Label>
                    <Input
                      id="bp-cin"
                      placeholder="U72900MH2021PTC123456"
                      value={form.cin}
                      onChange={(e) => set("cin", e.target.value)}
                      className="bg-muted/30 uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            {savedDetail && (
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                Cancel
              </Button>
            )}
            <Button onClick={handleSave} disabled={saving} className="min-w-32">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : savedDetail ? (
                "Save Changes"
              ) : (
                "Save Profile"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
