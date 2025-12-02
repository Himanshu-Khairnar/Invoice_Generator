import { IUser } from "@/types/user.types";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema<IUser>(
  {
    fullname: { type: String, required: true, minlength: 4, maxlength: 50 },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    password: { type: String, required: false, minlength: 8, maxlength: 50 },
    profilePicture: { type: String, required: false },
    provider: { type: String, required: false },
    providerId: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
