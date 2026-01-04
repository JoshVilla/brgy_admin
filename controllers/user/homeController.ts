import { connectToDatabase } from "@/lib/mongodb";
import Announcement from "@/models/announcementModel";
import Event from "@/models/eventModel";
import Settings from "@/models/settingsModel";
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

    const allEvents = await Event.find({}).sort({ datetime: 1 }).limit(20);

    const now = new Date();
    const upcomingEvents = allEvents
      .filter((event) => new Date(event.datetime) >= now)
      .slice(0, 3);

    //get  the request
    const settings = await Settings.findById("SYSTEM_SETTINGS");
    const request = settings.request;

    const cleanEventsData = upcomingEvents.map((event) => ({
      id: event._id.toString(),
      title: event.title,
      description: event.description,
      datetime: event.datetime,
      venue: event.venue,
    }));

    return {
      message: "Data fetched successfully",
      isSuccess: true,
      data: {
        announcement: cleanAnnouncementData,
        events: cleanEventsData,
        request,
      },
    };
  } catch (error) {
    console.log(error);
  }
}
