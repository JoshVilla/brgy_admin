import { connectToDatabase } from "@/lib/mongodb";
import IncidentReport from "@/models/incidentModel";

export async function GetIncidentReportController({
  page = 1,
  limit = 10,
  filters,
}: {
  page: number;
  limit: number;
  filters: Record<string, any>;
}) {
  try {
    await connectToDatabase();

    const skip = (page - 1) * limit;

    // Apply optional filters
    const query: Record<string, any> = {};
    if (filters._id) query._id = filters._id;
    if (filters.status) query.status = filters.status;
    if (filters.incidentType) query.incidentType = filters.incidentType;
    if (filters.residentId) query.residentId = filters.residentId;

    const incidentData = await IncidentReport.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await IncidentReport.countDocuments(query);

    return {
      data: incidentData,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      isSuccess: true,
    };
  } catch (error) {
    console.error("Error in GetIncidentReportController:", error);
    throw error;
  }
}
