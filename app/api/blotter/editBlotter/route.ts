// app/api/blotter/update/route.ts
import { NextRequest, NextResponse } from "next/server";
import { UpdateBlotter } from "@/controllers/blotter/updateBlotterController";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { blotterId, ...data } = body;

    // Pass id and data as separate arguments to controller
    const response = await UpdateBlotter(blotterId, data);

    const status = response.status || (response.isSuccess ? 200 : 500);
    return NextResponse.json(response, { status });
  } catch (error) {
    console.error("Error in POST update blotter:", error);
    return NextResponse.json(
      { isSuccess: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
