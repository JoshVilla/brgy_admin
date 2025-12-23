import mongoose from "mongoose";

const SampleSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const Sample = mongoose.models.Sample || mongoose.model("Sample", SampleSchema);
export default Sample;
