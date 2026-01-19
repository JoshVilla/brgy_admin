import { connectToDatabase } from "@/lib/mongodb";
import Privilage from "@/models/privilageModel";
import Admin from "@/models/adminModel"; // Add Admin model import

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
  incident?: number;
  lostandfound?: number;
}

export const UpdatePrivilegesController = async (
  data: UpdatePrivilegesInput,
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

    // Prepare privilege values with defaults
    const privilegeValues = {
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
      incident: privileges.incident ?? 0,
      lostandfound: privileges.lostandfound ?? 0,
    };

    // Find and update privileges
    const updatedPrivilege = await Privilage.findOneAndUpdate(
      { adminId },
      privilegeValues,
      { new: true, upsert: true }, // Create if doesn't exist
    );

    // Check if admin has complete access (all privileges = 1)
    const hasCompleteAccess = Object.values(privilegeValues).every(
      (value) => value === 1,
    );

    // Update admin's isSuperAdmin status based on privileges
    await Admin.findByIdAndUpdate(
      adminId,
      { isSuperAdmin: hasCompleteAccess },
      { new: true },
    );

    return {
      isSuccess: true,
      message: `Privileges updated successfully${
        hasCompleteAccess ? " - Admin promoted to Super Admin" : ""
      }`,
      data: updatedPrivilege,
      isSuperAdmin: hasCompleteAccess,
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
