import { connectToDatabase } from "@/lib/mongodb";
import Event from "@/models/eventModel";

export async function GetEventController({
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

  // Apply optional filters here
  const query: Record<string, any> = {};
  if (filters.venue) query.venue = filters.venue;
  if (filters._id) query._id = filters._id;
  const residents = await Event.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Event.countDocuments(query);

  return {
    data: residents,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    isSuccess: true,
  };
}
