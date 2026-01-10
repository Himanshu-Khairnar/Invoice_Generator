import InvoicesTable from "@/components/Invoice/InvoicesTable";
import { getInvoices } from "@/services/invoice.service";
import { cookies } from "next/headers";

const Page = async () => {
  const cookieStore = cookies();
  const cookieHeader = (await cookieStore).toString();
  const res = await getInvoices(cookieHeader);
  const invoices = res?.data ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="ml-4 text-2xl font-bold">Invoices</h1>
      </div>
      <InvoicesTable invoices={invoices} />
    </div>
  );
};

export default Page;
