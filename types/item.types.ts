import mongoose from "mongoose";
export interface IItem {
  userId: mongoose.Types.ObjectId;
  productNo: string;
  productName: string;
  productPrice: number;
  taxSlab: number;
  timesInvoiced?: number;
  status?: "archived" | "unarchived";
  unit?: string;
  discount?: number;
  lineTotal?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
