import { connectToDatabase } from "@/lib/mongodb";
import MonthlySummary from "@/models/monthlySummaryRequestModel";
import Request from "@/models/requestModel";

import { REQUEST_TYPE } from "@/utils/constant";

export async function CreateMonthlySummaryController() {
  try {
    await connectToDatabase();

    // Get the previous month (since this runs at the end of the month)
    const now = new Date();
    const year =
      now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    const month = now.getMonth() === 0 ? 11 : now.getMonth() - 1;

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

    // Check if summary already exists for this month
    const existingSummary = await MonthlySummary.findOne({
      year,
      month: month + 1, // Store as 1-12 instead of 0-11
    });

    if (existingSummary) {
      return {
        message: "Monthly summary already exists for this period.",
        data: existingSummary,
        isSuccess: false,
        error: "Duplicate summary",
      };
    }

    // Aggregate requests by type
    const requestStats = await Request.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    // Aggregate requests by status
    const statusStats = await Request.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get daily request counts
    const dailyStats = await Request.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get average processing time
    const processingTimeStats = await Request.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
          status: { $in: ["approved", "completed"] },
        },
      },
      {
        $project: {
          type: 1,
          processingTime: {
            $divide: [
              { $subtract: ["$updatedAt", "$createdAt"] },
              1000 * 60 * 60, // Convert to hours
            ],
          },
        },
      },
      {
        $group: {
          _id: "$type",
          avgProcessingTime: { $avg: "$processingTime" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Get verification stats
    const verificationStats = await Request.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: "$isVerified",
          count: { $sum: 1 },
        },
      },
    ]);

    // Format request type stats
    const formattedRequestStats = [
      {
        type: REQUEST_TYPE.BRGYCLEARANCE,
        typeName: "Barangay Certificate",
        count:
          requestStats.find((s) => s._id === REQUEST_TYPE.BRGYCLEARANCE)
            ?.count || 0,
      },
      {
        type: REQUEST_TYPE.BRGYINDIGENCY,
        typeName: "Barangay Indigency",
        count:
          requestStats.find((s) => s._id === REQUEST_TYPE.BRGYINDIGENCY)
            ?.count || 0,
      },
      {
        type: REQUEST_TYPE.BRGYCEDULA,
        typeName: "Barangay Cedula",
        count:
          requestStats.find((s) => s._id === REQUEST_TYPE.BRGYCEDULA)?.count ||
          0,
      },
    ];

    // Format status stats
    const formattedStatusStats = [
      "pending",
      "processing",
      "approved",
      "rejected",
      "cancelled",
    ].map((status) => ({
      status,
      statusName: status.charAt(0).toUpperCase() + status.slice(1),
      count: statusStats.find((s) => s._id === status)?.count || 0,
    }));

    // Format processing time stats
    const formattedProcessingTime = [
      {
        type: REQUEST_TYPE.BRGYCLEARANCE,
        typeName: "Barangay Certificate",
        avgProcessingTime:
          Math.round(
            (processingTimeStats.find(
              (s) => s._id === REQUEST_TYPE.BRGYCLEARANCE
            )?.avgProcessingTime || 0) * 10
          ) / 10,
        completedCount:
          processingTimeStats.find((s) => s._id === REQUEST_TYPE.BRGYCLEARANCE)
            ?.count || 0,
      },
      {
        type: REQUEST_TYPE.BRGYINDIGENCY,
        typeName: "Barangay Indigency",
        avgProcessingTime:
          Math.round(
            (processingTimeStats.find(
              (s) => s._id === REQUEST_TYPE.BRGYINDIGENCY
            )?.avgProcessingTime || 0) * 10
          ) / 10,
        completedCount:
          processingTimeStats.find((s) => s._id === REQUEST_TYPE.BRGYINDIGENCY)
            ?.count || 0,
      },
      {
        type: REQUEST_TYPE.BRGYCEDULA,
        typeName: "Barangay Cedula",
        avgProcessingTime:
          Math.round(
            (processingTimeStats.find((s) => s._id === REQUEST_TYPE.BRGYCEDULA)
              ?.avgProcessingTime || 0) * 10
          ) / 10,
        completedCount:
          processingTimeStats.find((s) => s._id === REQUEST_TYPE.BRGYCEDULA)
            ?.count || 0,
      },
    ];

    // Format verification stats
    const verifiedCount =
      verificationStats.find((s) => s._id === true)?.count || 0;
    const unverifiedCount =
      verificationStats.find((s) => s._id === false)?.count || 0;

    // Calculate totals
    const totalRequests = formattedRequestStats.reduce(
      (sum, stat) => sum + stat.count,
      0
    );

    // Calculate success rate (approved / total)
    const approvedCount =
      formattedStatusStats.find((s) => s.status === "approved")?.count || 0;
    const successRate =
      totalRequests > 0 ? (approvedCount / totalRequests) * 100 : 0;

    // Calculate average processing time across all types
    const totalProcessingTime = formattedProcessingTime.reduce(
      (sum, stat) => sum + stat.avgProcessingTime * stat.completedCount,
      0
    );
    const totalCompleted = formattedProcessingTime.reduce(
      (sum, stat) => sum + stat.completedCount,
      0
    );
    const avgProcessingTime =
      totalCompleted > 0
        ? Math.round((totalProcessingTime / totalCompleted) * 10) / 10
        : 0;

    // Find peak day (day with most requests)
    const peakDay =
      dailyStats.length > 0
        ? dailyStats.reduce(
            (max, day) => (day.count > max.count ? day : max),
            dailyStats[0]
          )
        : { _id: "N/A", count: 0 };

    // Create summary document
    const summaryData = {
      year,
      month: month + 1, // Store as 1-12
      monthName: new Date(year, month).toLocaleString("default", {
        month: "long",
      }),
      startDate: startOfMonth,
      endDate: endOfMonth,

      // Request type breakdown
      requestTypeStats: formattedRequestStats,

      // Status breakdown
      statusStats: formattedStatusStats,

      // Daily breakdown
      dailyStats: dailyStats.map((stat) => ({
        date: stat._id,
        count: stat.count,
      })),

      // Processing time
      processingTimeStats: formattedProcessingTime,

      // Verification
      verificationStats: {
        verified: verifiedCount,
        unverified: unverifiedCount,
        total: verifiedCount + unverifiedCount,
        verificationRate:
          verifiedCount + unverifiedCount > 0
            ? Math.round(
                (verifiedCount / (verifiedCount + unverifiedCount)) * 100 * 10
              ) / 10
            : 0,
      },

      // Summary metrics
      summary: {
        totalRequests,
        successRate: Math.round(successRate * 10) / 10,
        avgProcessingTime,
        peakDay: peakDay._id,
        peakDayCount: peakDay.count,
        pendingCount:
          formattedStatusStats.find((s) => s.status === "pending")?.count || 0,
        processingCount:
          formattedStatusStats.find((s) => s.status === "processing")?.count ||
          0,
        approvedCount,
        rejectedCount:
          formattedStatusStats.find((s) => s.status === "rejected")?.count || 0,
        cancelledCount:
          formattedStatusStats.find((s) => s.status === "cancelled")?.count ||
          0,
      },

      createdAt: new Date(),
    };

    // Save to database
    const monthlySummary = await MonthlySummary.create(summaryData);

    return {
      message: `Monthly summary created successfully for ${summaryData.monthName} ${year}.`,
      data: monthlySummary,
      isSuccess: true,
      error: null,
    };
  } catch (error: any) {
    console.error("Error creating monthly summary:", error);
    return {
      message: "An error occurred while creating the monthly summary.",
      data: null,
      isSuccess: false,
      error: error.message || "Unknown error",
    };
  }
}
