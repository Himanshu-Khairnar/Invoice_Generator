import { ItemForm } from "@/components/Item/ItemDialogBox";

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

export const getItem = async (token?: string) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["x-access-token"] = token;
  }

  const res = await fetch(`${baseUrl}item`, {
    cache: "no-store",
    headers,
    credentials: token ? undefined : "include",
  });

  if (!res.ok) {
    throw new Error("Failed to get items");
  }

  return res.json();
};
