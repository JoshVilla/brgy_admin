import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/userModel";
import {
  replaceNewImagefromCurrentImage,
  uploadImageToCloudinary,
} from "@/utils/asyncHelpers";

export async function UploadDocumentId(formData: FormData) {
  try {
    await connectToDatabase();

    const userId = formData.get("userId")?.toString();
    const file = formData.get("fileName");

    if (!userId) {
      throw new Error("Missing user ID.");
    }

    let imageUrl: string | null = null;

    if (file instanceof File) {
      imageUrl = await uploadImageToCloudinary(file);
      await replaceNewImagefromCurrentImage(User, userId);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { imgProof: imageUrl },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("User not found.");
    }

    return {
      message: "File uploaded successfully!",
      isSuccess: true,
      data: updatedUser,
    };
  } catch (error: any) {
    console.error("UploadDocumentId error:", error);
    return {
      message: error?.message || "Something went wrong.",
      isSuccess: false,
    };
  }
}
