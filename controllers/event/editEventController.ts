import { connectToDatabase } from "@/lib/mongodb";
import Event from "@/models/eventModel";
import { IResEvent } from "@/utils/types";

export async function EditEventController(params: IResEvent) {
  try {
    await connectToDatabase();

    const { _id, title, venue, datetime, description } = params;

    const updatedEvent = await Event.findByIdAndUpdate(
      _id,
      {
        title,
        venue,
        datetime,
        description,
      },
      { new: true }
    );

    return {
      message: "Event updated successfully.",
      data: updatedEvent,
      isSuccess: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "An error occurred while updating the event.",
      data: null,
      isSuccess: false,
      error: error.message || "Unknown error",
    };
  }
}
