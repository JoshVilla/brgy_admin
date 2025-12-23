import mongoose from "mongoose";

export interface IResident {
  firstname: string;
  middlename: string;
  lastname: string;
  suffix: string;
  birthdate: string;
  gender: string;
  purok: string;
  isSeniorCitizen: boolean | string;
  isPwd: boolean | string;
  isVerified: boolean;
}

const ResidentSchema = new mongoose.Schema<IResident>(
  {
    firstname: { type: String, required: true },
    middlename: { type: String, required: true },
    lastname: { type: String, required: true },
    suffix: { type: String, default: "" },
    birthdate: { type: String, required: true },
    gender: { type: String, required: true },
    purok: { type: String, required: true },
    isSeniorCitizen: { type: Boolean, required: true },
    isPwd: { type: Boolean, required: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Resident =
  mongoose.models.Resident ||
  mongoose.model<IResident>("Resident", ResidentSchema);
export default Resident;
