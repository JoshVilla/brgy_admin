import { connectToDatabase } from "@/lib/mongodb";
import Privilage from "@/models/privilageModel";
import { connect } from "http2";
interface UpdatePrivilegesInput {
  adminId: string;
  dashboard?: number;
  resident?: number;
  announcement?: number;
  event?: number;
  request?: number;
  blotter?: number;
  analytic?: number;
  legislative?: number;
  admin?: number;
  official?: number;
  setting?: number;
  activitylog?: number;
}

export const UpdatePrivilegesController = async (
  data: UpdatePrivilegesInput
) => {
  try {
    const { adminId, ...privileges } = data;

    await connectToDatabase();
    // Validate adminId
    if (!adminId) {
      return {
        isSuccess: false,
        message: "Admin ID is required",
      };
    }

    // Find and update privileges
    const updatedPrivilege = await Privilage.findOneAndUpdate(
      { adminId },
      {
        dashboard: privileges.dashboard ?? 0,
        resident: privileges.resident ?? 0,
        announcement: privileges.announcement ?? 0,
        event: privileges.event ?? 0,
        request: privileges.request ?? 0,
        blotter: privileges.blotter ?? 0,
        analytic: privileges.analytic ?? 0,
        legislative: privileges.legislative ?? 0,
        admin: privileges.admin ?? 0,
        official: privileges.official ?? 0,
        setting: privileges.setting ?? 0,
        activitylog: privileges.activitylog ?? 0,
      },
      { new: true, upsert: true } // Create if doesn't exist
    );

    return {
      isSuccess: true,
      message: "Privileges updated successfully",
      data: updatedPrivilege,
    };
  } catch (error) {
    console.error("Error updating privileges:", error);
    return {
      isSuccess: false,
      message: "Failed to update privileges",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
