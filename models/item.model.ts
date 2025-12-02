import mongoose from "mongoose";
import { IItem } from "../types/item.types";
const ItemSchema = new mongoose.Schema<IItem>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productNo: {
      type: String,
      required: true,
      unique: true,
      minlength: 1,
      maxlength: 40,
    },
    productName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 120,
    },
    productPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    taxSlab: {
      type: Number,
      required: true,
      enum: [0, 5, 12, 18, 28],
    },
    timesInvoiced: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ["archived", "unarchived"],
      default: "unarchived",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Item || mongoose.model("Item", ItemSchema);
