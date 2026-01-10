// app/api/legislative/route.ts
import { NextResponse, NextRequest } from "next/server";
import { GetLegislativeController } from "@/controllers/legislative/getLegislativeController";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Ensure filters exists even if empty
    const { page = 1, limit = 10, filters = {} } = body;

    const response = await GetLegislativeController({
      page,
      limit,
      filters,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Cannot fetch the legislatives",
      isSuccess: false,
    });
  }
}
