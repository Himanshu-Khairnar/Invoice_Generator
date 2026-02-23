import ClientTable from "@/components/Shared/Table";
import DialogBox from "@/components/Client/ClientDialogBox";
import { getServerUserDetails } from "@/lib/server/data";
import { Users, FileText, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Page = async () => {
  const clientList = await getServerUserDetails("clientDetail");
  const data = { data: clientList };

  // Calculate stats
  const totalClients = data.data?.length || 0;
  const totalInvoices =
    data.data?.reduce(
      (sum: number, client: any) => sum + (client.numberOfInvoices || 0),
      0,
    ) || 0;
  const totalRevenue =
    data.data?.reduce(
      (sum: number, client: any) => sum + (client.totalInvoiced || 0),
      0,
    ) || 0;
  const totalUnpaid =
    data.data?.reduce(
      (sum: number, client: any) => sum + (client.totalUnpaid || 0),
      0,
    ) || 0;

  const stats = [
    {
      title: "Total Clients",
      value: totalClients,
      icon: Users,
    },
    {
      title: "Total Invoices",
      value: totalInvoices,
      icon: FileText,
    },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
    },
    {
      title: "Unpaid Amount",
      value: `₹${totalUnpaid.toLocaleString()}`,
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Clients
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your client list and track their invoicing history.
          </p>
        </div>
        <DialogBox />
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
        <ClientTable Itemdata={[]} Clientdata={data.data} type="client" />
      </div>
    </div>
  );
};

export default Page;
