"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import Link from "next/link";
import { IInvoice } from "@/types/invoice.types";

const statusConfig: Record<string, { label: string; className: string }> = {
  "due":          { label: "Due",       className: "bg-amber-500/10 text-amber-600 border border-amber-500/25" },
  "payment done": { label: "Paid",      className: "bg-primary/10 text-primary border border-primary/25" },
  "cancel":       { label: "Cancelled", className: "bg-destructive/10 text-destructive border border-destructive/25" },
  "draft":        { label: "Draft",     className: "bg-muted text-muted-foreground border border-border" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? { label: status, className: "bg-muted text-muted-foreground border border-border" };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

export default function InvoicesTable({ invoices }: { invoices: IInvoice[] }) {
  const [showCancelled, setShowCancelled] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = showCancelled
      ? invoices.filter((i: any) => i.status === "cancel")
      : invoices.filter((i: any) => i.status !== "cancel");

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((i: any) =>
        (i.invoiceNumber ?? "").toLowerCase().includes(q) ||
        (i.clientDetailId?.name ?? "").toLowerCase().includes(q)
      );
    }

    return list;
  }, [invoices, showCancelled, search]);

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-border">
        <p className="font-semibold text-sm shrink-0">All Invoices</p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by invoice # or client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 w-full sm:w-64 bg-background text-sm"
            />
          </div>

          {/* Show cancelled card */}
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 shrink-0">
            <Checkbox
              id="show-cancelled"
              checked={showCancelled}
              onCheckedChange={(v) => setShowCancelled(v === true)}
            />
            <label
              htmlFor="show-cancelled"
              className="text-sm text-muted-foreground cursor-pointer select-none"
            >
              Show cancelled
            </label>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-[160px] px-5 py-3">Invoice #</TableHead>
              <TableHead className="px-5 py-3">Client</TableHead>
              <TableHead className="px-5 py-3">Date</TableHead>
              <TableHead className="px-5 py-3">Due</TableHead>
              <TableHead className="px-5 py-3 text-center">Status</TableHead>
              <TableHead className="px-5 py-3 text-right">Total</TableHead>
              <TableHead className="px-5 py-3 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  {search ? `No invoices match "${search}"` : "No invoices found"}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((inv: any) => (
                <TableRow key={String(inv._id)} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="px-5 py-4 font-medium">
                    {inv.invoiceNumber}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    {inv?.clientDetailId?.name ?? "—"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-muted-foreground">
                    {inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString("en-IN") : "—"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-muted-foreground">
                    {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString("en-IN") : "—"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    <StatusBadge status={inv.status} />
                  </TableCell>
                  <TableCell className="px-5 py-4 text-right font-semibold tabular-nums">
                    ₹{(inv.totalAmount ?? 0).toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-right">
                    <Link href={`/invoices/${String(inv._id)}`}>
                      <Button size="sm" variant="ghost">View</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
