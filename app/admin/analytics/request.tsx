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
import { FileText, TrendingUp, Clock, CheckCircle } from "lucide-react";

const RequestPage = () => {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["request"],
    queryFn: () => getAnalytics({ type: 2 }),
  });

  // Modern color palette
  const TYPE_COLORS = [
    "#2F7FF7",
    "#8B5CF6",
    "#10B981",
    "#F59E0B",
    "#EC4899",
    "#6366F1",
    "#EF4444",
    "#06B6D4",
    "#F97316",
    "#14B8A6",
    "#A855F7",
    "#0EA5E9",
    "#84CC16",
  ];

  const STATUS_COLORS = {
    pending: "#F59E0B",
    processing: "#2F7FF7",
    approved: "#10B981",
    rejected: "#EF4444",
    cancelled: "#94A3B8",
  };

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading analytics...
            </p>
          </div>
        </div>
      </Container>
    );
  }

  if (!data?.isSuccess || !data?.data) {
    return (
      <Container>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">✕</span>
            </div>
            <p className="text-red-600">Failed to load analytics data</p>
          </div>
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

  return (
    <Container>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{month}</p>
        </div>
        <button
          onClick={() => router.push("/admin/analytics/monthlySummary")}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all duration-200 text-sm font-semibold"
        >
          <FileText className="w-4 h-4" />
          Monthly Report
        </button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Requests */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-sm opacity-90 font-medium">Total Requests</p>
          <p className="text-4xl font-bold mt-2">{total}</p>
        </div>

        {/* Pending */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Pending
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {pendingCount}
          </p>
        </div>

        {/* Processing */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-blue-600 dark:border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Processing
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {processingCount}
          </p>
        </div>

        {/* Approved */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500" />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Approved
          </p>
          <div className="flex items-end justify-between mt-2">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {approvedCount}
            </p>
            <p className="text-sm text-green-600 dark:text-green-500 font-semibold">
              {total > 0 ? ((approvedCount / total) * 100).toFixed(0) : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Request Type Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            Request Types
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats}
                margin={{ top: 10, right: 10, left: -10, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="typeName"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fill: "#6B7280", fontSize: 11 }}
                  interval={0}
                />
                <YAxis
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {stats.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={TYPE_COLORS[index % TYPE_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            Status Overview
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusStats.filter((s: any) => s.count > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ statusName, percent }) =>
                    `${statusName} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius="70%"
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
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            Daily Requests
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dailyStats}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2F7FF7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2F7FF7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString()
                  }
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#2F7FF7"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Processing Time */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            Processing Time (Hours)
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={processingTimeStats}
                margin={{ top: 10, right: 10, left: -10, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="typeName"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fill: "#6B7280", fontSize: 11 }}
                  interval={0}
                />
                <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value: any) => [`${value} hrs`, "Avg Time"]}
                />
                <Bar
                  dataKey="avgProcessingTime"
                  radius={[8, 8, 0, 0]}
                  fill="#10B981"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Types Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Detailed Breakdown
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Certificate Type
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Count
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Share
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {stats.map((stat: any, index: number) => (
                  <tr
                    key={stat.type}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor:
                              TYPE_COLORS[index % TYPE_COLORS.length],
                          }}
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {stat.typeName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {stat.count}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {total > 0
                          ? ((stat.count / total) * 100).toFixed(1)
                          : 0}
                        %
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Status Summary
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Count
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Share
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {statusStats.map((stat: any) => (
                  <tr
                    key={stat.status}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor:
                              STATUS_COLORS[
                                stat.status as keyof typeof STATUS_COLORS
                              ],
                          }}
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {stat.statusName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {stat.count}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {total > 0
                          ? ((stat.count / total) * 100).toFixed(1)
                          : 0}
                        %
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default RequestPage;
