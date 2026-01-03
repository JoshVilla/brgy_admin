import mongoose from "mongoose";

export interface IBlotter {
  blotterNo: string;
  incidentType: string;
  incidentDate: string;
  location: string;

  complainantName: string;
  respondentName: string;

  narrative: string;
  status: "ONGOING" | "FOR_HEARING" | "SETTLED" | "REFERRED";

  officerInCharge: string;
}

const BlotterSchema = new mongoose.Schema<IBlotter>(
  {
    blotterNo: { type: String, required: true, unique: true },

    incidentType: { type: String, required: true },

    incidentDate: { type: String, required: true },

    location: { type: String, required: true },

    complainantName: {
      type: String,
      required: true,
      trim: true,
    },

    respondentName: {
      type: String,
      required: true,
      trim: true,
    },

    narrative: { type: String, required: true },

    status: {
      type: String,
      enum: ["ONGOING", "FOR_HEARING", "SETTLED", "REFERRED"],
      default: "ONGOING",
    },

    officerInCharge: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Blotter =
  mongoose.models.Blotter || mongoose.model<IBlotter>("Blotter", BlotterSchema);

export default Blotter;
