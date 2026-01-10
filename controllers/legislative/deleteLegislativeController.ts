import { connectToDatabase } from "@/lib/mongodb";
import Legislative from "@/models/legislativeModel";
import { deleteCloudinaryImage } from "@/utils/asyncHelpers";
import { getCloudinaryPublicId } from "@/utils/nonAsyncHelpers";

export async function DeleteLegislativeController(id: string) {
  try {
    await connectToDatabase();

    // Check if document exists
    const existingData = await Legislative.findById(id);

    if (!existingData) {
      return {
        message: "Legislative document not found",
        isSuccess: false,
      };
    }

    // Delete file from Cloudinary
    const publicId = getCloudinaryPublicId(existingData.file);
    if (publicId) {
      await deleteCloudinaryImage(publicId);
    } else {
      console.warn("No valid Cloudinary public ID found.");
    }

    // Delete document from database
    const deletedDoc = await Legislative.findByIdAndDelete(id);

    return {
      data: deletedDoc,
      message: "Legislative deleted successfully",
      isSuccess: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Failed to delete legislative document.",
      isSuccess: false,
      error: error.message || "An unknown error occurred.",
    };
  }
}
