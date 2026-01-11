import { connectToDatabase } from "@/lib/mongodb";
import ActivityLog from "@/models/activityLogModel";

interface GetActivityLogsParams {
  page?: number;
  limit?: number;
  filters?: Record<string, any>;
}

export async function GetActivityLogsController({
  page = 1,
  limit = 20,
  filters = {},
}: GetActivityLogsParams = {}) {
  try {
    await connectToDatabase();

    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};

    // Allow partial, case-insensitive match on name
    if (filters.name) {
      query.name = { $regex: filters.name, $options: "i" };
    }

    // Allow partial, case-insensitive match on activity
    if (filters.activity) {
      query.activity = { $regex: filters.activity, $options: "i" };
    }

    // Date range filter
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) {
        query.createdAt.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.createdAt.$lte = new Date(filters.endDate);
      }
    }

    const [activities, total] = await Promise.all([
      ActivityLog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ActivityLog.countDocuments(query),
    ]);

    return {
      data: activities,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      isSuccess: true,
    };
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return {
      isSuccess: false,
      message: "Cannot fetch activity logs",
    };
  }
}
