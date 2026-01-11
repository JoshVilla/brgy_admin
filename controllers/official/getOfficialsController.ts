import { connectToDatabase } from "@/lib/mongodb";
import BarangayOfficial from "@/models/officialModel";

export async function GetOfficialsController(id?: string) {
  try {
    await connectToDatabase();

    let query: any = {};

    // If id is provided, query by _id (MongoDB uses _id)
    if (id) query._id = id;

    const officials = await BarangayOfficial.find(query);

    return {
      data: officials,
      isSuccess: true,
    };
  } catch (error) {
    console.log(error);
    return {
      message: "Cannot fetch the Barangay Officials",
      isSuccess: false, // Changed from true to false
    };
  }
}
