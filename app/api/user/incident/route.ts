import { NextRequest, NextResponse } from "next/server";
import { GetIncidentReportController } from "@/controllers/incident/getIncidentReport";

export async function POST(req: NextRequest) {
  try {
    const { page = 1, limit = 10, ...filters } = await req.json();

    const response = await GetIncidentReportController({
      page,
      limit,
      filters,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      isSuccess: false,
      message: "Failed to fetch the data",
    });
  }
}
