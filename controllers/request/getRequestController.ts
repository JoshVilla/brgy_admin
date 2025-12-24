import { connectToDatabase } from "@/lib/mongodb";
import Request from "@/models/requestModel";
import Resident from "@/models/residentModel";

export async function GetRequestController({
  page = 1,
  limit = 10,
  filters,
}: {
  page: number;
  limit: number;
  filters: Record<string, any>;
}) {
  await connectToDatabase();

  const skip = (page - 1) * limit;
  const query: Record<string, any> = {};

  // Apply filters
  if (filters.status) query.status = filters.status;
  if (filters.type) query.type = filters.type;
  if (filters.userId) query.userId = filters.userId;
  if (filters.name) query.name = { $regex: filters.name, $options: "i" };

  // Fetch requests with populated resident data (all fields)
  const requests = await Request.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate({
      path: "userId",
      model: "Resident",
      // Remove the select to get all fields
    })
    .lean();

  // Transform the data to have a clearer structure
  const dataWithResident = requests.map((req: any) => {
    const resident =
      req.userId && typeof req.userId === "object" ? req.userId : null;

    return {
      ...req,
      userId: resident?._id || req.userId, // Keep the original ID reference
      resident: resident,
    };
  });

  const total = await Request.countDocuments(query);

  return {
    data: dataWithResident,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    isSuccess: true,
  };
}
