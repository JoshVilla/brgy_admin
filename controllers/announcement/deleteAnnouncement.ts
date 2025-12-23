import { connectToDatabase } from "@/lib/mongodb";
import Announcement from "@/models/announcementModel";

export async function DeleteAnnouncementController(id: string) {
  try {
    await connectToDatabase();

    const res = await Announcement.findByIdAndDelete(id);

    return {
      message: "Announcement Deleted Successfully",
      isSuccess: true,
      data: res,
    };
  } catch (error) {
    console.log(error);
  }
}
