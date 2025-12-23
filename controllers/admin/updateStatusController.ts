import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/adminModel";

export async function UpdateStatusController(params: {
  id: string;
  status: string; // "true" or "false"
}) {
  try {
    await connectToDatabase();

    const updatedAdmin = await Admin.findByIdAndUpdate(
      params.id,
      {
        isSuperAdmin: params.status === "true",
      },
      {
        new: true,
      }
    );

    return {
      isSuccess: true,
      message: "Admin status updated successfully.",
      data: updatedAdmin,
    };
  } catch (error) {
    console.error("Failed to update admin status:", error);
    return {
      isSuccess: false,
      message: "Error updating admin status.",
    };
  }
}
