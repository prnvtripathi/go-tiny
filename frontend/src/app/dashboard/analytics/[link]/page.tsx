"use client";

import {
  Bar,
  BarChart,
  PieChart,
  Pie,
//   LineChart,
//   Line,
  AreaChart,
  Area,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock data for the charts
const referrersData = [
  { name: "Direct", value: 4000 },
  { name: "Twitter", value: 3000 },
  { name: "Facebook", value: 2000 },
  { name: "LinkedIn", value: 1500 },
  { name: "Instagram", value: 1000 },
];

const browsersData = [
  { name: "Chrome", value: 5000 },
  { name: "Firefox", value: 3000 },
  { name: "Safari", value: 2000 },
  { name: "Edge", value: 1000 },
  { name: "Opera", value: 500 },
];

const countriesData = [
  { name: "USA", value: 4000 },
  { name: "UK", value: 3000 },
  { name: "Canada", value: 2000 },
  { name: "Australia", value: 1500 },
  { name: "Germany", value: 1000 },
];

const regionsData = [
  { name: "California", value: 2000 },
  { name: "New York", value: 1500 },
  { name: "Texas", value: 1000 },
  { name: "Florida", value: 800 },
  { name: "Illinois", value: 600 },
].map((item, index) => ({
  ...item,
  color: `hsl(var(--chart-${(index % 5) + 1}))`,
}));

// const citiesTimeData = [
//   {
//     name: "Day 1",
//     "New York": 1000,
//     "Los Angeles": 800,
//     Chicago: 600,
//     Houston: 500,
//     Phoenix: 400,
//   },
//   {
//     name: "Day 2",
//     "New York": 1100,
//     "Los Angeles": 850,
//     Chicago: 650,
//     Houston: 550,
//     Phoenix: 450,
//   },
//   {
//     name: "Day 3",
//     "New York": 900,
//     "Los Angeles": 750,
//     Chicago: 700,
//     Houston: 600,
//     Phoenix: 500,
//   },
//   {
//     name: "Day 4",
//     "New York": 1200,
//     "Los Angeles": 900,
//     Chicago: 800,
//     Houston: 700,
//     Phoenix: 600,
//   },
//   {
//     name: "Day 5",
//     "New York": 1300,
//     "Los Angeles": 950,
//     Chicago: 750,
//     Houston: 650,
//     Phoenix: 550,
//   },
// ];

export default function AnalyticsPage() {
  const totalClicks = 10000;

  return (
    <div className="min-h-screen bg-background">
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
                {totalClicks.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-8 lg:grid-cols-2">
            <PieChartCard
              title="Traffic Sources"
              description="Click sources distribution"
              data={referrersData}
            />
            <DonutChartCard
              title="Browser Usage"
              description="Distribution by browser"
              data={browsersData}
            />
            <BarChartCard
              title="Top Countries"
              description="Geographic distribution"
              data={countriesData}
            />
            <AreaChartCard
              title="Regional Trends"
              description="Regional breakdown"
              data={regionsData}
            />
            {/* <LineChartCard
              title="City Performance"
              description="Daily clicks by city"
              data={citiesTimeData}
              className="lg:col-span-2"
            /> */}
          </div>
        </div>
      </main>
    </div>
  );
}

interface ChartCardProps {
  title: string;
  description: string;
  data: { name: string; value: number }[];
}

// Pie Chart Component
function PieChartCard({ title, description, data }: ChartCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Donut Chart Component
function DonutChartCard({ title, description, data }: ChartCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Bar Chart Component
function BarChartCard({ title, description, data }: ChartCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, bottom: 20, left: 20 }}
            >
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "hsl(var(--foreground))" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "hsl(var(--foreground))" }}
              />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Area Chart Component
function AreaChartCard({ title, description, data }: ChartCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, bottom: 20, left: 20 }}
            >
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "hsl(var(--foreground))" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "hsl(var(--foreground))" }}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                fill="hsl(var(--chart-2))"
                stroke="hsl(var(--chart-1))"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Line Chart Component
// function LineChartCard({
//   title,
//   description,
//   data,
//   className,
// }: ChartCardProps & { className?: string }) {
//   const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"];
//   const colors = [
//     "hsl(var(--chart-1))",
//     "hsl(var(--chart-2))",
//     "hsl(var(--chart-3))",
//     "hsl(var(--chart-4))",
//     "hsl(var(--chart-5))",
//   ];

//   return (
//     <Card className={`hover:shadow-lg transition-shadow ${className}`}>
//       <CardHeader>
//         <CardTitle className="text-lg">{title}</CardTitle>
//         <CardDescription>{description}</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="h-[300px] w-full mt-4">
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart
//               data={data}
//               margin={{ top: 10, right: 30, bottom: 20, left: 20 }}
//             >
//               <XAxis
//                 dataKey="name"
//                 tickLine={false}
//                 axisLine={false}
//                 tick={{ fill: "hsl(var(--foreground))" }}
//               />
//               <YAxis
//                 tickLine={false}
//                 axisLine={false}
//                 tick={{ fill: "hsl(var(--foreground))" }}
//               />
//               <Tooltip />
//               <Legend />
//               {cities.map((city, index) => (
//                 <Line
//                   key={city}
//                   type="monotone"
//                   dataKey={city}
//                   stroke={colors[index]}
//                   strokeWidth={2}
//                   dot={{ fill: colors[index] }}
//                 />
//               ))}
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
