import { NextResponse } from "next/server";
import { PopulationGraphController } from "@/controllers/graph/populationGraphController";
import { AgeGraphController } from "@/controllers/graph/ageGraphController";

export async function POST() {
  try {
    const population = await PopulationGraphController();
    const age = await AgeGraphController();

    const finalResponse = {
      population,
      age,
    };

    return NextResponse.json(finalResponse);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      {
        message: "Error fetching data. Try Again Later",
        isSuccess: false,
      },
      { status: 500 }
    );
  }
}
