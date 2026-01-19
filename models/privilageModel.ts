import mongoose from "mongoose";

export interface IPrivilage {
  adminId: string;
  dashboard: number;
  resident: number;
  announcement: number;
  event: number;
  request: number;
  blotter: number;
  analytic: number;
  legislative: number;
  admin: number;
  official: number;
  setting: number;
  activitylog: number;
  incident: number;
  lostandfound: number;
}

const PrivilageSchema = new mongoose.Schema<IPrivilage>(
  {
    adminId: { type: String, required: true },
    dashboard: { type: Number, required: true, default: 1 },
    resident: { type: Number, required: true, default: 0 },
    announcement: { type: Number, required: true, default: 0 },
    event: { type: Number, required: true, default: 0 },
    request: { type: Number, required: true, default: 0 },
    blotter: { type: Number, required: true, default: 0 },
    analytic: { type: Number, required: true, default: 0 },
    legislative: { type: Number, required: true, default: 0 },
    admin: { type: Number, required: true, default: 0 },
    official: { type: Number, required: true, default: 0 },
    setting: { type: Number, required: true, default: 0 },
    activitylog: { type: Number, required: true, default: 0 },
    incident: { type: Number, required: true, default: 0 },
    lostandfound: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

const Privilage =
  mongoose.models.Privilage ||
  mongoose.model<IPrivilage>("Privilage", PrivilageSchema);

export default Privilage;
