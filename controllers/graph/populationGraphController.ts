import { connectToDatabase } from "@/lib/mongodb";
import Resident from "@/models/residentModel";

export async function PopulationGraphController() {
  try {
    await connectToDatabase();

    // Define all puroks
    const allPuroks = ["Purok 1", "Purok 2", "Purok 3", "Purok 4"];

    // Fetch residents with only the purok field
    const residents = await Resident.find({}, { purok: 1 }).lean();

    // Count population per purok
    const populationByPurok: Record<string, number> = {};

    // Initialize all puroks to 0
    allPuroks.forEach((purok) => (populationByPurok[purok] = 0));

    // Count actual residents
    residents.forEach((resident) => {
      const purok = resident.purok;
      if (purok && populationByPurok.hasOwnProperty(purok)) {
        populationByPurok[purok]++;
      }
    });

    // Convert to array of objects
    const populationArray = allPuroks.map((purok) => ({
      location: purok,
      population: populationByPurok[purok],
    }));

    return populationArray;
  } catch (error: any) {
    console.error(error);
    return {
      message: "An error occurred while fetching the population.",
      data: null,
      isSuccess: false,
      error: error.message || "Unknown error",
    };
  }
}
