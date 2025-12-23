import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/adminModel";

interface GetAdminParams {
  page?: number;
  limit?: number;
  filters?: Record<string, any>;
}

export async function GetAdminController({
  page = 1,
  limit = 10,
  filters = {},
}: GetAdminParams) {
  try {
    await connectToDatabase();

    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};

    // Allow partial, case-insensitive match on username
    if (filters.username) {
      query.username = { $regex: filters.username, $options: "i" };
    }

    const [admins, total] = await Promise.all([
      Admin.find(query).skip(skip).limit(limit),
      Admin.countDocuments(query),
    ]);

    return {
      data: admins,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      isSuccess: true,
    };
  } catch (error) {
    console.error("Error fetching admins with pagination:", error);
    throw new Error("Failed to fetch admins");
  }
}
