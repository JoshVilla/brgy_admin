import mongoose from "mongoose";

// Optional: Enum to enforce consistent status values
export enum RequestStatus {
  Pending = "pending",
  Approved = "approved",
  Cancelled = "cancelled",
  Processing = "processing",
}

// TypeScript interface for the request
export interface IRequest extends mongoose.Document {
  userId: string;
  name: string;
  status: RequestStatus;
  reason: string;
  type: number;
  reasonOfCancelation?: string | null;
  isVerified: boolean;
  imgProof?: string | null;
}

// Mongoose schema definition
const RequestSchema = new mongoose.Schema<IRequest>(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(RequestStatus),
      default: RequestStatus.Pending,
    },
    reason: { type: String, required: true },
    type: { type: Number, required: true },
    reasonOfCancelation: { type: String, default: null },
    isVerified: { type: Boolean, required: true },
    imgProof: { type: String, default: null },
  },
  { timestamps: true }
);

// Export the model (with hot-reload-safe check)
const Request =
  mongoose.models.Request || mongoose.model<IRequest>("Request", RequestSchema);

export default Request;
