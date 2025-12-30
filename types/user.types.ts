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
}

export interface IUserImage {
  userId: Types.ObjectId;
  bussinessLogo: string;
  signature: string;
}
