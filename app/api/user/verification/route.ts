import { NextResponse, NextRequest } from "next/server";
import { UserVerificationController } from "@/controllers/user/verificationController";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body);
    if (!body || !body.id || !body.firstname || !body.lastname) {
      return NextResponse.json(
        {
          message:
            "Missing required fields: id, firstname, and lastname are required.",
          isSuccess: false,
        },
        { status: 400 }
      );
    }

    const response = await UserVerificationController(body);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("User Verification Error:", error);
    return NextResponse.json(
      {
        message: "There was a problem verifying your account. Try again later.",
        isSuccess: false,
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
