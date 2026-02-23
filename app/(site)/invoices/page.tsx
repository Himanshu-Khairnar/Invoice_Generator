import InvoicesTable from "@/components/Invoice/InvoicesTable";
import { getServerInvoices } from "@/lib/server/data";
import { FileText, CheckCircle2, XCircle, DollarSign, PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = async () => {
  const invoices = await getServerInvoices();

  // Calculate stats
  const totalInvoices = invoices.length || 0;
  const activeInvoices = invoices.filter((inv: any) => inv.status !== "cancel").length || 0;
  const cancelledInvoices = invoices.filter((inv: any) => inv.status === "cancel").length || 0;
  const totalAmount = invoices.reduce((sum: number, inv: any) => sum + (inv.totalAmount || 0), 0) || 0;

  const stats = [
    {
      title: "Total Invoices",
      value: totalInvoices,
      icon: FileText,
    },
    {
      title: "Active Invoices",
      value: activeInvoices,
      icon: CheckCircle2,
    },
    {
      title: "Total Amount",
      value: `₹${totalAmount.toLocaleString()}`,
      icon: DollarSign,
    },
    {
      title: "Cancelled",
      value: cancelledInvoices,
      icon: XCircle,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Invoices
          </h1>
          <p className="text-muted-foreground text-lg">
            Track and manage your invoicing activity.
          </p>
        </div>
        <Link href="/invoices/new">
          <Button className="gap-2 shadow-lg hover:shadow-xl transition-all">
            <PlusCircle className="h-4 w-4" /> Create Invoice
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="relative overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 bg-card"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold tracking-tight">
                    {stat.value}
                  </p>
                </div>
                <div className="rounded-full p-3 bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Section */}
      <div className="border rounded-xl bg-card shadow-lg overflow-hidden">
        <InvoicesTable invoices={invoices} />
      </div>
    </div>
  );
};

export default Page;
