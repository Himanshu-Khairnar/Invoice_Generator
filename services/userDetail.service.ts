import { ClientForm } from "@/components/Client/ClientDialogBox";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/";

export type BusinessProfileForm = {
  name: string;
  email: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  gstin?: string;
  cin?: string;
  website?: string;
};

export const saveBusinessProfile = async (data: BusinessProfileForm) => {
  const res = await fetch(`${baseUrl}userdetail`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ ...data, type: "userDetail" }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to save business profile");
  }
  return res.json();
};

export const getUserDetail = async (token?: string, type?: string) => {

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["x-access-token"] = token;
  }

  const res = await fetch(`${baseUrl}userdetail?type=${type || "clientDetail"}`, {
    cache: "no-store",
    headers,
    credentials: token ? undefined : "include",
  });

  if (!res.ok) {
    throw new Error("Failed to get items");
  }

  return res.json();
};

export const archiveClient = async (id: string, archived: boolean) => {
  const res = await fetch(`/api/userdetail/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ archived }),
  });
  if (!res.ok) throw new Error("Failed to update client");
  return res.json();
};

export const updateClient = async (id: string, data: Partial<ClientForm>) => {
  const res = await fetch(`/api/userdetail/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update client");
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