import { connectToDatabase } from "@/lib/mongodb";
import Sample from "@/models/sampleModal";

export async function SampleController() {
  try {
    await connectToDatabase();
    await Sample.insertOne({ description: new Date() });

    return {
      message: new Date(),
    };
  } catch (error) {
    console.error("GetTotalCountsController error:", error);
  }
}
