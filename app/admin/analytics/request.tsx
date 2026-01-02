import Container from "@/components/container";
import TitlePage from "@/components/titlePage";
import { getAnalytics } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { FileText } from "lucide-react";

const RequestPage = () => {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["request"],
    queryFn: () => getAnalytics({ type: 2 }),
  });

  // Colors
  const TYPE_COLORS = ["#3b82f6", "#10b981", "#f59e0b"];
  const STATUS_COLORS = {
    pending: "#f59e0b",
    processing: "#2f82d6",
    approved: "#10b981",
    rejected: "#ef4444",
    cancelled: "#6b7280",
  };

  if (isLoading) {
    return (
      <Container>
        <TitlePage title="Request Analytics" />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      </Container>
    );
  }

  if (!data?.isSuccess || !data?.data) {
    return (
      <Container>
        <TitlePage title="Request Analytics" />
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Failed to load analytics data</p>
        </div>
      </Container>
    );
  }

  const {
    stats,
    statusStats,
    dailyStats,
    processingTimeStats,
    verificationStats,
    total,
    month,
  } = data.data;

  const pendingCount =
    statusStats.find((s: any) => s.status === "pending")?.count || 0;
  const processingCount =
    statusStats.find((s: any) => s.status === "processing")?.count || 0;
  const approvedCount =
    statusStats.find((s: any) => s.status === "approved")?.count || 0;
  const rejectedCount =
    statusStats.find((s: any) => s.status === "rejected")?.count || 0;
  const cancelledCount =
    statusStats.find((s: any) => s.status === "cancelled")?.count || 0;

  return (
    <Container>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <TitlePage title="Request Analytics" />
        <button
          onClick={() => router.push("/admin/analytics/monthlySummary")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors duration-200 text-sm font-medium"
        >
          <FileText className="w-4 h-4" />
          View Monthly Summary
        </button>
      </div>

      <div className="space-y-4 lg:space-y-6 mt-6">
        {/* Summary Cards - Top Row */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 lg:gap-4">
          {/* Total Requests */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-4 lg:p-6 col-span-2 lg:col-span-1">
            <h3 className="text-sm font-medium opacity-90">Total Requests</h3>
            <p className="text-3xl lg:text-4xl font-bold mt-2">{total}</p>
            <p className="text-xs opacity-80 mt-1">{month}</p>
          </div>

          {/* Pending */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 lg:p-6 border-l-4 border-yellow-500">
            <h3 className="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400">
              Pending
            </h3>
            <p className="text-2xl lg:text-3xl font-bold text-yellow-600 dark:text-yellow-500 mt-2">
              {pendingCount}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Awaiting
            </p>
          </div>

          {/* Processing */}
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 lg:p-6 border-l-4"
            style={{ borderColor: "#2f82d6" }}
          >
            <h3 className="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400">
              Processing
            </h3>
            <p
              className="text-2xl lg:text-3xl font-bold mt-2"
              style={{ color: "#2f82d6" }}
            >
              {processingCount}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              In Progress
            </p>
          </div>

          {/* Approved */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 lg:p-6 border-l-4 border-green-500">
            <h3 className="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400">
              Approved
            </h3>
            <p className="text-2xl lg:text-3xl font-bold text-green-600 dark:text-green-500 mt-2">
              {approvedCount}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {total > 0 ? ((approvedCount / total) * 100).toFixed(0) : 0}%
            </p>
          </div>

          {/* Rejected */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 lg:p-6 border-l-4 border-red-500">
            <h3 className="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400">
              Rejected
            </h3>
            <p className="text-2xl lg:text-3xl font-bold text-red-600 dark:text-red-500 mt-2">
              {rejectedCount}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {total > 0 ? ((rejectedCount / total) * 100).toFixed(0) : 0}%
            </p>
          </div>

          {/* Cancelled */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 lg:p-6 border-l-4 border-gray-500">
            <h3 className="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400">
              Cancelled
            </h3>
            <p className="text-2xl lg:text-3xl font-bold text-gray-600 dark:text-gray-500 mt-2">
              {cancelledCount}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {total > 0 ? ((cancelledCount / total) * 100).toFixed(0) : 0}%
            </p>
          </div>
        </div>

        {/* Request Type Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
          {stats.map((stat: any, index: number) => (
            <div
              key={stat.type}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 lg:p-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm lg:text-base font-medium text-gray-500 dark:text-gray-400">
                  {stat.typeName}
                </h3>
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: TYPE_COLORS[index] }}
                />
              </div>
              <div className="flex items-end justify-between mt-2">
                <p
                  className="text-3xl lg:text-4xl font-bold"
                  style={{ color: TYPE_COLORS[index] }}
                >
                  {stat.count}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {total > 0 ? ((stat.count / total) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts - Stacked on mobile, 2 columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Request Type Bar Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 lg:p-6">
            <h2 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-3 lg:mb-4">
              Requests by Type
            </h2>
            <div className="w-full overflow-x-auto lg:overflow-visible">
              <div
                style={{ minWidth: "300px", width: "100%", height: "280px" }}
              >
                <ResponsiveContainer>
                  <BarChart
                    data={stats}
                    margin={{ top: 10, right: 10, left: -20, bottom: 60 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-gray-200 dark:stroke-gray-700"
                    />
                    <XAxis
                      dataKey="typeName"
                      tick={{ fill: "currentColor", fontSize: 11 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      interval={0}
                    />
                    <YAxis
                      tick={{ fill: "currentColor", fontSize: 11 }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                      }}
                    />
                    <Bar dataKey="count" name="Requests" radius={[8, 8, 0, 0]}>
                      {stats.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={TYPE_COLORS[index]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Status Distribution Pie Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 lg:p-6">
            <h2 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-3 lg:mb-4">
              Status Distribution
            </h2>
            <div className="w-full" style={{ height: "280px" }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={statusStats.filter((s: any) => s.count > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ statusName, percent }) =>
                      `${statusName}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius="60%"
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {statusStats.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          STATUS_COLORS[
                            entry.status as keyof typeof STATUS_COLORS
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Requests Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 lg:p-6">
            <h2 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-3 lg:mb-4">
              Daily Request Trend
            </h2>
            <div className="w-full overflow-x-auto lg:overflow-visible">
              <div
                style={{ minWidth: "300px", width: "100%", height: "280px" }}
              >
                <ResponsiveContainer>
                  <AreaChart
                    data={dailyStats}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorCount"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-gray-200 dark:stroke-gray-700"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "currentColor", fontSize: 11 }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                    />
                    <YAxis
                      tick={{ fill: "currentColor", fontSize: 11 }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                      }}
                      labelFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString();
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorCount)"
                      name="Requests"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Processing Time Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 lg:p-6">
            <h2 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-3 lg:mb-4">
              Avg Processing Time (Hours)
            </h2>
            <div className="w-full overflow-x-auto lg:overflow-visible">
              <div
                style={{ minWidth: "300px", width: "100%", height: "280px" }}
              >
                <ResponsiveContainer>
                  <BarChart
                    data={processingTimeStats}
                    margin={{ top: 10, right: 10, left: -20, bottom: 60 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-gray-200 dark:stroke-gray-700"
                    />
                    <XAxis
                      dataKey="typeName"
                      tick={{ fill: "currentColor", fontSize: 11 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      interval={0}
                    />
                    <YAxis tick={{ fill: "currentColor", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                      }}
                      formatter={(value: any) => [`${value} hrs`, "Avg Time"]}
                    />
                    <Bar
                      dataKey="avgProcessingTime"
                      name="Processing Time"
                      radius={[8, 8, 0, 0]}
                      fill="#10b981"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Request Type Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">
                Request Types
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Type
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Count
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      %
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {stats.map((stat: any, index: number) => (
                    <tr
                      key={stat.type}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2 lg:mr-3 flex-shrink-0"
                            style={{ backgroundColor: TYPE_COLORS[index] }}
                          />
                          <span className="text-xs lg:text-sm font-medium text-gray-900 dark:text-white">
                            {stat.typeName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900 dark:text-white font-semibold">
                        {stat.count}
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                        {total > 0
                          ? ((stat.count / total) * 100).toFixed(1)
                          : 0}
                        %
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Status Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">
                Status Breakdown
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Status
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Count
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      %
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {statusStats.map((stat: any) => (
                    <tr
                      key={stat.status}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2 lg:mr-3 flex-shrink-0"
                            style={{
                              backgroundColor:
                                STATUS_COLORS[
                                  stat.status as keyof typeof STATUS_COLORS
                                ],
                            }}
                          />
                          <span className="text-xs lg:text-sm font-medium text-gray-900 dark:text-white">
                            {stat.statusName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900 dark:text-white font-semibold">
                        {stat.count}
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                        {total > 0
                          ? ((stat.count / total) * 100).toFixed(1)
                          : 0}
                        %
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default RequestPage;
