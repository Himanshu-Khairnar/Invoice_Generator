import { Types } from "mongoose";
import { IItem } from "./item.types";

export interface IInvoiceProduct {
  itemId?: Types.ObjectId;
  productName: string;
  productPrice: number;
  quantity: number;
  taxSlab: number;
  unit?: string;
  discount?: number;
  lineTotal?: number;
}

export interface IInvoice {
  _id?: Types.ObjectId; 
  userId: Types.ObjectId;
  userImageId?: Types.ObjectId;
  userDetailId: Types.ObjectId;
  clientDetailId: Types.ObjectId;
  invoiceDate: Date;
  invoiceNumber: string;
  dueDate?: Date;
  description?: string;
  products: IItem[];
  bankDetails?: Types.ObjectId[];
  status: "due" | "payment done" | "cancel" | "draft";
  subTotal?: number;
  taxTotal?: number;
  discountTotal?: number;
  totalAmount?: number;
  paidAmount?: number;
  balanceDue?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
