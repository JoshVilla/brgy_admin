import { NextResponse } from "next/server";
import { PopulationGraphController } from "@/controllers/graph/populationGraphController";

export async function POST() {
  try {
    const response = await PopulationGraphController();

    return NextResponse.json(response);
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
