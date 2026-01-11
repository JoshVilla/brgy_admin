import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript Interface
export interface IBarangayOfficial extends Document {
  firstName: string;
  middleName?: string;
  lastName: string;
  position:
    | "Captain"
    | "Kagawad"
    | "SK Chairman"
    | "SK Kagawad"
    | "Secretary"
    | "Treasurer"
    | "Tanod";
  committee?:
    | "Health and Sanitation"
    | "Peace and Order"
    | "Education"
    | "Infrastructure"
    | "Agriculture"
    | "Environment"
    | "Sports and Recreation"
    | "Social Services"
    | "Budget and Finance"
    | "Youth Development"
    | "Livelihood"
    | string; // Allow custom committees
  contactNumber: string;
  photo?: string;
  status: "Active" | "Inactive";
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema
const BarangayOfficialSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    middleName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      enum: [
        "Captain",
        "Kagawad",
        "SK Chairman",
        "SK Kagawad",
        "Secretary",
        "Treasurer",
        "Tanod",
      ],
    },
    committee: {
      type: String,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

// Index
BarangayOfficialSchema.index({ position: 1, status: 1 });

// Model
const BarangayOfficial: Model<IBarangayOfficial> =
  mongoose.models.BarangayOfficial ||
  mongoose.model<IBarangayOfficial>("BarangayOfficial", BarangayOfficialSchema);

export default BarangayOfficial;
