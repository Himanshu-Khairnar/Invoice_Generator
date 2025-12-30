import DialogBox from "@/components/Item/DialogBox";
import ItemsTable from "@/components/Item/ItemTable";
import { getItem } from "@/services/items.service";
import { cookies } from "next/headers";
const Page = async () => {
  const cookieStore = cookies();
  const cookieHeader = (await cookieStore).toString();
  const data = await getItem(cookieHeader);
  return (
    <div className="flex flex-col items-center justify-between">
      <div className="flex w-full items-center justify-between mb-4 ml-[20px]">
      <h1>Items</h1>

        <DialogBox />
      </div>
      <div>
        <ItemsTable data={data.data} />
      </div>
    </div>
  );
};

export default Page;
