import { NextResponse, NextRequest } from "next/server";
import { GetLegislativesForResidentsController } from "@/controllers/user/getLegislatives";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await GetLegislativesForResidentsController(body);

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      isSuccess: false,
      message: "Failed to fetch legislatives",
    });
  }
}
