import { NextResponse, NextRequest } from "next/server";
import { AddAnnouncementController } from "@/controllers/announcement/addAnnouncement";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await AddAnnouncementController(body);

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
