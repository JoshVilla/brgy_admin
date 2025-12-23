import { connectToDatabase } from "@/lib/mongodb";
import Resident, { IResident } from "@/models/residentModel";

export async function AddResidentController(params: IResident) {
  try {
    await connectToDatabase();

    // Use Mongoose's create method to add a new resident
    const newResident = await Resident.create(params);

    return {
      message: "Resident Added Successfully!",
      isSuccess: true,
      data: newResident, // Return the newly created resident document
    };
  } catch (error: any) {
    // Type 'error' as 'any' or 'unknown' for better handling
    console.error("Error adding resident:", error); // Use console.error for errors
    return {
      message: "Failed to add resident.",
      isSuccess: false,
      error: error.message || "An unknown error occurred.", // Provide a helpful error message
    };
  }
}
