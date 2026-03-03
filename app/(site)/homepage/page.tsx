import { getServerInvoices, getServerItems, getServerUserDetails } from "@/lib/server/data";
import {
  FileText,
  Users,
  ArrowRight,
  PlusCircle,
  TrendingUp,
  Clock,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const statusConfig: Record<string, { label: string; className: string }> = {
  "payment done": { label: "Paid",      className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" },
  due:            { label: "Due",       className: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400" },
  cancel:         { label: "Cancelled", className: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400" },
  draft:          { label: "Draft",     className: "bg-muted text-muted-foreground" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const Page = async () => {
  const [invoices, clients, items] = await Promise.all([
    getServerInvoices(),
    getServerUserDetails("clientDetail"),
    getServerItems(),
  ]);

  const totalInvoices = invoices.length;
  const totalClients = clients.length;
  const totalRevenue = invoices
    .filter((inv: any) => inv.status === "payment done")
    .reduce((sum: number, inv: any) => sum + (inv.totalAmount || 0), 0);
  const pendingInvoices = invoices.filter(
    (inv: any) => inv.status === "due",
  ).length;

  const recentInvoices = [...invoices]
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const recentClients = [...clients]
    .sort((a: any, b: any) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
    .slice(0, 6);

  const recentItems = [...items]
    .sort((a: any, b: any) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
    .slice(0, 6);

  const stats = [
    {
      title: "Revenue Collected",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      icon: TrendingUp,
      sub: "from paid invoices",
    },
    {
      title: "Total Invoices",
      value: totalInvoices,
      icon: FileText,
      sub: `${pendingInvoices} pending`,
    },
    {
      title: "Total Clients",
      value: totalClients,
      icon: Users,
      sub: "active clients",
    },
    {
      title: "Awaiting Payment",
      value: pendingInvoices,
      icon: Clock,
      sub: "awaiting payment",
      highlight: pendingInvoices > 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Welcome back! Here&apos;s your business at a glance.
          </p>
        </div>
        <Link href="/invoices/new">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" /> New Invoice
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
            <p className={`text-2xl font-bold tracking-tight ${stat.highlight ? "text-amber-600 dark:text-amber-400" : ""}`}>
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Recent Invoices table */}
        <div className="lg:col-span-2 border rounded-lg border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <p className="font-semibold">Recent Invoices</p>
            <Link href="/invoices">
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground h-7 text-xs">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          {recentInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No invoices yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Create your first invoice to get started</p>
              <Link href="/invoices/new" className="mt-4">
                <Button size="sm" variant="outline">Create Invoice</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-2.5 text-left font-semibold w-[30%]">Invoice</th>
                    <th className="px-4 py-2.5 text-left font-semibold">Client</th>
                    <th className="px-4 py-2.5 text-right font-semibold w-[120px]">Amount</th>
                    <th className="px-5 py-2.5 text-right font-semibold w-[100px]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentInvoices.map((inv: any) => {
                    const status = statusConfig[inv.status] ?? statusConfig.draft;
                    return (
                      <tr key={inv._id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-3.5">
                          <Link href={`/invoices/${inv._id}`} className="block">
                            <p className="font-medium">
                              {inv.invoiceNumber || `INV-${inv._id?.slice(-6)}`}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {inv.createdAt ? formatDate(inv.createdAt) : "—"}
                            </p>
                          </Link>
                        </td>
                        <td className="px-4 py-3.5">
                          <Link href={`/invoices/${inv._id}`} className="block truncate max-w-[160px]">
                            {inv.clientDetailId?.name || "Unknown"}
                          </Link>
                        </td>
                        <td className="px-4 py-3.5 text-right font-semibold tabular-nums whitespace-nowrap">
                          <Link href={`/invoices/${inv._id}`} className="block">
                            ₹{(inv.totalAmount || 0).toLocaleString("en-IN")}
                          </Link>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Link href={`/invoices/${inv._id}`} className="flex justify-end">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${status.className}`}>
                              {status.label}
                            </span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">

          {/* Recent Clients */}
          <div className="border rounded-lg border-border overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <p className="font-semibold">Clients</p>
              <Link href="/client">
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground h-7 text-xs">
                  View all <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
            {recentClients.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Users className="h-8 w-8 text-muted-foreground/30 mb-2" />
                <p className="text-xs text-muted-foreground">No clients yet</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentClients.map((client: any) => (
                  <Link
                    key={client._id}
                    href="/client"
                    className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      {getInitials(client.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{client.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{client.email}</p>
                    </div>
                    {client.numberOfInvoices > 0 && (
                      <span className="text-xs text-muted-foreground shrink-0">
                        {client.numberOfInvoices} inv
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Items / Products */}
          <div className="border rounded-lg border-border overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <p className="font-semibold">Products & Services</p>
              <Link href="/items">
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground h-7 text-xs">
                  View all <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
            {recentItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Package className="h-8 w-8 text-muted-foreground/30 mb-2" />
                <p className="text-xs text-muted-foreground">No items yet</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentItems.map((item: any) => (
                  <div key={item._id} className="flex items-center gap-3 px-5 py-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Package className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">#{item.productNo}</p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums shrink-0">
                      ₹{(item.productPrice || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
