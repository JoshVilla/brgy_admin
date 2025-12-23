import { connectToDatabase } from "@/lib/mongodb";
import Event, { IEvent } from "@/models/eventModel";

export async function AddEventController(params: IEvent) {
  try {
    await connectToDatabase();

    const res = await Event.create(params);

    return {
      message: "Event Added Successfully",
      isSuccess: true,
      data: res,
    };
  } catch (error) {
    console.log(error);
  }
}
