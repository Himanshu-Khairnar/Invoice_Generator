"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { IInvoice } from "@/types/invoice.types";
import { Badge } from "@/components/ui/badge";

export type InvoiceSection = "new" | "unarchived" | "archived";

export default function InvoicesTable({ invoices }: { invoices: IInvoice[] }) {
  const [section, setSection] = useState<InvoiceSection>("unarchived");

  const filtered = useMemo(() => {
    if (section === "archived") {
      return invoices.filter((i: any) => i.status === "cancel");
    }
    if (section === "unarchived") {
      return invoices.filter((i: any) => i.status !== "cancel");
    }
    return [];
  }, [invoices, section]);

  return (
    <Card className="w-full border-none bg-transparent shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Invoices</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant={section === "new" ? "default" : "secondary"}
            onClick={() => setSection("new")}
          >
            New
          </Button>
          <Button
            variant={section === "unarchived" ? "default" : "secondary"}
            onClick={() => setSection("unarchived")}
          >
            Unarchived
          </Button>
          <Button
            variant={section === "archived" ? "default" : "secondary"}
            onClick={() => setSection("archived")}
          >
            Archived
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {section === "new" ? (
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Create a new invoice.</p>
            <Link href="/invoices/new">
              <Button>Create Invoice</Button>
            </Link>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[900px]">
              <TableCaption>Invoice listing</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">Invoice #</TableHead>
                  <TableHead className="text-center">Client</TableHead>
                  <TableHead className="text-center">Date</TableHead>
                  <TableHead className="text-center">Due</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground"
                    >
                      No invoices found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((inv: any) => (
                    <TableRow key={String(inv._id)}>
                      <TableCell className="font-medium">
                        {inv.invoiceNumber}
                      </TableCell>
                      <TableCell className="text-center">
                        {inv?.clientDetailId?.name ?? "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {inv.invoiceDate
                          ? new Date(inv.invoiceDate).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {inv.dueDate
                          ? new Date(inv.dueDate).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            inv.status === "cancel"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {inv.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {inv.totalAmount ?? 0}
                      </TableCell>
                      <TableCell className="text-center">
                        <Link href={`/invoices/${String(inv._id)}`}>
                          <Button size="sm" variant="ghost">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
