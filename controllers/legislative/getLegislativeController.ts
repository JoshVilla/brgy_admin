import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Legislative from "@/models/legislativeModel";

export async function GetLegislativeController({
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
  if (filters._id) {
    // Convert string to ObjectId
    query._id = new mongoose.Types.ObjectId(filters._id);
  }
  if (filters.status) query.status = filters.status;
  if (filters.legislativeType) query.legislativeType = filters.legislativeType;
  if (filters.category) query.category = filters.category;
  if (filters.title) query.title = { $regex: filters.title, $options: "i" };
  if (filters.orderNumber)
    query.orderNumber = { $regex: filters.orderNumber, $options: "i" };

  // Fetch legislative documents
  const legislatives = await Legislative.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();

  const total = await Legislative.countDocuments(query);

  return {
    data: legislatives,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    isSuccess: true,
  };
}
