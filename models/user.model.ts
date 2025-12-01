import { User } from "@/types/user.types";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema<User>(
  {
    Fullname: { type: String, required: true, minlength: 4, maxlength: 50 },
    Email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    Password: { type: String, required: false, minlength: 8, maxlength: 50 },
    ProfilePicture: String,
    Provider: { type: String },
    ProviderId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
