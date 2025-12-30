import { ClientForm } from "@/components/Client/ClientDialogBox";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/";

export const getUserDetail = async (cookieHeader?: string, type?: string) => {
    
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (cookieHeader) {
    headers.Cookie = cookieHeader;
  }

  const res = await fetch(`${baseUrl}userdetail?type=${type || "clientDetail"}`, {
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

export const postUserDetail = async (data: ClientForm) => {
  const res  = await fetch(`${baseUrl}userdetail`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to post user detail");
  }
  return res.json();
}