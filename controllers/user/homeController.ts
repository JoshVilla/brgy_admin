import { connectToDatabase } from "@/lib/mongodb";
import Announcement from "@/models/announcementModel";
import Event from "@/models/eventModel";
import { formatReadableDateTime } from "@/utils/backendhelpers";

export async function HomeController() {
  try {
    await connectToDatabase();

    const announcement = await Announcement.findOne({
      isViewed: true,
    });

    const cleanAnnouncementData = announcement
      ? {
          id: announcement._id,
          announcement: announcement.announcement,
          createdAt: formatReadableDateTime(announcement.createdAt, true),
        }
      : null;

    const events = await Event.find({}).sort({ date: -1 }).limit(5);
    const cleanEventsData = events.map((event) => ({
      id: event._id,
      title: event.title,
      description: event.description,
      date: formatReadableDateTime(event.datetime),
      venue: event.venue,
    }));

    return {
      message: "Data fetched successfully",
      isSuccess: true,
      data: {
        announcement: cleanAnnouncementData,
        events: cleanEventsData,
      },
    };
  } catch (error) {
    console.log(error);
  }
}
