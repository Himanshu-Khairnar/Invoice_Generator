import mongoose  from "mongoose";
import {IPersonalDetail}  from "@/types/PersonalDetail.types";
const PersonalDetailSchema = new mongoose.Schema<IPersonalDetail>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["userDetail", "clientDetail"],
      required: true,
    },
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 80,
    },
    cin: {
      type: String,
      match: /^[A-Z]{1}[A-Z]{4}[0-9]{6}[A-Z]{3}[0-9]{6}$/,
      required: false,
    },
    gstin: {
      type: String,
      match: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      required: false,
    },
    addressLine1: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 120,
    },
    addressLine2: {
      type: String,
      maxlength: 120,
    },
    postalCode: {
      type: String,
      required: true,
      match: /^[1-9][0-9]{5}$/,
    },
    city: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 60,
    },
    state: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 60,
    },
    country: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 60,
    },
    phoneNumber: {
      type: String,
      required: true,
      match: /^[6-9][0-9]{9}$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    website: {
      type: String,
      match: /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*\/?$/,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.PersonalDetail || mongoose.model("PersonalDetail", PersonalDetailSchema);
