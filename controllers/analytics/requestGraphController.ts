import { connectToDatabase } from "@/lib/mongodb";
import Request from "@/models/requestModel";
import { REQUEST_TYPE } from "@/utils/constant"; // adjust path as needed

export async function RequestGraphController() {
  try {
    await connectToDatabase();

    // Get the start and end of the current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    // Aggregate requests by type for the current month
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
      {
        $sort: { _id: 1 },
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
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get daily request counts for trend analysis
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

    // Get average processing time (for completed requests)
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

    // Format the request type stats with readable type names
    const formattedStats = requestStats.map((stat) => {
      let typeName = "Unknown";

      switch (stat._id) {
        case REQUEST_TYPE.BRGYCERT:
          typeName = "Barangay Certificate";
          break;
        case REQUEST_TYPE.BRGYINDIGENCY:
          typeName = "Barangay Indigency";
          break;
        case REQUEST_TYPE.BRGYCEDULA:
          typeName = "Barangay Cedula";
          break;
      }

      return {
        type: stat._id,
        typeName,
        count: stat.count,
      };
    });

    // Ensure all types are represented (even if count is 0)
    const allTypes = [
      { type: REQUEST_TYPE.BRGYCERT, typeName: "Barangay Certificate" },
      { type: REQUEST_TYPE.BRGYINDIGENCY, typeName: "Barangay Indigency" },
      { type: REQUEST_TYPE.BRGYCEDULA, typeName: "Barangay Cedula" },
    ];

    const completeStats = allTypes.map((typeInfo) => {
      const found = formattedStats.find((stat) => stat.type === typeInfo.type);
      return found || { ...typeInfo, count: 0 };
    });

    // Format status stats
    const formattedStatusStats = statusStats.map((stat) => ({
      status: stat._id,
      statusName: stat._id.charAt(0).toUpperCase() + stat._id.slice(1),
      count: stat.count,
    }));

    // Ensure all statuses are represented
    const allStatuses = [
      "pending",
      "processing",
      "approved",
      "rejected",
      "cancelled",
    ];
    const completeStatusStats = allStatuses.map((status) => {
      const found = formattedStatusStats.find((stat) => stat.status === status);
      return (
        found || {
          status,
          statusName: status.charAt(0).toUpperCase() + status.slice(1),
          count: 0,
        }
      );
    });

    // Format daily stats
    const formattedDailyStats = dailyStats.map((stat) => ({
      date: stat._id,
      count: stat.count,
    }));

    // Format processing time stats
    const formattedProcessingTime = allTypes.map((typeInfo) => {
      const found = processingTimeStats.find(
        (stat) => stat._id === typeInfo.type
      );
      return {
        type: typeInfo.type,
        typeName: typeInfo.typeName,
        avgProcessingTime: found
          ? Math.round(found.avgProcessingTime * 10) / 10
          : 0,
        completedCount: found ? found.count : 0,
      };
    });

    // Format verification stats
    const verifiedCount =
      verificationStats.find((s) => s._id === true)?.count || 0;
    const unverifiedCount =
      verificationStats.find((s) => s._id === false)?.count || 0;

    const total = completeStats.reduce((sum, stat) => sum + stat.count, 0);

    return {
      message: "Request analytics fetched successfully.",
      data: {
        month: now.toLocaleString("default", {
          month: "long",
          year: "numeric",
        }),
        stats: completeStats,
        statusStats: completeStatusStats,
        dailyStats: formattedDailyStats,
        processingTimeStats: formattedProcessingTime,
        verificationStats: {
          verified: verifiedCount,
          unverified: unverifiedCount,
          total: verifiedCount + unverifiedCount,
        },
        total,
      },
      isSuccess: true,
      error: null,
    };
  } catch (error: any) {
    console.error(error);
    return {
      message: "An error occurred while fetching the request analytics.",
      data: null,
      isSuccess: false,
      error: error.message || "Unknown error",
    };
  }
}
