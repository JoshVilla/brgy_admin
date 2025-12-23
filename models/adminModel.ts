import mongoose from "mongoose";

export interface IAdmin {
  username: string;
  password: string;
  isSuperAdmin: boolean;
}

const AdminSchema = new mongoose.Schema<IAdmin>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    isSuperAdmin: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const Admin =
  mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);
export default Admin;
