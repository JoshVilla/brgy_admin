import { NextResponse, NextRequest } from "next/server";
import { HomeController } from "@/controllers/user/homeController";

export async function POST() {
  try {
    const response = await HomeController();
    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "An error occurred while fetching data.",
      isSuccess: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
