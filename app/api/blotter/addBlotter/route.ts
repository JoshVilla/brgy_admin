import { NextResponse, NextRequest } from "next/server";
import { AddBlotter } from "@/controllers/blotter/addBlotterController";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Use .json() instead of .body()
    const response = await AddBlotter(body); // Pass body to controller

    if (response.isSuccess) {
      return NextResponse.json(response, { status: 201 });
    } else {
      return NextResponse.json(response, { status: 500 });
    }
  } catch (error) {
    console.error("Error in POST /api/blotter:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
