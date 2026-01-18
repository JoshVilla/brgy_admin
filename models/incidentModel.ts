import mongoose from "mongoose";

export interface IIncidentReport {
  referenceNumber: string;
  incidentType: string;
  description: string;
  location: string;
  dateOccurred: Date;
  reporterName: string;
  reporterContact: string;
  residentId?: mongoose.Types.ObjectId; // Optional: links to Resident
  status: "pending" | "investigating" | "resolved" | "closed";
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const IncidentReportSchema = new mongoose.Schema<IIncidentReport>(
  {
    referenceNumber: { type: String, required: true, unique: true },
    incidentType: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    dateOccurred: { type: Date, required: true },
    reporterName: { type: String, required: true },
    reporterContact: { type: String, required: true },
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      default: null,
    }, // Optional: links to Resident document
    status: {
      type: String,
      enum: ["pending", "investigating", "resolved", "closed"],
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
    // ... other fields
  },
  { timestamps: true },
);

const IncidentReport =
  mongoose.models.IncidentReport ||
  mongoose.model<IIncidentReport>("IncidentReport", IncidentReportSchema);

export default IncidentReport;
