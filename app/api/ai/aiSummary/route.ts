import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const summaryData = await req.json();

    // Build the prompt on the backend
    const prompt = `You are an analytics assistant for a Barangay (Filipino local government unit) management system.

Analyze the following monthly report data and provide a clear, professional executive summary in 4-6 sentences suitable for barangay officials. Focus on:
1. Overall activity level and key metrics
2. Request distribution patterns
3. Processing efficiency and success rate
4. Notable trends or concerns

Data for ${summaryData.monthName} ${summaryData.year}:

**Overall Performance:**
- Total Requests: ${summaryData.summary.totalRequests}
- Success Rate: ${summaryData.summary.successRate}%
- Average Processing Time: ${summaryData.summary.avgProcessingTime} hours
- Peak Day: ${summaryData.summary.peakDay} (${
      summaryData.summary.peakDayCount
    } requests)

**Request Status:**
- Pending: ${summaryData.summary.pendingCount}
- Processing: ${summaryData.summary.processingCount}
- Approved: ${summaryData.summary.approvedCount}
- Rejected: ${summaryData.summary.rejectedCount}
- Cancelled: ${summaryData.summary.cancelledCount}

**Request Types:**
${summaryData.requestTypeStats
  .map((rt: any) => `- ${rt.typeName}: ${rt.count} requests`)
  .join("\n")}

**Verification Stats:**
- Total Residents: ${summaryData.verificationStats.total}
- Verified: ${summaryData.verificationStats.verified} (${
      summaryData.verificationStats.verificationRate
    }%)
- Unverified: ${summaryData.verificationStats.unverified}

**Processing Times by Type:**
${summaryData.processingTimeStats
  .map(
    (pt: any) =>
      `- ${pt.typeName}: ${pt.avgProcessingTime} hours average (${pt.completedCount} completed)`
  )
  .join("\n")}

Provide a professional, actionable summary using non-technical language appropriate for government officials.`;

    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AI_API_TOKEN}`, // Use server-side env var (without NEXT_PUBLIC_)
        },
        body: JSON.stringify({
          model: "deepseek-ai/DeepSeek-V3.2",
          max_tokens: 1024,
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API Error:", errorText);
      return NextResponse.json(
        { error: "Failed to generate summary", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    const summaryText = data.choices[0].message.content;

    return NextResponse.json({
      isSuccess: true,
      summary: summaryText,
    });
  } catch (error) {
    console.error("AI Summary Route Error:", error);
    return NextResponse.json(
      {
        isSuccess: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
