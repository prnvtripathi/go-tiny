"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { Analytics } from "@/types";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);

  const pathname = usePathname();
  const url_id = pathname.split("/").pop();

  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/backend/getAnalytics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url_id: Number(url_id) }),
        });
        const data = await res.json();
        setAnalytics(data?.data?.analytics);
        console.log("analytics", data?.data?.analytics);
      } catch (error) {
        console.error("Error in fetching analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [url_id]);

  return (
    <div className="bg-background">
      <main className="p-4 lg:p-8">
        <div className="space-y-4 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight">
            URL Shortener Analytics
          </h1>
          <p className="text-muted-foreground">
            Track and analyze your shortened URLs performance
          </p>
        </div>

        <div className="mt-8 space-y-8">
          <Card className="bg-primary/5 max-w-7xl mx-auto">
            <CardHeader>
              <CardTitle className="text-lg">Total Clicks</CardTitle>
              <CardDescription>
                Total number of clicks across all shortened URLs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">
                {isLoading ? (
                  <Loader2 className="animate-spin h-10 w-10" />
                ) : (
                  analytics?.click_count
                )}
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-8 lg:grid-cols-2">
            <HorizontalBarChartCard
              title="Traffic Sources"
              description="Click sources distribution"
              data={
                Array.isArray(analytics?.referrers) ? analytics.referrers : []
              }
            />
            <HorizontalBarChartCard
              title="Browser Usage"
              description="Distribution by browser"
              data={
                Array.isArray(analytics?.browsers) ? analytics.browsers : []
              }
            />
            <HorizontalBarChartCard
              title="Operating Systems"
              description="Distribution by operating system"
              data={
                Array.isArray(analytics?.operating_systems)
                  ? analytics.operating_systems
                  : []
              }
            />
            <HorizontalBarChartCard
              title="Top Countries"
              description="Geographic distribution"
              data={
                Array.isArray(analytics?.countries) ? analytics.countries : []
              }
            />
            <HorizontalBarChartCard
              title="Regional Trends"
              description="Regional breakdown"
              data={Array.isArray(analytics?.regions) ? analytics.regions : []}
            />
            <HorizontalBarChartCard
              title="City Performance"
              description="Performance breakdown by city"
              data={Array.isArray(analytics?.cities) ? analytics.cities : []}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

interface ChartCardProps {
  title: string;
  description: string;
  data: { name: string; count: number }[];
}

const CHART_COLORS = {
  bar: "hsl(346.8 77.2% 49.8%)",
  hover: "hsl(355.7 100% 97.3%)",
  background: "rgba(215, 220, 235, 0.2)",
  text: "hsl(240 4.8% 95.9)",
};

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

function HorizontalBarChartCard({ title, description, data }: ChartCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            width={500}
            height={100}
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              horizontal={false}
              stroke={CHART_COLORS.background}
            />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              style={{ fill: CHART_COLORS.text }}
            />
            <XAxis
              dataKey="count"
              type="number"
              style={{ fill: CHART_COLORS.text }}
            />
            <ChartTooltip
              cursor={{ fill: CHART_COLORS.background }}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="count" fill={CHART_COLORS.bar} radius={[0, 4, 4, 0]}>
              <LabelList
                dataKey="name"
                position="insideLeft"
                offset={8}
                fill="#fff"
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              />
              <LabelList
                dataKey="count"
                position="right"
                offset={8}
                fill={CHART_COLORS.text}
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
