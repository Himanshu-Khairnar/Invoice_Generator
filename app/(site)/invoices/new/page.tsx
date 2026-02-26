import { getServerItems, getServerUserDetails, getServerBankDetails, getServerUserImage } from "@/lib/server/data";
import CreateInvoiceForm from "@/components/Invoice/CreateInvoiceForm";

const Page = async () => {
  const [clients, items, userDetails, bankDetails, userImage] = await Promise.all([
    getServerUserDetails("clientDetail"),
    getServerItems(),
    getServerUserDetails("userDetail"),
    getServerBankDetails(),
    getServerUserImage(),
  ]);
  const userDetail = userDetails[0] ?? null;

  return (
    <CreateInvoiceForm
      clients={clients}
      items={items}
      userDetail={userDetail}
      bankDetails={bankDetails}
      logo={userImage?.bussinessLogo ?? null}
    />
  );
};

export default Page;
