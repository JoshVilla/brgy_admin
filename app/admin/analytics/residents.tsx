"use client";

import Container from "@/components/container";
import { getAnalytics } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Users, UserCheck, Accessibility, UsersRound } from "lucide-react";

const ResidentsPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["analytics"],
    queryFn: () => getAnalytics({}),
  });

  if (isLoading) {
    return (
      <Container>
        <div className="py-4">
          <span>Loading Data...</span>
        </div>
      </Container>
    );
  }

  if (isError || !data) {
    return (
      <Container>
        <div className="py-4">
          <span>Error loading data</span>
        </div>
      </Container>
    );
  }

  const purokChartConfig = {
    population: {
      label: "Population",
      color: "#3b82f6", // Blue-500
    },
  };

  const ageChartConfig = {
    count: {
      label: "Count",
      color: "#60a5fa", // Blue-400
    },
  };

  // Blue color palette for pie chart
  const PIE_COLORS = [
    "#3b82f6", // Blue-500 - Primary
    "#06b6d4", // Cyan-500 - Secondary
    "#8b5cf6", // Violet-500 - Accent
    "#0ea5e9", // Sky-500
    "#6366f1", // Indigo-500
  ];

  const categoryChartConfig =
    data?.status?.reduce((acc: any, cat: any, index: number) => {
      acc[cat.category] = {
        label: cat.category,
        color: PIE_COLORS[index % PIE_COLORS.length],
      };
      return acc;
    }, {}) || {};

  const puroks = data?.puroks || [];
  const age = data?.age || [];
  const status = data?.status || [];
  const summary = data?.summary || null;

  console.log("render residents");

  return (
    <Container>
      <div className="text-xl font-bold mb-6">Residents Analytics</div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Residents
              </CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalResidents}</div>
              <p className="text-xs text-muted-foreground">
                Registered residents
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Senior Citizens
              </CardTitle>
              <UserCheck className="h-4 w-4 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalSeniors}</div>
              <p className="text-xs text-muted-foreground">
                {summary.seniorAndPwd > 0 &&
                  `(${summary.seniorAndPwd} also PWD)`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">PWD</CardTitle>
              <Accessibility className="h-4 w-4 text-violet-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalPwd}</div>
              <p className="text-xs text-muted-foreground">
                Persons with disability
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                General Residents
              </CardTitle>
              <UsersRound className="h-4 w-4 text-sky-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.generalResidents}
              </div>
              <p className="text-xs text-muted-foreground">
                Non-senior, non-PWD
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Purok Chart */}
        {puroks.length > 0 && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Population by Purok</CardTitle>
              <CardDescription>
                Distribution of residents across puroks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={purokChartConfig}
                className="h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={puroks}
                    margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
                  >
                    <XAxis
                      dataKey="location"
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      allowDecimals={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="population"
                      fill="#3b82f6"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* Age Distribution Chart */}
        {age.length > 0 && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Age Distribution</CardTitle>
              <CardDescription>Residents grouped by age ranges</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={ageChartConfig}
                className="h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={age}
                    margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
                  >
                    <XAxis
                      dataKey="range"
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      allowDecimals={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="#60a5fa" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* Special Categories Pie Chart */}
        {status.length > 0 && (
          <Card className="w-full md:col-span-2">
            <CardHeader>
              <CardTitle>Special Categories</CardTitle>
              <CardDescription>
                Breakdown of seniors, PWD, and general residents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={categoryChartConfig}
                className="h-[350px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={status}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, count, percent }) =>
                        `${category}: ${count} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="category"
                    >
                      {status.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {puroks.length === 0 && age.length === 0 && status.length === 0 && (
        <div className="text-center py-10 text-gray-500">No data available</div>
      )}
    </Container>
  );
};

export default ResidentsPage;
