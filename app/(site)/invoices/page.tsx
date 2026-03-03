import InvoicesTable from "@/components/Invoice/InvoicesTable";
import { getServerInvoices } from "@/lib/server/data";
import { FileText, CheckCircle2, XCircle, TrendingUp, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = async () => {
  const invoices = await getServerInvoices();

  const totalInvoices = invoices.length || 0;
  const activeInvoices = invoices.filter((inv: any) => inv.status !== "cancel").length || 0;
  const cancelledInvoices = invoices.filter((inv: any) => inv.status === "cancel").length || 0;
  const totalAmount = invoices.reduce((sum: number, inv: any) => sum + (inv.totalAmount || 0), 0) || 0;

  const stats = [
    { title: "Total Invoices",  value: totalInvoices,                          icon: FileText },
    { title: "Active",          value: activeInvoices,                         icon: CheckCircle2 },
    { title: "Total Amount",    value: `₹${totalAmount.toLocaleString("en-IN")}`, icon: TrendingUp },
    { title: "Cancelled",       value: cancelledInvoices,                      icon: XCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track and manage your invoicing activity.
          </p>
        </div>
        <Link href="/invoices/new">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" /> Create Invoice
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="border rounded-lg border-border bg-card grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border">
        {stats.map((stat, i) => (
          <div key={i} className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {stat.title}
              </p>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="border rounded-lg border-border bg-card overflow-hidden">
        <InvoicesTable invoices={invoices} />
      </div>
    </div>
  );
};

export default Page;
