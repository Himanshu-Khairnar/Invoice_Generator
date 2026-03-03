import { notFound } from "next/navigation";
import {
  getServerInvoiceById,
  getServerItems,
  getServerUserDetails,
  getServerBankDetails,
  getServerUserImage,
} from "@/lib/server/data";
import CreateInvoiceForm from "@/components/Invoice/CreateInvoiceForm";

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [invoice, clients, items, userDetails, bankDetails, userImage] =
    await Promise.all([
      getServerInvoiceById(id),
      getServerUserDetails("clientDetail"),
      getServerItems(),
      getServerUserDetails("userDetail"),
      getServerBankDetails(),
      getServerUserImage(),
    ]);

  if (!invoice) notFound();

  const userDetail = userDetails[0] ?? null;

  return (
    <CreateInvoiceForm
      clients={clients}
      items={items}
      userDetail={userDetail}
      bankDetails={bankDetails}
      logo={userImage?.bussinessLogo ?? null}
      invoice={invoice}
    />
  );
}
