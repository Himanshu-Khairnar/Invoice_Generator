import { Types } from "mongoose";

export interface IPersonalDetail {
    userId: Types.ObjectId;
    type: "userDetail" | "clientDetail";
    name: string;
    cin?: string;
    gstin?: string;
    addressLine1: string;
    addressLine2?: string;
    postalCode: string;
    city: string;
    state: string;
    country: string;
    phoneNumber: string;
    email: string;
    website?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
