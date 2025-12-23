import { connectToDatabase } from "@/lib/mongodb";
import Resident from "@/models/residentModel";

export async function ResidentController({
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
  if (filters._id) query._id = filters._id;
  if (filters.gender) query.gender = filters.gender;
  if (filters.purok) query.purok = filters.purok;
  if (filters.firstname) query.firstname = filters.firstname;
  if (filters.middlename) query.middlename = filters.middlename;
  if (filters.lastname) query.lastname = filters.lastname;

  const residents = await Resident.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Resident.countDocuments(query);

  return {
    data: residents,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    isSuccess: true,
  };
}
