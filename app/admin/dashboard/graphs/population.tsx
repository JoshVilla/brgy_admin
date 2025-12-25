"use client";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { getPopulationGraph } from "@/services/api";

const PopulationGraph = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["graph"],
    queryFn: () => getPopulationGraph({}),
  });

  const chartConfig = {
    desktop: {
      label: "Population",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const graphData = data?.data;

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Population per Puroks</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={graphData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="location"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="population" fill="#27A3F5" radius={8} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PopulationGraph;
