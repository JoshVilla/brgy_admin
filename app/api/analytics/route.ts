import { NextResponse, NextRequest } from "next/server";
import { ResidentGraphController } from "@/controllers/analytics/residentGraphController";
import { RequestGraphController } from "@/controllers/analytics/requestGraphController";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type } = body;

    // Validate type parameter
    if (!type || (type !== 1 && type !== 2)) {
      return NextResponse.json(
        {
          message:
            "Invalid type parameter. Must be 1 (resident) or 2 (request).",
          data: null,
          isSuccess: false,
          error: "Invalid type parameter",
        },
        { status: 400 }
      );
    }

    // Call the appropriate controller based on type
    const response =
      type === 1
        ? await ResidentGraphController()
        : await RequestGraphController();

    // Return with appropriate status code based on response
    const statusCode = response.isSuccess ? 200 : 500;

    return NextResponse.json(response, { status: statusCode });
  } catch (error: any) {
    console.error("Analytics API Error:", error);
    return NextResponse.json(
      {
        message: "An error occurred while fetching the data.",
        data: null,
        isSuccess: false,
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
