import { NextRequest, NextResponse } from "next/server";
import { GetPrivilageController } from "@/controllers/privilage/getPrivilageController";

export async function POST(req: NextRequest) {
  try {
    const { adminId } = await req.json();

    const response = await GetPrivilageController({ adminId });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json({
      isSuccess: false,
      message: "An error occurred while fetching privilages.",
    });
  }
}
