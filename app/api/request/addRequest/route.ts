import { AddRequestController } from "@/controllers/request/addRequestController";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse form data from the incoming request
    const formData = await req.formData();

    // Call the controller to process the form data
    const response = await AddRequestController(formData);

    // Return a JSON response
    return NextResponse.json(response);
  } catch (error) {
    console.error("POST /api/request Error:", error);

    return NextResponse.json(
      {
        isSuccess: false,
        message: "An error occurred while processing your request.",
      },
      { status: 500 }
    );
  }
}
