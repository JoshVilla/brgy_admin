import { connectToDatabase } from "@/lib/mongodb";
import BarangayOfficial from "@/models/officialModel";
import {
  deleteCloudinaryImage,
  uploadImageToCloudinary,
} from "@/utils/asyncHelpers";
import { getCloudinaryPublicId } from "@/utils/nonAsyncHelpers";

export async function EditOfficialController(formData: FormData) {
  try {
    await connectToDatabase();

    // Extract data from formData
    const id = formData.get("id") as string;
    const firstName = formData.get("firstName") as string;
    const middleName = formData.get("middleName") as string;
    const lastName = formData.get("lastName") as string;
    const position = formData.get("position") as string;
    const committee = formData.get("committee") as string;
    const contactNumber = formData.get("contactNumber") as string;
    const file = (formData.get("photo") as File) || null;
    const status = formData.get("status") as string;

    // Validate required fields
    if (!firstName || !lastName || !position || !contactNumber) {
      return {
        message:
          "Missing required fields: firstName, lastName, position, contactNumber",
        isSuccess: false,
      };
    }

    // Validate position
    const validPositions = [
      "Captain",
      "Kagawad",
      "SK Chairman",
      "SK Kagawad",
      "Secretary",
      "Treasurer",
      "Tanod",
    ];
    if (!validPositions.includes(position)) {
      return {
        message: "Invalid position",
        isSuccess: false,
      };
    }

    // Find existing official
    const existingOfficial = await BarangayOfficial.findById(id);

    if (!existingOfficial) {
      return {
        message: "Official not found",
        isSuccess: false,
      };
    }

    // Check if Captain already exists (if changing to Captain)
    if (position === "Captain" && existingOfficial.position !== "Captain") {
      const existingCaptain = await BarangayOfficial.findOne({
        position: "Captain",
        status: "Active",
        _id: { $ne: id },
      });

      if (existingCaptain) {
        return {
          message: "An active Barangay Captain already exists",
          isSuccess: false,
        };
      }
    }

    // Handle photo upload
    let photoUrl = existingOfficial.photo; // Keep existing photo by default

    // Only process photo if a new file was uploaded
    if (file && file instanceof File && file.size > 0) {
      // Delete old photo from Cloudinary if it exists
      if (existingOfficial.photo) {
        const publicId = getCloudinaryPublicId(existingOfficial.photo);
        if (publicId) {
          await deleteCloudinaryImage(publicId);
        }
      }

      // Upload new photo
      photoUrl = await uploadImageToCloudinary(file);
    }

    // Update official
    const updatedOfficial = await BarangayOfficial.findByIdAndUpdate(
      id,
      {
        firstName,
        middleName: middleName || null,
        lastName,
        position,
        committee: committee || null,
        contactNumber,
        photo: photoUrl,
        status: status || "Active",
      },
      { new: true, runValidators: true }
    );

    return {
      message: "Barangay official updated successfully",
      isSuccess: true,
      data: updatedOfficial,
    };
  } catch (error: any) {
    console.error("Error updating barangay official:", error);

    if (error.code === 11000) {
      return {
        message: "Official with this information already exists",
        isSuccess: false,
      };
    }

    if (error.name === "ValidationError") {
      return {
        message: error.message,
        isSuccess: false,
      };
    }

    if (error.name === "CastError") {
      return {
        message: "Invalid official ID",
        isSuccess: false,
      };
    }

    return {
      message: "Failed to update barangay official",
      isSuccess: false,
    };
  }
}
