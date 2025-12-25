import { connectToDatabase } from "@/lib/mongodb";
import Resident from "@/models/residentModel";

export async function AgeGraphController() {
  try {
    await connectToDatabase();
  } catch (error: any) {
    console.log(error);
    return {
      message: "An error occurred while fetching the age.",
      data: null,
      isSuccess: false,
      error: error.message || "Unknown error",
    };
  }
}
