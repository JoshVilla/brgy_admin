import { connectToDatabase } from "@/lib/mongodb";
import Request from "@/models/requestModel";

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

  if (filters.status) query.status = filters.status;
  if (filters.type) query.type = filters.type;
  if (filters.userId) query.userId = filters.userId;

  if (filters.name) {
    query.name = { $regex: filters.name, $options: "i" }; // simple regex match on 'name' field
  }

  const requests = await Request.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Request.countDocuments(query);

  return {
    data: requests,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    isSuccess: true,
  };
}
