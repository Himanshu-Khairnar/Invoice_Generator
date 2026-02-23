"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  CheckCircle2,
  Edit3,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
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
  onEdit,
}: {
  detail: BusinessDetail;
  onEdit: () => void;
}) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base leading-tight">{detail.name}</CardTitle>
              <Badge variant="secondary" className="mt-1 text-xs font-normal">
                <CheckCircle2 className="mr-1 h-3 w-3 text-primary" />
                Profile active
              </Badge>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 shrink-0"
            onClick={onEdit}
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        <Separator />

        <div className="grid gap-3 sm:grid-cols-2">
          {/* Contact */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Contact
            </p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span>{detail.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span>{detail.phoneNumber}</span>
            </div>
            {detail.website && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="h-3.5 w-3.5 shrink-0" />
                <span>{detail.website}</span>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Address
            </p>
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                {detail.addressLine1}
                {detail.addressLine2 ? `, ${detail.addressLine2}` : ""}
                <br />
                {detail.city}, {detail.state} {detail.postalCode}
                <br />
                {detail.country}
              </span>
            </div>
          </div>
        </div>

        {/* Tax info */}
        {(detail.gstin || detail.cin) && (
          <>
            <Separator />
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              {detail.gstin && (
                <span>
                  <span className="font-semibold text-foreground">GSTIN</span>{" "}
                  {detail.gstin}
                </span>
              )}
              {detail.cin && (
                <span>
                  <span className="font-semibold text-foreground">CIN</span>{" "}
                  {detail.cin}
                </span>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BusinessProfileForm({ initial, onSaved }: Props) {
  const [editing, setEditing] = useState(!initial); // open form if no profile yet
  const [savedDetail, setSavedDetail] = useState<BusinessDetail | null>(
    initial ?? null
  );
  const [form, setForm] = useState<BPForm>(toForm(initial));
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
      const res = await saveBusinessProfile(form);
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
        <ProfileSummary detail={savedDetail} onEdit={handleEdit} />
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
          {/* Business Identity */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle>
                  {savedDetail ? "Edit Business Profile" : "Set Up Business Profile"}
                </CardTitle>
              </div>
              <CardDescription>
                This information appears on all invoices you generate.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="bp-name">Business / Company Name *</Label>
                  <Input
                    id="bp-name"
                    placeholder="Acme Pvt. Ltd."
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bp-email">Business Email *</Label>
                  <Input
                    id="bp-email"
                    type="email"
                    placeholder="billing@acme.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bp-phone">Phone Number *</Label>
                  <Input
                    id="bp-phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phoneNumber}
                    onChange={(e) => set("phoneNumber", e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="bp-website">Website</Label>
                  <Input
                    id="bp-website"
                    placeholder="https://acme.com"
                    value={form.website}
                    onChange={(e) => set("website", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="bp-addr1">Address Line 1 *</Label>
                  <Input
                    id="bp-addr1"
                    placeholder="123, MG Road"
                    value={form.addressLine1}
                    onChange={(e) => set("addressLine1", e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="bp-addr2">Address Line 2</Label>
                  <Input
                    id="bp-addr2"
                    placeholder="Suite 4B, Tower 1"
                    value={form.addressLine2}
                    onChange={(e) => set("addressLine2", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bp-city">City *</Label>
                  <Input
                    id="bp-city"
                    placeholder="Mumbai"
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bp-state">State *</Label>
                  <Input
                    id="bp-state"
                    placeholder="Maharashtra"
                    value={form.state}
                    onChange={(e) => set("state", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bp-postal">Postal Code *</Label>
                  <Input
                    id="bp-postal"
                    placeholder="400001"
                    value={form.postalCode}
                    onChange={(e) => set("postalCode", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bp-country">Country *</Label>
                  <Input
                    id="bp-country"
                    placeholder="India"
                    value={form.country}
                    onChange={(e) => set("country", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tax & Registration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tax & Registration</CardTitle>
              <CardDescription>
                Optional — shown on invoices where applicable.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="bp-gstin">GSTIN</Label>
                  <Input
                    id="bp-gstin"
                    placeholder="27AADCB2230M1ZX"
                    value={form.gstin}
                    onChange={(e) => set("gstin", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bp-cin">CIN</Label>
                  <Input
                    id="bp-cin"
                    placeholder="U72900MH2021PTC123456"
                    value={form.cin}
                    onChange={(e) => set("cin", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error */}
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <Separator />

          <div className="flex items-center justify-end gap-2">
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
