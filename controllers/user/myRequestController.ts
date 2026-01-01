import { connectToDatabase } from "@/lib/mongodb";
import Request from "@/models/requestModel";

// Optimized for mobile "Load More" / Infinite Scroll
export async function MyRequestController({
  userId,
  page = 1,
  limit = 10,
}: {
  userId: string;
  page: number;
  limit: number;
}) {
  try {
    await connectToDatabase();

    // Ensure userId is a string and trim whitespace
    const userIdString = userId;
    const skip = (page - 1) * limit;

    console.log("Querying with userId:", userIdString);
    console.log("Page:", page, "Limit:", limit, "Skip:", skip);

    const requests = await Request.find({ userAppId: userIdString })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    console.log("Found requests:", requests.length);

    const totalRequests = await Request.countDocuments({
      userId: userIdString,
    });
    console.log("Total requests:", totalRequests);

    const hasMore = skip + requests.length < totalRequests;

    return {
      success: true,
      data: requests,
      hasMore,
      currentPage: page,
      totalRequests,
    };
  } catch (error) {
    console.error("Error fetching requests:", error);
    return {
      success: false,
      data: [],
      hasMore: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch requests",
    };
  }
}
