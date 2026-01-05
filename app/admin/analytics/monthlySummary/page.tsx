"use client";

import Container from "@/components/container";
import TitlePage from "@/components/titlePage";
import { getMonthlySummary, getSummaryAI } from "@/services/api";
import { useQuery, useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Area,
  AreaChart,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const MonthlySummary = () => {
  const now = new Date();
  const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
  const lastMonthYear =
    now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

  const [selectedYear, setSelectedYear] = useState(lastMonthYear);
  const [selectedMonth, setSelectedMonth] = useState(lastMonth + 1);
  const [aiSummary, setAiSummary] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["summary", selectedYear, selectedMonth],
    queryFn: () =>
      getMonthlySummary({ year: selectedYear, month: selectedMonth }),
  });

  // AI Summary Mutation - Now calls backend route
  const summaryMutation = useMutation({
    mutationFn: getSummaryAI,
    onSuccess: (response) => {
      if (response.isSuccess) {
        setAiSummary(response.summary);
        toast.success("AI summary generated successfully!");
      } else {
        toast.error(response.error || "Failed to generate summary");
      }
    },
    onError: (error) => {
      console.error("Error generating summary:", error);
      toast.error("Failed to generate AI summary. Please try again.");
    },
  });

  // Expanded color palette for all 13 certificate types
  const TYPE_COLORS = [
    "#3b82f6", // Blue - Barangay Clearance
    "#10b981", // Green - Certificate of Indigency
    "#f59e0b", // Amber - Cedula
    "#ef4444", // Red - Certificate of Residency
    "#8b5cf6", // Violet - Business Clearance
    "#ec4899", // Pink - Good Moral
    "#06b6d4", // Cyan - No Income
    "#84cc16", // Lime - Solo Parent
    "#f97316", // Orange - Senior Citizen
    "#6366f1", // Indigo - PWD
    "#14b8a6", // Teal - Barangay ID
    "#a855f7", // Purple - Travel Certificate
    "#f43f5e", // Rose - Event Permit
  ];

  const STATUS_COLORS = {
    pending: "#f59e0b",
    processing: "#2f82d6",
    approved: "#10b981",
    rejected: "#ef4444",
    cancelled: "#6b7280",
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const handleExport = () => {
    if (data?.data) {
      const exportData = {
        ...data.data,
        aiSummary: aiSummary || null,
      };
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `monthly-summary-${selectedYear}-${selectedMonth}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleGenerateSummary = () => {
    if (data?.data) {
      summaryMutation.mutate(data.data);
    }
  };

  // Reset AI summary when filters change
  React.useEffect(() => {
    setAiSummary("");
  }, [selectedYear, selectedMonth]);

  if (isLoading) {
    return (
      <Container>
        <TitlePage title="Monthly Summary Report" hasBack />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </Container>
    );
  }

  if (error || !data?.isSuccess || !data?.data) {
    return (
      <Container>
        <TitlePage title="Monthly Summary Report" hasBack />
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 sm:flex-none">
                <label className="text-sm font-medium mb-2 block">Year</label>
                <Select
                  value={selectedYear.toString()}
                  onValueChange={(value) => setSelectedYear(parseInt(value))}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 sm:flex-none">
                <label className="text-sm font-medium mb-2 block">Month</label>
                <Select
                  value={selectedMonth.toString()}
                  onValueChange={(value) => setSelectedMonth(parseInt(value))}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem
                        key={month.value}
                        value={month.value.toString()}
                      >
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-500 text-lg font-semibold">
              {data?.message || "No summary found for this period"}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Try selecting a different month or year
            </p>
          </div>
        </div>
      </Container>
    );
  }

  const summary = data.data;

  return (
    <Container>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <TitlePage title="Monthly Summary Report" hasBack />
        <div className="flex gap-2">
          <Button
            onClick={handleGenerateSummary}
            variant="default"
            size="sm"
            disabled={summaryMutation.isPending}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            {summaryMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                AI Summary
              </>
            )}
          </Button>
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 sm:flex-none">
              <label className="text-sm font-medium mb-2 block">Year</label>
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 sm:flex-none">
              <label className="text-sm font-medium mb-2 block">Month</label>
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(parseInt(value))}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem
                      key={month.value}
                      value={month.value.toString()}
                    >
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">
                  {summary.monthName} {summary.year}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Summary Card */}
      {aiSummary && (
        <Card className="mb-6 border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              AI-Generated Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {aiSummary}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Requests
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.summary.totalRequests}
              </div>
              <p className="text-xs text-muted-foreground">
                For the entire month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Success Rate
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {summary.summary.successRate}%
              </div>
              <p className="text-xs text-muted-foreground">
                {summary.summary.approvedCount} approved
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Processing Time
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.summary.avgProcessingTime}h
              </div>
              <p className="text-xs text-muted-foreground">
                Average completion time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peak Day</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.summary.peakDayCount}
              </div>
              <p className="text-xs text-muted-foreground">
                {summary.summary.peakDay !== "N/A"
                  ? new Date(summary.summary.peakDay).toLocaleDateString()
                  : "No requests"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Status Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="border-l-4 border-yellow-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {summary.summary.pendingCount}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4" style={{ borderColor: "#2f82d6" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: "#2f82d6" }}>
                {summary.summary.processingCount}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {summary.summary.approvedCount}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-red-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rejected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {summary.summary.rejectedCount}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-gray-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cancelled
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {summary.summary.cancelledCount}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Certificate Types Bar Chart - Increased Height */}
          <Card>
            <CardHeader>
              <CardTitle>Certificate Types Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={450}>
                <BarChart
                  data={summary.requestTypeStats}
                  margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="typeName"
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    fontSize={10}
                    interval={0}
                  />
                  <YAxis allowDecimals={false} fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="count" name="Requests" radius={[8, 8, 0, 0]}>
                    {summary.requestTypeStats.map(
                      (entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={TYPE_COLORS[index % TYPE_COLORS.length]}
                        />
                      )
                    )}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={450}>
                <PieChart>
                  <Pie
                    data={summary.statusStats.filter((s: any) => s.count > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ statusName, count }) => `${statusName}: ${count}`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {summary.statusStats.map((entry: any, index: number) => (
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Daily Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Request Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={summary.dailyStats}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                    fontSize={11}
                  />
                  <YAxis allowDecimals={false} fontSize={11} />
                  <Tooltip
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString()
                    }
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
            </CardContent>
          </Card>

          {/* Processing Time by Certificate Type */}
          <Card>
            <CardHeader>
              <CardTitle>Processing Time by Certificate Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={summary.processingTimeStats}
                  margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="typeName"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={10}
                    interval={0}
                  />
                  <YAxis fontSize={11} />
                  <Tooltip
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
            </CardContent>
          </Card>
        </div>

        {/* Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Certificate Types Table - Scrollable */}
          <Card>
            <CardHeader>
              <CardTitle>Certificate Types Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[500px] overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-white z-10">
                    <TableRow>
                      <TableHead>Certificate Type</TableHead>
                      <TableHead className="text-right">Count</TableHead>
                      <TableHead className="text-right">Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summary.requestTypeStats.map(
                      (stat: any, index: number) => (
                        <TableRow key={stat.type}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{
                                  backgroundColor:
                                    TYPE_COLORS[index % TYPE_COLORS.length],
                                }}
                              />
                              <span className="text-sm">{stat.typeName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {stat.count}
                          </TableCell>
                          <TableCell className="text-right">
                            {summary.summary.totalRequests > 0
                              ? (
                                  (stat.count / summary.summary.totalRequests) *
                                  100
                                ).toFixed(1)
                              : 0}
                            %
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Status Table */}
          <Card>
            <CardHeader>
              <CardTitle>Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                    <TableHead className="text-right">Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.statusStats.map((stat: any) => (
                    <TableRow key={stat.status}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor:
                                STATUS_COLORS[
                                  stat.status as keyof typeof STATUS_COLORS
                                ],
                            }}
                          />
                          {stat.statusName}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{stat.count}</TableCell>
                      <TableCell className="text-right">
                        {summary.summary.totalRequests > 0
                          ? (
                              (stat.count / summary.summary.totalRequests) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Processing Time Details Table - Scrollable */}
        <Card>
          <CardHeader>
            <CardTitle>Processing Time Details by Certificate Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[500px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow>
                    <TableHead>Certificate Type</TableHead>
                    <TableHead className="text-right">
                      Completed Count
                    </TableHead>
                    <TableHead className="text-right">
                      Avg Time (Hours)
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.processingTimeStats.map((stat: any) => (
                    <TableRow key={stat.type}>
                      <TableCell className="font-medium">
                        {stat.typeName}
                      </TableCell>
                      <TableCell className="text-right">
                        {stat.completedCount}
                      </TableCell>
                      <TableCell className="text-right">
                        {stat.avgProcessingTime}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default MonthlySummary;
