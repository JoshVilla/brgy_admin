import { connectToDatabase } from "@/lib/mongodb";
import Event, { IEvent } from "@/models/eventModel";
import { logActivity } from "../activitylog/addActivityLogController";

export async function AddEventController(
  params: IEvent,
  currentUsername: string
) {
  try {
    await connectToDatabase();

    const res = await Event.create(params);

    await logActivity(
      currentUsername,
      `Added new event ${params.title}`,
      "Add",
      "Event"
    );
    return {
      message: "Event Added Successfully",
      isSuccess: true,
      data: res,
    };
  } catch (error) {
    console.log(error);
  }
}
