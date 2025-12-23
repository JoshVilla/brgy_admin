import mongoose from "mongoose";

export interface IUser {
  name: string;
  username: string;
  password: string;
  phoneNumber: string;
  isVerified: boolean;
  imgProof: string;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    imgProof: { type: String, default: null },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
