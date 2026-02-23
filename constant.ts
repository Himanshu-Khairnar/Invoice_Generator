export const taxs = ["0", "5", "12", "18", "28"];
export const itemHeaders = [
  { label: "Product Name", key: "productName", className: "w-[250px]" },
  { label: "Product No", key: "productNo", className: "w-[120px] text-center" },
  { label: "Product Price", key: "productPrice", className: "w-[140px] text-center" },
  { label: "Time Invoiced", key: "timeInvoiced", className: "w-[140px] text-center" },
  { label: "Total Invoiced", key: "totalInvoiced", className: "w-[160px] text-center" },
  { label: "Actions", key: "actions", className: "w-[100px] text-right" },
];

export const clientHeaders = [
  { label: "Client Name", key: "clientName", className: "w-[250px]" },
  {
    label: "Invoices",
    key: "numberOfInvoices",
    className: "w-[120px] text-center",
  },
  { label: "Drafts", key: "numberOfDrafts", className: "w-[120px] text-center" },
  { label: "Total Invoiced", key: "totalInvoiced", className: "w-[160px] text-center" },
  { label: "Total Unpaid", key: "totalUnpaid", className: "w-[160px] text-center" },
  { label: "Actions", key: "actions", className: "w-[100px] text-right" },
];
