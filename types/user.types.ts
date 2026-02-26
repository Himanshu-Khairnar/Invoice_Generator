import { Types } from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  profilePicture?: string;
  provider?: string;
  providerId?: string;
  createdAt: Date;
  updatedAt: Date;
  // Client aggregated stats
  numberOfInvoices?: number;
  numberOfDrafts?: number;
  totalInvoiced?: number;
  totalUnpaid?: number;
}

export interface IUserImage {
  userId: Types.ObjectId;
  bussinessLogo: string;
  signature: string;
}
