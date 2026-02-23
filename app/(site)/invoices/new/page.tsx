import { getServerItems, getServerUserDetails, getServerBankDetails } from "@/lib/server/data";
import CreateInvoiceForm from "@/components/Invoice/CreateInvoiceForm";

const Page = async () => {
  const [clients, items, userDetails, bankDetails] = await Promise.all([
    getServerUserDetails("clientDetail"),
    getServerItems(),
    getServerUserDetails("userDetail"),
    getServerBankDetails(),
  ]);
  const userDetail = userDetails[0] ?? null;

  return (
    <CreateInvoiceForm
      clients={clients}
      items={items}
      userDetail={userDetail}
      bankDetails={bankDetails}
    />
  );
};

export default Page;
