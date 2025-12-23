import { connectToDatabase } from "@/lib/mongodb";
import Event from "@/models/eventModel";

export async function DeleteEventController(id: string) {
  try {
    await connectToDatabase();

    const res = await Event.findByIdAndDelete(id);

    return {
      message: "Data Deleted Successfully!",
      isSuccess: true,
      data: res,
    };
  } catch (error) {
    console.log(error);
  }
}
