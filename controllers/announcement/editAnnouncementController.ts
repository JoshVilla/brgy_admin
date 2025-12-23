import { connectToDatabase } from "@/lib/mongodb";
import Announcement, { IAnnouncement } from "@/models/announcementModel";
import { IResAnnouncement } from "@/utils/types";

export async function EditAnnouncementController(params: IResAnnouncement) {
  try {
    await connectToDatabase();

    const { announcement, isViewed, _id } = params;

    if (isViewed === true) {
      await Announcement.updateMany({}, { isViewed: false });
    }

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      _id,
      {
        announcement,
        isViewed,
      },
      { new: true }
    );

    return {
      message: "Announcement updated successfully.",
      data: updatedAnnouncement,
      isSuccess: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "An error occurred while updating the announcement.",
      data: null,
      isSuccess: false,
      error: error.message || "Unknown error",
    };
  }
}
