// controllers/blotter/getBlotterController.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Blotter from "@/models/blotterModel";

interface GetBlottersBody {
  id?: string;
  status?: string;
  incidentType?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

// GET all blotters with filters and pagination for table display
export async function GetAllBlotters(body: GetBlottersBody) {
  try {
    await connectToDatabase();

    // Extract filters from body
    const {
      id,
      status,
      incidentType,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = body;

    // Pagination with defaults
    const page = body.page || 1;
    const limit = body.limit || 10;

    // Build query
    const query: any = {};

    // Status filter
    if (status) {
      query.status = status;
    }

    // Incident type filter
    if (incidentType) {
      query.incidentType = incidentType;
    }

    if (id) {
      query._id = id;
    }

    // Search across multiple fields
    if (search) {
      query.$or = [
        { blotterNo: { $regex: search, $options: "i" } },
        { complainantName: { $regex: search, $options: "i" } },
        { respondentName: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Sort order
    const sort = sortOrder === "asc" ? 1 : -1;

    // Execute query
    const [blotters, total] = await Promise.all([
      Blotter.find(query)
        .sort({ [sortBy]: sort })
        .skip(skip)
        .limit(limit)
        .lean(),
      Blotter.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: blotters,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching blotters:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blotter entries" },
      { status: 500 }
    );
  }
}
