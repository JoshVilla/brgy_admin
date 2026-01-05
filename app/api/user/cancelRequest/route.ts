// API Route
import { NextResponse, NextRequest } from "next/server";
import { CancelRequestController } from "@/controllers/user/cancelRequestController";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { _id, status } = body;

    // Validate required fields
    if (!_id || !status) {
      return NextResponse.json(
        {
          isSuccess: false,
          message: "Missing required fields: _id, status",
        },
        { status: 400 }
      );
    }

    const result = await CancelRequestController({
      _id,
      status,
    });

    if (!result.isSuccess) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Cancel request error:", error);
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Failed to cancel request",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
