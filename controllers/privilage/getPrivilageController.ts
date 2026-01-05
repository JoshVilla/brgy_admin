import { connectToDatabase } from "@/lib/mongodb";
import Privilage from "@/models/privilageModel";

export async function GetPrivilageController({ adminId }: { adminId: string }) {
  try {
    await connectToDatabase();

    const privilages = await Privilage.findOne({ adminId });

    return {
      isSuccess: true,
      data: privilages,
    };
  } catch (error) {
    console.log(error);
    return {
      isSuccess: false,
      message: "Error fetching privilages",
    };
  }
}
