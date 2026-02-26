import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import Invoice from "@/models/invoice.model";
import Item from "@/models/item.model";
import PersonalDetail from "@/models/userDetail.model";
import BankDetail from "@/models/bankDetail.model";
import UserImage from "@/models/userImage.model";

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

  if (type !== "clientDetail") {
    const details = await PersonalDetail.find({ userId, type }).lean();
    return JSON.parse(JSON.stringify(details));
  }

  // For clients: aggregate invoice stats (numberOfInvoices, numberOfDrafts, totalInvoiced, totalUnpaid)
  const details = await PersonalDetail.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), type: "clientDetail" } },
    {
      $lookup: {
        from: "invoices",
        localField: "_id",
        foreignField: "clientDetailId",
        as: "invoices",
      },
    },
    {
      $addFields: {
        numberOfInvoices: {
          $size: {
            $filter: { input: "$invoices", as: "inv", cond: { $ne: ["$$inv.status", "draft"] } },
          },
        },
        numberOfDrafts: {
          $size: {
            $filter: { input: "$invoices", as: "inv", cond: { $eq: ["$$inv.status", "draft"] } },
          },
        },
        totalInvoiced: {
          $sum: {
            $map: {
              input: {
                $filter: { input: "$invoices", as: "inv", cond: { $ne: ["$$inv.status", "cancel"] } },
              },
              as: "inv",
              in: { $ifNull: ["$$inv.totalAmount", 0] },
            },
          },
        },
        totalUnpaid: {
          $sum: {
            $map: {
              input: {
                $filter: { input: "$invoices", as: "inv", cond: { $eq: ["$$inv.status", "due"] } },
              },
              as: "inv",
              in: { $ifNull: ["$$inv.balanceDue", 0] },
            },
          },
        },
      },
    },
    { $project: { invoices: 0 } },
  ]);

  return JSON.parse(JSON.stringify(details));
}

export async function getServerBankDetails() {
  const userId = await getUserId();
  if (!userId) return [];
  await dbConnect();
  const details = await BankDetail.find({ userId }).lean();
  return JSON.parse(JSON.stringify(details));
}

export async function getServerUserImage() {
  const userId = await getUserId();
  if (!userId) return null;
  await dbConnect();
  const image = await UserImage.findOne({ userId }).lean();
  return image ? JSON.parse(JSON.stringify(image)) : null;
}
