import mongoose from "mongoose";
import { IBankDetail } from "@/types/bankDetail.types";
const BankDetailSchema = new mongoose.Schema<IBankDetail>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId ,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Bank Transfer", "Payment Link", "Payment Instructions"],
    },
    accountName: {
      type: String,
      required: false,
      minlength: 4,
      maxlength: 50,
    },
    accountNumber: {
      type: String,
      required: false,
      minlength: 8,
      maxlength: 30,
      unique: false,
    },
    bankName: {
      type: String,
      required: false,
      minlength: 2,
      maxlength: 50,
    },
    ifscCode: {
      type: String,
      required: false,
      minLength: 11,
      maxLength: 11,
    },
    swiftCode: {
      type: String,
      required: false,
      minLength: 8,
      maxLength: 11,
    },
    paymentLink: {
      type: String,
      required: false,
      match: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    },
    paymentInstructions: {
      type: String,
      required: false,
      minlength: 10,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

export default mongoose.models.BankDetail ||
  mongoose.model("BankDetail", BankDetailSchema);
