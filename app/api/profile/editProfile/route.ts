import { NextRequest, NextResponse } from "next/server";
import { EditProfileController } from "@/controllers/profile/editProfileController";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log(body);
    const response = await EditProfileController(body);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error updating profile:", error);

    return NextResponse.json(
      {
        message: "Failed to update profile",
        isSuccess: false,
        error: error.message || "An error occurred while updating the profile",
      },
      { status: 500 }
    );
  }
}
