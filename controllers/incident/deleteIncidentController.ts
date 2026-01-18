import { connectToDatabase } from "@/lib/mongodb";
import IncidentReport from "@/models/incidentModel";
import { deleteCloudinaryImage } from "@/utils/asyncHelpers";
import { getCloudinaryPublicId } from "@/utils/nonAsyncHelpers";

export async function DeleteIncidentController(id: string) {
  try {
    await connectToDatabase();

    // Get data from db
    const currentData = await IncidentReport.findById(id);

    if (!currentData) {
      return { success: false, message: "Incident report not found" };
    }

    // Delete images from Cloudinary
    if (currentData.images && currentData.images.length > 0) {
      // Use Promise.all to wait for all deletions
      await Promise.all(
        currentData.images.map(async (img: string) => {
          const publicId = getCloudinaryPublicId(img);
          if (publicId) {
            await deleteCloudinaryImage(publicId);
          }
        }),
      );
    }

    // Delete the incident report from database
    await IncidentReport.findByIdAndDelete(id);

    return { isSuccess: true, message: "Incident report deleted successfully" };
  } catch (error) {
    console.error("Error deleting incident report:", error);
    return { isSuccess: false, message: "Failed to delete incident report" };
  }
}
