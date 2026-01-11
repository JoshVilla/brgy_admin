import { connectToDatabase } from "@/lib/mongodb";
import Settings from "@/models/settingsModel";
import {
  deleteCloudinaryImage,
  uploadImageToCloudinary,
} from "@/utils/asyncHelpers";
import { getCloudinaryPublicId } from "@/utils/nonAsyncHelpers";

export async function UpdateGeneralSettingsController(formData: FormData) {
  try {
    await connectToDatabase();

    const adminTitle = formData.get("adminTitle") as string | null;
    const adminLogoFile = formData.get("adminLogo") as File | null;

    // Build update object
    const updateFields: any = {};

    // Handle admin title
    if (adminTitle !== null && adminTitle !== undefined) {
      updateFields["general.adminTitle"] = adminTitle;
    }

    // Handle logo upload
    if (adminLogoFile && adminLogoFile.size > 0) {
      try {
        // Get existing logo to delete from Cloudinary
        const existingSettings = await Settings.findById(
          "SYSTEM_SETTINGS"
        ).select("general.adminLogo");

        if (existingSettings?.general?.adminLogo) {
          const publicId = getCloudinaryPublicId(
            existingSettings.general.adminLogo
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

        // **BUG FIX**: Should be "general.adminLogo" not "adminLogo"
        updateFields["general.adminLogo"] = uploadedFile;
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
      { new: true, runValidators: true }
    ).select("general");

    if (!settings) {
      return {
        message: "Settings not found",
        isSuccess: false,
      };
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
