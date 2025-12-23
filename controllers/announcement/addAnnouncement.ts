import { connectToDatabase } from "@/lib/mongodb";
import Announcement, { IAnnouncement } from "@/models/announcementModel";

export async function AddAnnouncementController(params: IAnnouncement) {
  try {
    await connectToDatabase();

    // If the new announcement is marked as viewed,
    // set all existing announcements to isViewed: false
    if (params.isViewed === true) {
      await Announcement.updateMany({}, { isViewed: false });
    }

    const res = await Announcement.create(params);

    return {
      message: "Announcement Added Successfully",
      isSuccess: true,
      data: res,
    };
  } catch (error) {
    console.error("Error adding announcement:", error);
    return {
      message: "Failed to add announcement.",
      isSuccess: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
