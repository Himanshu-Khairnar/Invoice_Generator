import ClientTable from "@/components/Shared/Table";
import DialogBox from "@/components/Item/ItemDialogBox";
import { getServerItems } from "@/lib/server/data";
import { Package, ShoppingCart, TrendingUp, Archive } from "lucide-react";

const Page = async () => {
  const itemList = await getServerItems();

  const totalItems = itemList?.length || 0;
  const activeItems = itemList?.filter((item: any) => item.status !== "archived").length || 0;
  const archivedItems = itemList?.filter((item: any) => item.status === "archived").length || 0;
  const totalRevenue =
    itemList?.reduce(
      (sum: number, item: any) =>
        sum + (item.timesInvoiced || 0) * (item.productPrice || 0),
      0,
    ) || 0;

  const stats = [
    { title: "Total Items",    value: totalItems,                             icon: Package },
    { title: "Active",         value: activeItems,                            icon: ShoppingCart },
    { title: "Revenue",        value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: TrendingUp },
    { title: "Archived",       value: archivedItems,                          icon: Archive },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Items</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your products and services for invoicing.
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
        <ClientTable Itemdata={itemList} Clientdata={[]} type="item" />
      </div>
    </div>
  );
};

export default Page;
