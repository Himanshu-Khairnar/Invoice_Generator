import ClientTable from "@/components/Shared/Table";
import DialogBox from "@/components/Item/ItemDialogBox";
import ItemsTable from "@/components/Item/ItemTable";
import { getServerItems } from "@/lib/server/data";
import { Package, ShoppingCart, TrendingUp, Archive } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Page = async () => {
  const itemList = await getServerItems();
  const data = { data: itemList };

  // Calculate stats
  const totalItems = data.data?.length || 0;
  const activeItems =
    data.data?.filter((item: any) => item.status !== "archived").length || 0;
  const archivedItems =
    data.data?.filter((item: any) => item.status === "archived").length || 0;
  const totalTimesInvoiced =
    data.data?.reduce(
      (sum: number, item: any) => sum + (item.timesInvoiced || 0),
      0,
    ) || 0;
  const totalRevenue =
    data.data?.reduce(
      (sum: number, item: any) =>
        sum + (item.timesInvoiced || 0) * (item.productPrice || 0),
      0,
    ) || 0;

  const stats = [
    {
      title: "Total Items",
      value: totalItems,
      icon: Package,
    },
    {
      title: "Active Items",
      value: activeItems,
      icon: ShoppingCart,
    },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
    },
    {
      title: "Archived Items",
      value: archivedItems,
      icon: Archive,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Items
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your products and services for invoicing.
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
        <ClientTable Itemdata={data.data} Clientdata={[]} type="item" />
      </div>
    </div>
  );
};

export default Page;
