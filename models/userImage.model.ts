import { IUserImage } from "@/types/user.types";
import mongoose from "mongoose";

const UserImageSchema = new mongoose.Schema<IUserImage>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    bussinessLogo: { type: String, required: false },
    signature: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.models.UserImage ||
  mongoose.model("UserImage", UserImageSchema);
