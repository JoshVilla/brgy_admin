import { connectToDatabase } from "@/lib/mongodb";
import Announcement from "@/models/announcementModel";

export async function GetAnnouncementController({
  page = 1,
  limit = 10,
  filters,
}: {
  page: number;
  limit: number;
  filters: Record<string, any>;
}) {
  try {
    await connectToDatabase();

    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};
    if (filters._id) query._id = filters._id;
    const announcements = await Announcement.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await Announcement.countDocuments();

    return {
      isSuccess: true,
      data: announcements,
      currentPage: page,
      total,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return {
      isSuccess: false,
      message: "Failed to fetch announcements.",
    };
  }
}
