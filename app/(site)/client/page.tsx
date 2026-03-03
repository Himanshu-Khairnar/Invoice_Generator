import ClientTable from "@/components/Shared/Table";
import DialogBox from "@/components/Client/ClientDialogBox";
import { getServerUserDetails } from "@/lib/server/data";
import { Users, FileText, TrendingUp, DollarSign } from "lucide-react";

const Page = async () => {
  const clientList = await getServerUserDetails("clientDetail");

  const totalClients = clientList?.length || 0;
  const totalInvoices =
    clientList?.reduce((sum: number, client: any) => sum + (client.numberOfInvoices || 0), 0) || 0;
  const totalRevenue =
    clientList?.reduce((sum: number, client: any) => sum + (client.totalInvoiced || 0), 0) || 0;
  const totalUnpaid =
    clientList?.reduce((sum: number, client: any) => sum + (client.totalUnpaid || 0), 0) || 0;

  const stats = [
    { title: "Total Clients",  value: totalClients,                              icon: Users },
    { title: "Total Invoices", value: totalInvoices,                             icon: FileText },
    { title: "Revenue",        value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: TrendingUp },
    { title: "Unpaid",         value: `₹${totalUnpaid.toLocaleString("en-IN")}`,  icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your client list and track their invoicing history.
          </p>
        </div>
        <DialogBox />
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
        <ClientTable Itemdata={[]} Clientdata={clientList} type="client" />
      </div>
    </div>
  );
};

export default Page;
