import { connectToDatabase } from "@/lib/mongodb";
import Resident from "@/models/residentModel";
import Request from "@/models/requestModel";
import Admin from "@/models/adminModel";
import Event from "@/models/eventModel";

export async function GetTotalCountsController() {
  try {
    await connectToDatabase();

    // 🇵🇭 Get current PH time (UTC+8)
    const phNow = new Date();
    const phOffset = 8 * 60; // PH is UTC+8
    const utcTime = phNow.getTime() + phNow.getTimezoneOffset() * 60000;
    const phTime = new Date(utcTime + phOffset * 60000);

    // 📅 Start & end of today in PH time
    const startOfToday = new Date(phTime);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(phTime);
    endOfToday.setHours(23, 59, 59, 999);

    // 📅 Start of tomorrow in PH time
    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    // 📅 Start of month & next month for monthly request counts
    const startOfMonth = new Date(phTime.getFullYear(), phTime.getMonth(), 1);
    const startOfNextMonth = new Date(
      phTime.getFullYear(),
      phTime.getMonth() + 1,
      1
    );

    // 🔹 Run independent queries in parallel
    const [totalResidents, totalAdmins, totalRequestsThisMonth, allEvents] =
      await Promise.all([
        Resident.countDocuments(),
        Admin.countDocuments(),
        Request.countDocuments({
          createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
        }),
        // Get all events and filter in JavaScript since datetime is stored as string
        Event.find().sort({ datetime: 1 }),
      ]);

    // Filter events happening today and sort by datetime (earliest first)
    const currentEvents = allEvents
      .filter((event) => {
        const eventDate = new Date(event.datetime);
        return eventDate >= startOfToday && eventDate <= endOfToday;
      })
      .sort((a, b) => {
        return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
      });

    // Find next event on or after tomorrow (next day onwards)
    const nextEvent = allEvents.find((event) => {
      const eventDate = new Date(event.datetime);
      return eventDate >= startOfTomorrow;
    });

    const requests = await Request.find({ status: "pending" })
      .limit(20)
      .sort({ createdAt: -1 })
      .populate("resident")
      .lean();

    return {
      totals: {
        totalResidents,
        totalAdmins,
        totalRequestsThisMonth,
      },
      events: {
        currentEvents, // array with earliest event first (today only)
        nextEvent: nextEvent || null, // earliest event from tomorrow onwards
      },
      requests,
    };
  } catch (error) {
    console.error("GetTotalCountsController error:", error);
    throw new Error("Failed to get total counts");
  }
}
