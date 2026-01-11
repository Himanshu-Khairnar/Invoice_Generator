"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IInvoice } from "@/types/invoice.types";
import InvoiceDetailView from "@/components/Invoice/InvoiceDetailView";
import { getInvoiceById } from "@/services/invoice.service";
import { Skeleton } from "@/components/ui/skeleton";

export default function InvoiceDetailPage() {
  const params = useParams();
  const invoiceId = params.id as string;

  const [invoice, setInvoice] = useState<IInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getInvoiceById(invoiceId);
        setInvoice(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load invoice");
      } finally {
        setLoading(false);
      }
    };

    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 font-semibold">
          {error || "Invoice not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <InvoiceDetailView invoice={invoice} onInvoiceUpdate={setInvoice} />
    </div>
  );
}
