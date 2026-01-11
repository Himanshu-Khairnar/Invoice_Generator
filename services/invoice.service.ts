const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api/";

export const getInvoices = async (cookieHeader?: string) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (cookieHeader) {
    // Forward cookies when rendering on the server
    // so API routes can authenticate
    headers.Cookie = cookieHeader;
  }

  const res = await fetch(`${baseUrl}invoice`, {
    cache: "no-store",
    headers,
    credentials: cookieHeader ? undefined : "include",
  });

  if (!res.ok) {
    throw new Error("Failed to get invoices");
  }

  return res.json();
};

export const getInvoiceById = async (invoiceId: string) => {
  const res = await fetch(`${baseUrl}invoice/${invoiceId}`, {
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to get invoice");
  }

  return res.json();
};

export const updateInvoiceStatus = async (
  invoiceId: string,
  status: "due" | "payment done" | "cancel" | "draft"
) => {
  const res = await fetch(`${baseUrl}invoice/${invoiceId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error("Failed to update invoice status");
  }

  return res.json();
};

export const updateInvoice = async (invoiceId: string, data: any) => {
  const res = await fetch(`${baseUrl}invoice/${invoiceId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update invoice");
  }

  return res.json();
};

export const deleteInvoice = async (invoiceId: string) => {
  const res = await fetch(`${baseUrl}invoice/${invoiceId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to delete invoice");
  }

  return res.json();
};
