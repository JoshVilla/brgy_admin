import { AddIncidentReportController } from "@/controllers/user/addIncidentReportController";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formdata = await req.formData();

    const response = await AddIncidentReportController(formdata);

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      isSuccess: false,
      message: "Failed to add report",
    });
  }
}
