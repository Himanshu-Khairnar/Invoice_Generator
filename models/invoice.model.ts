import mongoose from "mongoose";
import { IInvoice, IInvoiceProduct } from "@/types/invoice.types";

const InvoiceProductSchema = new mongoose.Schema<IInvoiceProduct>(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: false,
    },
    productName: { type: String, required: true, minlength: 1, maxlength: 200 },
    productPrice: { type: Number, required: true, min: 0 },
    unit: { type: String, required: false, maxlength: 40 },
    quantity: { type: Number, required: true, min: 0 },
    taxSlab: { type: Number, required: true, enum: [0, 5, 12, 18, 28] },
    discount: { type: Number, required: false, min: 0, default: 0 },
    lineTotal: { type: Number, required: false, min: 0 },
  },
  { _id: false }
);

const InvoiceSchema = new mongoose.Schema<IInvoice>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userImageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserImage",
      required: false,
    },
    userDetailId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PersonalDetail",
      required: true,
    },
    clientDetailId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PersonalDetail",
      required: true,
    },
    invoiceDate: { type: Date, required: true },
    invoiceNumber: { type: String, required: true, unique: true, maxlength: 60 },
    dueDate: { type: Date, required: false },
    description: { type: String, required: false, maxlength: 2000 },
    products: { type: [InvoiceProductSchema], required: true, default: [] },
    bankDetails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BankDetail",
      },
    ],
    status: {
      type: String,
      enum: ["due", "payment done", "cancel", "draft"],
      default: "draft",
    },
    subTotal: { type: Number, required: false, min: 0 },
    taxTotal: { type: Number, required: false, min: 0 },
    discountTotal: { type: Number, required: false, min: 0 },
    totalAmount: { type: Number, required: false, min: 0 },
    paidAmount: { type: Number, required: false, min: 0, default: 0 },
    balanceDue: { type: Number, required: false, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);
