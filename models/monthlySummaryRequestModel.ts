// @/models/monthlySummaryModel.ts
import mongoose from "mongoose";

const MonthlySummarySchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    monthName: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    requestTypeStats: [
      {
        type: {
          type: Number,
          required: true,
        },
        typeName: {
          type: String,
          required: true,
        },
        count: {
          type: Number,
          required: true,
        },
      },
    ],
    statusStats: [
      {
        status: {
          type: String,
          required: true,
        },
        statusName: {
          type: String,
          required: true,
        },
        count: {
          type: Number,
          required: true,
        },
      },
    ],
    dailyStats: [
      {
        date: {
          type: String,
          required: true,
        },
        count: {
          type: Number,
          required: true,
        },
      },
    ],
    processingTimeStats: [
      {
        type: {
          type: Number,
          required: true,
        },
        typeName: {
          type: String,
          required: true,
        },
        avgProcessingTime: {
          type: Number,
          required: true,
        },
        completedCount: {
          type: Number,
          required: true,
        },
      },
    ],
    verificationStats: {
      verified: {
        type: Number,
        required: true,
      },
      unverified: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
      verificationRate: {
        type: Number,
        required: true,
      },
    },
    summary: {
      totalRequests: {
        type: Number,
        required: true,
      },
      successRate: {
        type: Number,
        required: true,
      },
      avgProcessingTime: {
        type: Number,
        required: true,
      },
      peakDay: {
        type: String,
        required: true,
      },
      peakDayCount: {
        type: Number,
        required: true,
      },
      pendingCount: {
        type: Number,
        required: true,
      },
      processingCount: {
        type: Number,
        required: true,
      },
      approvedCount: {
        type: Number,
        required: true,
      },
      rejectedCount: {
        type: Number,
        required: true,
      },
      cancelledCount: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index to prevent duplicate summaries
MonthlySummarySchema.index({ year: 1, month: 1 }, { unique: true });

const MonthlySummary =
  mongoose.models.MonthlySummary ||
  mongoose.model("MonthlySummary", MonthlySummarySchema);

export default MonthlySummary;
