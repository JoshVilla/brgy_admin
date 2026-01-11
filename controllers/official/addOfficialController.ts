import { connectToDatabase } from "@/lib/mongodb";
import BarangayOfficial from "@/models/officialModel";
import { uploadImageToCloudinary } from "@/utils/asyncHelpers";

export async function AddOfficialController(formData: FormData) {
  try {
    await connectToDatabase();

    // Extract data from formData
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

    // Check if Captain already exists and active (only one captain allowed)
    if (position === "Captain") {
      const existingCaptain = await BarangayOfficial.findOne({
        position: "Captain",
        status: "Active",
      });

      if (existingCaptain) {
        return {
          message: "An active Barangay Captain already exists",
          isSuccess: false,
        };
      }
    }

    //upload image in cloudinary
    let photo: string | null = null;
    if (file && file instanceof File) {
      photo = await uploadImageToCloudinary(file);
    }
    // Create new official
    const newOfficial = await BarangayOfficial.create({
      firstName,
      middleName,
      lastName,
      position,
      committee: committee || null,
      contactNumber,
      photo: photo || null,
      status: status || "Active",
    });

    return {
      message: "Barangay official added successfully",
      isSuccess: true,
      data: newOfficial,
    };
  } catch (error: any) {
    console.error("Error adding barangay official:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return {
        message: "Official with this information already exists",
        isSuccess: false,
      };
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      return {
        message: error.message,
        isSuccess: false,
      };
    }

    return {
      message: "Failed to add barangay official",
      isSuccess: false,
    };
  }
}
