import { NextRequest, NextResponse } from "next/server";
import { GetLostAndFound } from "@/controllers/lostandfound/getLostAndFound";

export async function POST(request: NextRequest) {
    try {
        const { page = 1, limit = 10, ...filters } = await request.json();
        
        const result = await GetLostAndFound({ page, limit, filters });
        
        return NextResponse.json(result);
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            isSuccess: false,
            message: "Failed to fetch the data",
        });
    }
}