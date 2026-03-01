import { connectToDatabase } from "@/lib/mongodb";
import LostFound from "@/models/lostandfound";

export async function GetLostAndFound({page = 1, limit = 10, filters}: {page: number, limit: number, filters: Record<string, any>}) {
    try {
        await connectToDatabase();

        const payload: any = {}

         const skip = (page - 1) * limit;

        if(filters.type) {
            payload.type = filters.type;
        }

        if(filters.status) {
            payload.status = filters.status;
        }
        if(filters.dataFound) {
            payload.dataFound = filters.dataFound;
        }
        
        const lostAndFound = await LostFound.find(payload).skip(skip).limit(limit).sort({ createdAt: -1 });
        
        return {
            data: lostAndFound,
            message: "Lost and found retrieved successfully",
            isSuccess: true
        };
    } catch (error) {
        console.error("Error retrieving lost and found:", error);
        return {
            message: "Failed to retrieve lost and found",
            isSuccess: false
        };
    }
}