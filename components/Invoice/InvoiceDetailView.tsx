"use client";

import React, { useMemo, useState } from "react";
import { IInvoice } from "@/types/invoice.types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { updateInvoiceStatus } from "@/services/invoice.service";
import { generateInvoiceHTML } from "@/lib/invoice-html";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  Edit,
  Loader2,
  Mail,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface InvoiceDetailViewProps {
  invoice: IInvoice;
  onInvoiceUpdate: (invoice: IInvoice) => void;
}

const statusConfig = {
  due: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Due" },
  "payment done": { color: "bg-green-100 text-green-800", icon: CheckCircle2, label: "Payment Done" },
  cancel: { color: "bg-red-100 text-red-800", icon: XCircle, label: "Cancelled" },
  draft: { color: "bg-gray-100 text-gray-800", icon: AlertCircle, label: "Draft" },
};

export default function InvoiceDetailView({
  invoice,
  onInvoiceUpdate,
}: InvoiceDetailViewProps) {
  const [status, setStatus] = useState<string>(invoice.status);
  const [updating, setUpdating] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  const userDetail = invoice.userDetailId as any;
  const clientDetail = invoice.clientDetailId as any;
  const businessLogo = (invoice.userImageId as any)?.bussinessLogo ?? null;

  const StatusIcon =
    statusConfig[status as keyof typeof statusConfig]?.icon || AlertCircle;

  // Pre-render the invoice HTML for the inline preview
  const previewHTML = useMemo(
    () => generateInvoiceHTML(invoice, userDetail, clientDetail, businessLogo, false),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [invoice._id]
  );

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return;
    setUpdating(true);
    try {
      const response = await updateInvoiceStatus(
        invoice._id as any,
        newStatus as "due" | "payment done" | "cancel" | "draft"
      );
      if (response.success) {
        setStatus(newStatus);
        onInvoiceUpdate(response.data);
        toast.success(`Status updated to "${statusConfig[newStatus as keyof typeof statusConfig]?.label ?? newStatus}"`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleSendEmail = async () => {
    setSendingEmail(true);
    try {
      const res = await fetch(`/api/invoice/${invoice._id}/send-email`, { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Email sent to client successfully");
      } else {
        toast.error(data.error || "Failed to send email");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send email");
    } finally {
      setSendingEmail(false);
    }
  };

  const handleDownload = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(
      generateInvoiceHTML(invoice, userDetail, clientDetail, businessLogo, true)
    );
    win.document.close();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Invoice {invoice.invoiceNumber}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date(invoice.invoiceDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Status badge */}
          <Badge className={statusConfig[status as keyof typeof statusConfig]?.color}>
            <StatusIcon className="w-3.5 h-3.5 mr-1" />
            {statusConfig[status as keyof typeof statusConfig]?.label ?? status}
          </Badge>

          {/* Status select */}
          <Select value={status} onValueChange={handleStatusChange} disabled={updating}>
            <SelectTrigger className="w-40 h-8 text-sm">
              {updating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <SelectValue placeholder="Change status" />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="due">Due</SelectItem>
              <SelectItem value="payment done">Payment Done</SelectItem>
              <SelectItem value="cancel">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Edit */}
          <Link href={`/invoices/${invoice._id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-3.5 w-3.5" />
              <span className="ml-1.5">Edit</span>
            </Button>
          </Link>

          {/* Actions */}
          <Button variant="outline" size="sm" onClick={handleSendEmail} disabled={sendingEmail}>
            {sendingEmail ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Mail className="h-3.5 w-3.5" />
            )}
            <span className="ml-1.5">{sendingEmail ? "Sending…" : "Send Email"}</span>
          </Button>

          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-3.5 w-3.5" />
            <span className="ml-1.5">Download PDF</span>
          </Button>
        </div>
      </div>

      {/* Inline invoice preview */}
      <div className="rounded-lg border border-border overflow-hidden shadow-sm">
        <iframe
          srcDoc={previewHTML}
          title={`Invoice ${invoice.invoiceNumber}`}
          className="w-full"
          style={{ height: "80vh", minHeight: 600 }}
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  );
}
