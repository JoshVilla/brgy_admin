import { connectToDatabase } from "@/lib/mongodb";
import Resident from "@/models/residentModel";
import { calculateAge } from "@/utils/helpers";

export async function ResidentGraphController() {
  try {
    const allPuroks = ["Purok 1", "Purok 2", "Purok 3", "Purok 4"];
    await connectToDatabase();

    const residents = await Resident.find().lean();

    // -------------------
    // AGE GROUPS
    // -------------------
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

    // -------------------
    // SPECIAL CATEGORY COUNTS (Independent counts)
    // -------------------
    let seniors = 0;
    let pwd = 0;
    let seniorAndPwd = 0; // Track residents who are both
    let generalResidents = 0;

    residents.forEach((res) => {
      const age = calculateAge(res.birthdate);

      // Age groups
      if (age <= 6) ageGroups[0].count++;
      else if (age <= 12) ageGroups[1].count++;
      else if (age <= 18) ageGroups[2].count++;
      else if (age <= 25) ageGroups[3].count++;
      else if (age <= 35) ageGroups[4].count++;
      else if (age <= 50) ageGroups[5].count++;
      else if (age <= 65) ageGroups[6].count++;
      else ageGroups[7].count++;

      // Special categories - independent counts
      const isSenior =
        res.isSeniorCitizen === true || res.isSeniorCitizen === "true";
      const isPwd = res.isPwd === true || res.isPwd === "true";

      if (isSenior && isPwd) {
        seniors++;
        pwd++;
        seniorAndPwd++;
      } else if (isSenior) {
        seniors++;
      } else if (isPwd) {
        pwd++;
      } else {
        generalResidents++;
      }
    });

    const specialCategories = [
      { category: "Seniors", count: seniors },
      { category: "PWD", count: pwd },
      { category: "Senior & PWD", count: seniorAndPwd },
      { category: "General Residents", count: generalResidents },
    ];

    // -------------------
    // PUROK POPULATION
    // -------------------
    const populationByPurok: Record<string, number> = {};
    allPuroks.forEach((purok) => (populationByPurok[purok] = 0));

    residents.forEach((resident) => {
      const purok = resident.purok;
      if (purok && populationByPurok.hasOwnProperty(purok)) {
        populationByPurok[purok]++;
      }
    });

    const populationArray = allPuroks.map((purok) => ({
      location: purok,
      population: populationByPurok[purok],
    }));

    return {
      isSuccess: true,
      age: ageGroups,
      puroks: populationArray,
      status: specialCategories,
      summary: {
        totalResidents: residents.length,
        totalSeniors: seniors,
        totalPwd: pwd,
        seniorAndPwd: seniorAndPwd,
        generalResidents: generalResidents,
      },
    };
  } catch (error: any) {
    console.error(error);
    return {
      message: "An error occurred while fetching the residents.",
      data: null,
      isSuccess: false,
      error: error.message || "Unknown error",
    };
  }
}
