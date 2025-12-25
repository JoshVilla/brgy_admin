import { connectToDatabase } from "@/lib/mongodb";
import Resident from "@/models/residentModel";
import { calculateAge } from "@/utils/helpers";

export async function AgeGraphController() {
  await connectToDatabase();

  const residents = await Resident.find().lean();

  const ageGroups = [
    { range: "0-6", count: 0 },
    { range: "7-12", count: 0 },
    { range: "13-18", count: 0 },
    { range: "19-25", count: 0 },
    { range: "26-35", count: 0 },
    { range: "36-50", count: 0 },
    { range: "51-65", count: 0 },
    { range: "66+", count: 0 },
  ];

  residents.forEach((res) => {
    const age = calculateAge(res.birthdate);
    if (age <= 6) ageGroups[0].count++;
    else if (age <= 12) ageGroups[1].count++;
    else if (age <= 18) ageGroups[2].count++;
    else if (age <= 25) ageGroups[3].count++;
    else if (age <= 35) ageGroups[4].count++;
    else if (age <= 50) ageGroups[5].count++;
    else if (age <= 65) ageGroups[6].count++;
    else ageGroups[7].count++;
  });

  return ageGroups;
}
