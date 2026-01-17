import { NextResponse, NextRequest } from "next/server";
import { EditIncidentReportController } from "@/controllers/incident/editIncidentController";

export async function POST(req: NextRequest) {
  try {
    const { _id, status } = await req.json();

    const response = await EditIncidentReportController({ _id, status });

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      isSuccess: false,
      message: "Failed to update the status",
    });
  }
}
