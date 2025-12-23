import { NextResponse, NextRequest } from "next/server";
import { DeleteAnnouncementController } from "@/controllers/announcement/deleteAnnouncement";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    const response = await DeleteAnnouncementController(id);

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
