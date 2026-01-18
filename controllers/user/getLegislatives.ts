import { connectToDatabase } from "@/lib/mongodb";
import Legislative from "@/models/legislativeModel";

interface GetLegislativesParams {
  legislativeType?: string;
}

export async function GetLegislativesForResidentsController({
  legislativeType,
}: GetLegislativesParams) {
  try {
    await connectToDatabase();

    const query: any = {};
    if (legislativeType) query.legislativeType = legislativeType;

    const legislativeData = await Legislative.find(query).sort({
      createdAt: -1,
    });

    return {
      isSuccess: true,
      data: legislativeData,
    };
  } catch (error) {
    console.error("Error fetching legislatives:", error);
    return {
      isSuccess: false,
      message: "Failed to fetch legislatives",
      data: [],
    };
  }
}
