import { Types } from "mongoose";

export interface IUser {
  _id: string;
  fullname: string;
  email: string;
  password: string;
  profilePicture?: string;
  provider?: string;
  providerId?: string;
  loginOtp?: string;
  loginOtpExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Client contact & address fields
  phoneNumber?: string;
  website?: string;
  cin?: string;
  gstin?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  // Client aggregated stats
  numberOfInvoices?: number;
  numberOfDrafts?: number;
  totalInvoiced?: number;
  totalUnpaid?: number;
  archived?: boolean;
}

export interface IUserImage {
  userId: Types.ObjectId;
  bussinessLogo: string;
  signature: string;
}
