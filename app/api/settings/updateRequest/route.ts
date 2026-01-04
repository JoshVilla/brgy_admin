import { NextResponse, NextRequest } from "next/server";
import { UpdateRequestSettingsController } from "@/controllers/settings/updateRequestController";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { request: requestData } = body;

    if (!requestData) {
      return NextResponse.json(
        {
          isSuccess: false,
          message: "Request data is required",
        },
        { status: 400 }
      );
    }

    const response = await UpdateRequestSettingsController(requestData);

    if (!response.isSuccess) {
      return NextResponse.json(response, { status: 400 });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("Error in POST /api/settings/updateRequest:", error);
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
