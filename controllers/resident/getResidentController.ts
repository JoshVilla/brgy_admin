import { connectToDatabase } from "@/lib/mongodb";
import Resident from "@/models/residentModel";

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

  const skip = (page - 1) * limit;

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
    .sort({ createdAt: -1 })
    .lean();

  const total = await Resident.countDocuments(query);

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
