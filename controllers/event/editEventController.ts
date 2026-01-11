import { connectToDatabase } from "@/lib/mongodb";
import Event from "@/models/eventModel";
import { IResEvent } from "@/utils/types";
import { logActivity } from "../activitylog/addActivityLogController";

export async function EditEventController(
  params: IResEvent,
  currentUsername: string
) {
  try {
    await connectToDatabase();

    const { _id, title, venue, datetime, description } = params;

    // Get existing event BEFORE updating
    const existingEvent = await Event.findById(_id);

    if (!existingEvent) {
      return {
        message: "Event not found",
        data: null,
        isSuccess: false,
      };
    }

    // Detect what changed
    const changes: string[] = [];

    if (existingEvent.title !== title) {
      changes.push(`title from "${existingEvent.title}" to "${title}"`);
    }
    if (existingEvent.venue !== venue) {
      changes.push(`venue from "${existingEvent.venue}" to "${venue}"`);
    }
    if (existingEvent.datetime?.toString() !== datetime?.toString()) {
      changes.push(`date/time`);
    }
    if (existingEvent.description !== description) {
      changes.push(`description`);
    }

    // Update the event
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

    // Log activity with changes
    const changesText =
      changes.length > 0
        ? `Updated event: ${title} - Changed ${changes.join(", ")}`
        : `Updated event: ${title}`;

    await logActivity(currentUsername, changesText, "Edit", "Event");

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
