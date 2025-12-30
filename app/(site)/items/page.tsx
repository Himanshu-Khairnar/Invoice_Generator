import ClientTable from "@/components/Shared/Table";
import DialogBox from "@/components/Item/ItemDialogBox";
import ItemsTable from "@/components/Item/ItemTable";
import { getItem } from "@/services/items.service";
import { cookies } from "next/headers";
const Page = async () => {
  const cookieStore = cookies();
  const cookieHeader = (await cookieStore).toString();
  const data = await getItem(cookieHeader);
  return (
    <div className="flex flex-col items-center justify-between">
      <div className="flex w-full items-center justify-between mb-4  ">
        <h1 className="ml-4 text-2xl font-bold">Items</h1>

        <DialogBox />
      </div>
      <div>
        <ClientTable Itemdata={data.data} Clientdata={[]} type="item" />
      </div>
    </div>
  );
};

export default Page;
