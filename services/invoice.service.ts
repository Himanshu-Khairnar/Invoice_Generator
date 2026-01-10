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
