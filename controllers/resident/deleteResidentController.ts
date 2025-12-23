import { connectToDatabase } from "@/lib/mongodb";
import Resident from "@/models/residentModel";

export async function DeleteResidentController(id: string) {
  try {
    await connectToDatabase();

    const res = await Resident.findByIdAndDelete(id);

    return {
      data: res,
      message: "Data deleted successfully!",
      isSuccess: true,
    };
  } catch (error) {
    console.log(error);
  }
}
