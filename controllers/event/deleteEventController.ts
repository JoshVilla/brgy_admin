import { connectToDatabase } from "@/lib/mongodb";
import Event from "@/models/eventModel";
import { logActivity } from "../activitylog/addActivityLogController";

export async function DeleteEventController(
  id: string,
  currentUsername: string
) {
  try {
    await connectToDatabase();

    const res = await Event.findByIdAndDelete(id);

    await logActivity(
      currentUsername,
      `Event ${res.title} was removed`,
      "Delete",
      "Event"
    );
    return {
      message: "Data Deleted Successfully!",
      isSuccess: true,
      data: res,
    };
  } catch (error) {
    console.log(error);
  }
}
