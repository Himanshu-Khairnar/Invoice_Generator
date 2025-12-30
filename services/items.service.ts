import { ItemForm } from "@/components/Item/DialogBox";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api/";

export const createItem = async ({
  productNo,
  productName,
  productPrice,
  taxSlab,
}: ItemForm) => {
  try {
    const res = await fetch(`${baseUrl}item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ productNo, productName, productPrice, taxSlab }),
    });
    if (!res.ok) {
      throw new Error("Failed to create item");
    }
    const resjson = await res.json();
    return resjson;
  } catch (error) {
    console.error(error);
  }
};

export const getItem = async (cookieHeader?: string) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (cookieHeader) {
    headers.Cookie = cookieHeader;
  }

  const res = await fetch(`${baseUrl}item`, {
    cache: "no-store",
    headers,
    credentials: cookieHeader ? undefined : "include",
  });
  console.log(res);

  if (!res.ok) {
    throw new Error("Failed to get items");
  }

  return res.json();
};
