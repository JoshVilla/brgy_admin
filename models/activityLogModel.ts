import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript Interface
export interface IActivityLog extends Document {
  name: string;
  activity: string;
  action: "Add" | "Edit" | "Delete";
  page: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema
const ActivityLogSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    activity: {
      type: String,
      required: true,
      trim: true,
    },
    action: {
      type: String,
      enum: ["Add", "Edit", "Delete"],
      required: true,
    },
    page: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Index for sorting by createdAt
ActivityLogSchema.index({ createdAt: -1 });

// Model
const ActivityLog: Model<IActivityLog> =
  mongoose.models.ActivityLog ||
  mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);

export default ActivityLog;
