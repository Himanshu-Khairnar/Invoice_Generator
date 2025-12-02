import { Types } from "mongoose";

export interface IBankDetail {
    _id: string;
    userId: Types.ObjectId;
    type: "Bank Transfer" | "Payment Link" | "Payment Instructions";
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    ifscCode?: string;
    swiftCode?: string;
    paymentLink?: string;
    paymentInstructions?: string;
    createdAt: Date;
    updatedAt: Date;
}