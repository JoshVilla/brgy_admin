import mongoose from "mongoose";

export interface ILegislative {
  title: string;
  legislativeType: string;
  orderNumber: string;
  file: string;
  description?: string;
  dateApproved: Date;
  effectiveDate?: Date;
  status: string;
  author?: string;
  category?: string;
  createdBy?: mongoose.Types.ObjectId;
}

const LegislativeSchema = new mongoose.Schema<ILegislative>(
  {
    title: { type: String, required: true },
    legislativeType: {
      type: String,
      required: true,
      enum: [
        "Ordinance",
        "Resolution",
        "Executive Order",
        "Memorandum",
        "Proclamation",
      ],
    },
    orderNumber: { type: String, required: true, unique: true },
    file: { type: String, required: true }, // file path or URL
    description: { type: String }, // brief summary of the document
    dateApproved: { type: Date, required: true }, // when it was approved
    effectiveDate: { type: Date }, // when it takes effect (optional, defaults to dateApproved)
    status: {
      type: String,
      required: true,
      enum: ["Draft", "Approved", "Implemented", "Archived"],
      default: "Draft",
    },
    author: { type: String }, // who authored/sponsored it
    category: {
      type: String,
      enum: [
        "Governance",
        "Public Safety",
        "Health",
        "Infrastructure",
        "Education",
        "Environment",
        "Social Services",
        "Finance",
        "Other",
      ],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

const Legislative =
  mongoose.models.Legislative ||
  mongoose.model<ILegislative>("Legislative", LegislativeSchema);
export default Legislative;
