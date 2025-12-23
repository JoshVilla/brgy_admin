import { NextResponse, NextRequest } from "next/server";
import { EditAnnouncementController } from "@/controllers/announcement/editAnnouncementController";

export async function POST(req: NextRequest) {
  try {
    const params = await req.json();
    const response = await EditAnnouncementController(params);

    return NextResponse.json(response);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({
      message: "Operation Unsuccessful",
      isSuccess: false,
      error: error.message,
    });
  }
}
