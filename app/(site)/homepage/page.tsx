import { getServerInvoices, getServerUserDetails } from "@/lib/server/data";
import { FileText, Users, DollarSign, TrendingUp, ArrowRight, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const Page = async () => {
  const [invoices, clients] = await Promise.all([
    getServerInvoices(),
    getServerUserDetails("clientDetail"),
  ]);

  const totalInvoices = invoices.length;
  const totalClients = clients.length;
  const totalRevenue = invoices.reduce((sum: number, inv: any) => sum + (inv.totalAmount || 0), 0);
  const pendingInvoices = invoices.filter((inv: any) => inv.status === "pending" || inv.status === "sent").length;

  const recentInvoices = [...invoices]
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
    },
    {
      title: "Total Invoices",
      value: totalInvoices,
      icon: FileText,
    },
    {
      title: "Total Clients",
      value: totalClients,
      icon: Users,
    },
    {
      title: "Pending",
      value: pendingInvoices,
      icon: TrendingUp,
    },
  ];

  const statusColor: Record<string, string> = {
    paid: "bg-primary/10 text-primary",
    pending: "bg-muted text-muted-foreground",
    sent: "bg-secondary text-secondary-foreground",
    cancel: "bg-destructive/10 text-destructive",
    draft: "bg-muted text-muted-foreground",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here&apos;s what&apos;s happening.</p>
        </div>
        <Link href="/invoices/new">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" /> New Invoice
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="relative overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 bg-card"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                </div>
                <div className="rounded-full p-3 bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Invoices */}
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold">Recent Invoices</CardTitle>
          <Link href="/invoices">
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {recentInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground font-medium">No invoices yet</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Create your first invoice to get started</p>
              <Link href="/invoices/new" className="mt-4">
                <Button size="sm" variant="outline">Create Invoice</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {recentInvoices.map((inv: any) => (
                <Link key={inv._id} href={`/invoices/${inv._id}`} className="flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{inv.invoiceNo || `INV-${inv._id?.slice(-6)}`}</p>
                      <p className="text-xs text-muted-foreground">{inv.clientName || "Unknown client"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold">₹{(inv.totalAmount || 0).toLocaleString()}</span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColor[inv.status] || statusColor.draft}`}>
                      {inv.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/client">
          <Card className="group cursor-pointer border hover:border-primary/50 hover:shadow-md transition-all duration-200">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-primary/10 p-3">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Clients</p>
                <p className="text-xs text-muted-foreground">{totalClients} total</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/invoices">
          <Card className="group cursor-pointer border hover:border-primary/50 hover:shadow-md transition-all duration-200">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-primary/10 p-3">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Invoices</p>
                <p className="text-xs text-muted-foreground">{totalInvoices} total</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/invoices/new">
          <Card className="group cursor-pointer border hover:border-primary/50 hover:shadow-md transition-all duration-200">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-primary/10 p-3">
                <PlusCircle className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">New Invoice</p>
                <p className="text-xs text-muted-foreground">Create now</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Page;
