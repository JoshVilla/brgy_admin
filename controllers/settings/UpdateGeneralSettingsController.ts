import { connectToDatabase } from "@/lib/mongodb";
import Settings from "@/models/settingsModel";
import {
  deleteCloudinaryImage,
  uploadImageToCloudinary,
} from "@/utils/asyncHelpers";
import { getCloudinaryPublicId } from "@/utils/nonAsyncHelpers";
import { logActivity } from "../activitylog/addActivityLogController";

export async function UpdateGeneralSettingsController(
  formData: FormData,
  currentUsername: string,
) {
  try {
    await connectToDatabase();

    const adminTitle = formData.get("adminTitle") as string | null;
    const adminLogoFile = formData.get("adminLogo") as File | null;

    // Get existing settings first
    const existingSettings = await Settings.findById("SYSTEM_SETTINGS").select(
      "general.adminTitle general.adminLogo",
    );

    // Build update object
    const updateFields: any = {};
    let changedFields: string[] = []; // Track what changed

    // Handle admin title - only if it actually changed
    if (
      adminTitle !== null &&
      adminTitle !== undefined &&
      adminTitle !== existingSettings?.general?.adminTitle
    ) {
      updateFields["general.adminTitle"] = adminTitle;
      changedFields.push("title");
    }

    // Handle logo upload
    if (adminLogoFile && adminLogoFile.size > 0) {
      try {
        if (existingSettings?.general?.adminLogo) {
          const publicId = getCloudinaryPublicId(
            existingSettings.general.adminLogo,
          );

          if (publicId) {
            // Delete old logo from Cloudinary
            await deleteCloudinaryImage(publicId);
            console.log("Old logo deleted from Cloudinary:", publicId);
          } else {
            console.warn("No valid Cloudinary public ID found for old logo.");
          }
        }

        // Upload new logo to Cloudinary
        const uploadedFile = await uploadImageToCloudinary(adminLogoFile);

        if (!uploadedFile) {
          return {
            message: "Failed to upload logo to Cloudinary",
            isSuccess: false,
          };
        }

        updateFields["general.adminLogo"] = uploadedFile;
        changedFields.push("logo");
      } catch (uploadError) {
        console.error("Error handling logo upload:", uploadError);
        return {
          message: "Failed to process logo upload",
          isSuccess: false,
          error:
            uploadError instanceof Error
              ? uploadError.message
              : "Unknown error",
        };
      }
    }

    // Check if there are any fields to update
    if (Object.keys(updateFields).length === 0) {
      return {
        message: "No fields to update",
        isSuccess: false,
      };
    }

    // Update settings in database
    const settings = await Settings.findByIdAndUpdate(
      "SYSTEM_SETTINGS",
      { $set: updateFields },
      { new: true, runValidators: true },
    ).select("general");

    if (!settings) {
      return {
        message: "Settings not found",
        isSuccess: false,
      };
    }

    // Log activity based on what changed
    let logMessage = "";
    if (changedFields.length === 2) {
      logMessage = "Updated admin title and logo";
    } else if (changedFields.includes("title")) {
      logMessage = `Updated admin title to "${adminTitle}"`;
    } else if (changedFields.includes("logo")) {
      logMessage = "Updated admin logo";
    }

    if (logMessage) {
      await logActivity(currentUsername, logMessage, "Edit", "Settings");
    }

    return {
      isSuccess: true,
      message: "General settings updated successfully",
      general: settings.general,
    };
  } catch (error: any) {
    console.error("Error updating general settings:", error);
    return {
      isSuccess: false,
      message: "Failed to update general settings",
      error: error.message,
    };
  }
}
