import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import Invoice from "@/models/invoice.model";
import Item from "@/models/item.model";
import PersonalDetail from "@/models/userDetail.model";
import BankDetail from "@/models/bankDetail.model";
import "@/models/userImage.model";

async function getUserId(): Promise<string | null> {
  try {
    const token = (await cookies()).get("access_token")?.value;
    if (!token) return null;
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    return payload.userId ?? null;
  } catch {
    return null;
  }
}

export async function getServerInvoices() {
  const userId = await getUserId();
  if (!userId) return [];
  await dbConnect();
  const invoices = await Invoice.find({ userId })
    .populate("userImageId")
    .populate("userDetailId")
    .populate("clientDetailId")
    .populate("bankDetails")
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(invoices));
}

export async function getServerItems() {
  const userId = await getUserId();
  if (!userId) return [];
  await dbConnect();
  const items = await Item.find({ userId }).lean();
  return JSON.parse(JSON.stringify(items));
}

export async function getServerUserDetails(type: string) {
  const userId = await getUserId();
  if (!userId) return [];
  await dbConnect();
  const details = await PersonalDetail.find({ userId, type }).lean();
  return JSON.parse(JSON.stringify(details));
}

export async function getServerBankDetails() {
  const userId = await getUserId();
  if (!userId) return [];
  await dbConnect();
  const details = await BankDetail.find({ userId }).lean();
  return JSON.parse(JSON.stringify(details));
}
