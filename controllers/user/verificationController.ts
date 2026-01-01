import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/userModel";
import Resident from "@/models/residentModel";

export async function UserVerificationController(params: {
  id: string;
  firstname: string;
  middlename?: string;
  lastname: string;
  suffix?: string;
}) {
  try {
    await connectToDatabase();

    const { id, firstname, middlename = "", lastname, suffix = "" } = params;

    // Normalize all strings for comparison
    const normalizedFirstName = firstname.trim().toLowerCase();
    const normalizedMiddleName = middlename.trim().toLowerCase();
    const normalizedLastName = lastname.trim().toLowerCase();
    const normalizedSuffix = suffix.trim().toLowerCase();

    const matchedResident = await Resident.findOne({
      firstname: { $regex: `^${normalizedFirstName}$`, $options: "i" },
      middlename: { $regex: `^${normalizedMiddleName}$`, $options: "i" },
      lastname: { $regex: `^${normalizedLastName}$`, $options: "i" },
      suffix: { $regex: `^${normalizedSuffix}$`, $options: "i" },
    });

    if (!matchedResident) {
      return {
        message: "Resident not found in the barangay database.",
        isSuccess: false,
      };
    }

    // Mark resident as verified
    (matchedResident.isVerified = true), (matchedResident.userAppId = id);
    await matchedResident.save();

    // Mark user as verified
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true }
    );

    return {
      message: "Verification successful!",
      isSuccess: true,
      data: updatedUser,
    };
  } catch (error) {
    console.error("Verification Error:", error);
    return {
      message: "Something went wrong during verification.",
      isSuccess: false,
    };
  }
}
