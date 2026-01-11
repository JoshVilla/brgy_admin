import { connectToDatabase } from "@/lib/mongodb";
import Resident from "@/models/residentModel";
import { Types } from "mongoose"; // Add this import

// calculate age safely
const calculateAge = (birthDateStr?: string | Date): number | null => {
  if (!birthDateStr) return null;

  let birthDate: Date;

  if (typeof birthDateStr === "string") {
    // Attempt to parse manually: "February 14,2000"
    const match = birthDateStr.match(/([A-Za-z]+)\s+(\d+),\s*(\d{4})/);
    if (!match) return null;

    const [, monthStr, dayStr, yearStr] = match;
    const month = new Date(`${monthStr} 1, 2000`).getMonth(); // convert month name to number
    const day = parseInt(dayStr, 10);
    const year = parseInt(yearStr, 10);

    birthDate = new Date(year, month, day);
  } else {
    birthDate = new Date(birthDateStr);
  }

  if (isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
};

// add age to residents
const addAgeToResidents = <T extends { birthdate?: string | Date }>(
  residents: T[]
): (T & { age: number | null })[] => {
  return residents.map((resident) => ({
    ...resident,
    age: calculateAge(resident.birthdate),
  }));
};

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

  const query: Record<string, any> = {};

  // Convert _id string to ObjectId
  if (filters._id) {
    try {
      query._id = new Types.ObjectId(filters._id);
    } catch (error) {
      console.error("Invalid ObjectId:", filters._id);
      return {
        data: [],
        total: 0,
        currentPage: page,
        totalPages: 0,
        isSuccess: false,
        message: "Invalid ID format",
      };
    }
  }

  if (filters.gender) query.gender = filters.gender;
  if (filters.purok) query.purok = filters.purok;

  // Single name search - ALL words must match (each word in any field)
  if (filters.name) {
    const nameWords = filters.name.trim().split(/\s+/);

    // Each word must appear in at least one name field
    query.$and = nameWords.map((word: string) => {
      const wordRegex = new RegExp(word, "i");
      return {
        $or: [
          { firstname: wordRegex },
          { middlename: wordRegex },
          { lastname: wordRegex },
        ],
      };
    });
  }

  // Use aggregation to ensure unique results
  const pipeline: any[] = [
    { $match: query },
    { $sort: { createdAt: -1 } },
    // Group by _id to ensure uniqueness
    {
      $group: {
        _id: "$_id",
        doc: { $first: "$$ROOT" },
      },
    },
    { $replaceRoot: { newRoot: "$doc" } },
    { $sort: { createdAt: -1 } },
  ];

  // Get total unique count
  const countPipeline = [...pipeline, { $count: "total" }];
  const countResult = await Resident.aggregate(countPipeline);
  const total = countResult[0]?.total || 0;

  // Add pagination
  pipeline.push({ $skip: (page - 1) * limit }, { $limit: limit });

  const residents = await Resident.aggregate(pipeline);

  //@ts-ignore
  const newResidents = addAgeToResidents(residents);

  return {
    data: newResidents,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    isSuccess: true,
  };
}
