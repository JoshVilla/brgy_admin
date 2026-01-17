import mongoose, { Schema, Document } from "mongoose";

export interface IIncidentReport extends Document {
  referenceNumber: string;
  incidentType:
    | "crime"
    | "accident"
    | "dispute"
    | "noise"
    | "fire"
    | "health"
    | "environmental"
    | "other";
  description: string;
  location: string;
  dateOccurred: Date;
  reporterName: string;
  reporterContact: string;
  status: "pending" | "investigating" | "resolved";
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const IncidentReportSchema = new Schema<IIncidentReport>(
  {
    referenceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    incidentType: {
      type: String,
      required: true,
      enum: [
        "crime",
        "accident",
        "dispute",
        "noise",
        "fire",
        "health",
        "environmental",
        "other",
      ],
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    dateOccurred: {
      type: Date,
      required: true,
    },
    reporterName: {
      type: String,
      required: true,
    },
    reporterContact: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "investigating", "resolved"],
      default: "pending",
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.length <= 5;
        },
        message: "Maximum 5 images allowed",
      },
    },
  },
  {
    timestamps: true,
  },
);

const IncidentReport =
  mongoose.models.IncidentReport ||
  mongoose.model<IIncidentReport>("IncidentReport", IncidentReportSchema);

export default IncidentReport;
