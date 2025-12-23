import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/adminModel";

export async function DeleteAdminController(id: string) {
  try {
    await connectToDatabase();

    const res = await Admin.findByIdAndDelete(id);

    return {
      data: res,
      message: "Admin deleted successfully!",
      isSuccess: true,
    };
  } catch (error) {
    console.log(error);
  }
}
