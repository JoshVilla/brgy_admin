import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/adminModel";
import { logActivity } from "../activitylog/addActivityLogController";
import Privilage from "@/models/privilageModel";

export async function DeleteAdminController(
  id: string,
  currentUsername: string
) {
  try {
    await connectToDatabase();

    const res = await Admin.findByIdAndDelete(id);

    await Privilage.findOneAndDelete({ adminId: id });

    await logActivity(
      currentUsername,
      `Account ${res.username} was removed`,
      "Delete",
      "Admins"
    );

    return {
      data: res,
      message: "Admin deleted successfully!",
      isSuccess: true,
    };
  } catch (error) {
    console.log(error);
  }
}
