import { GetAnnouncementController } from "@/controllers/announcement/getAnnouncementController";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { page = 1, limit = 5, ...filters } = await req.json();

    const response = await GetAnnouncementController({ page, limit, filters });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      {
        message: "Error fetching data. Try Again Later",
        isSuccess: false,
      },
      { status: 500 }
    );
  }
}
