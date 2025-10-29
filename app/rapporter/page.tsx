"use client";

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
  IconChartBar,
  IconUsers,
  IconTarget,
  IconCash,
} from "@tabler/icons-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Mock data for member growth over the last year
const memberData = [
  { month: "Jan", members: 245 },
  { month: "Feb", members: 252 },
  { month: "Mar", members: 248 },
  { month: "Apr", members: 265 },
  { month: "Mai", members: 278 },
  { month: "Jun", members: 285 },
  { month: "Jul", members: 280 },
  { month: "Aug", members: 292 },
  { month: "Sep", members: 305 },
  { month: "Okt", members: 312 },
  { month: "Nov", members: 318 },
  { month: "Des", members: 325 },
];

// Mock data for competition participation
const participationData = [
  { month: "Jan", deltakere: 45 },
  { month: "Feb", deltakere: 52 },
  { month: "Mar", deltakere: 68 },
  { month: "Apr", deltakere: 75 },
  { month: "Mai", deltakere: 82 },
  { month: "Jun", deltakere: 95 },
  { month: "Jul", deltakere: 88 },
  { month: "Aug", deltakere: 92 },
  { month: "Sep", deltakere: 105 },
  { month: "Okt", deltakere: 98 },
  { month: "Nov", deltakere: 85 },
  { month: "Des", deltakere: 72 },
];

// Mock data for revenue
const revenueData = [
  { month: "Jan", inntekt: 45000 },
  { month: "Feb", inntekt: 52000 },
  { month: "Mar", inntekt: 58000 },
  { month: "Apr", inntekt: 63000 },
  { month: "Mai", inntekt: 71000 },
  { month: "Jun", inntekt: 78000 },
  { month: "Jul", inntekt: 65000 },
  { month: "Aug", inntekt: 72000 },
  { month: "Sep", inntekt: 85000 },
  { month: "Okt", inntekt: 79000 },
  { month: "Nov", inntekt: 68000 },
  { month: "Des", inntekt: 62000 },
];

// Mock data for age distribution
const ageData = [
  { ageGroup: "Under 18", antall: 28 },
  { ageGroup: "18-25", antall: 45 },
  { ageGroup: "26-35", antall: 62 },
  { ageGroup: "36-45", antall: 58 },
  { ageGroup: "46-55", antall: 52 },
  { ageGroup: "56-65", antall: 48 },
  { ageGroup: "66+", antall: 32 },
];

// Mock data for number of competitions per month
const competitionsData = [
  { month: "Jan", stevner: 3 },
  { month: "Feb", stevner: 4 },
  { month: "Mar", stevner: 5 },
  { month: "Apr", stevner: 6 },
  { month: "Mai", stevner: 7 },
  { month: "Jun", stevner: 8 },
  { month: "Jul", stevner: 6 },
  { month: "Aug", stevner: 7 },
  { month: "Sep", stevner: 9 },
  { month: "Okt", stevner: 7 },
  { month: "Nov", stevner: 5 },
  { month: "Des", stevner: 4 },
];

// Mock data for membership fee revenue
const membershipFeeData = [
  { month: "Jan", kontingent: 68000 },
  { month: "Feb", kontingent: 12000 },
  { month: "Mar", kontingent: 15000 },
  { month: "Apr", kontingent: 8000 },
  { month: "Mai", kontingent: 18000 },
  { month: "Jun", kontingent: 22000 },
  { month: "Jul", kontingent: 5000 },
  { month: "Aug", kontingent: 85000 },
  { month: "Sep", kontingent: 72000 },
  { month: "Okt", kontingent: 25000 },
  { month: "Nov", kontingent: 12000 },
  { month: "Des", kontingent: 8000 },
];

const memberChartConfig = {
  members: {
    label: "Medlemmer",
    color: "hsl(var(--primary))",
  },
};

const participationChartConfig = {
  deltakere: {
    label: "Deltakere",
    color: "hsl(var(--chart-2))",
  },
};

const revenueChartConfig = {
  inntekt: {
    label: "Inntekt (kr)",
    color: "hsl(var(--chart-3))",
  },
};

const ageChartConfig = {
  antall: {
    label: "Antall medlemmer",
    color: "hsl(var(--chart-4))",
  },
};

const competitionsChartConfig = {
  stevner: {
    label: "Antall stevner",
    color: "hsl(var(--chart-5))",
  },
};

const membershipFeeChartConfig = {
  kontingent: {
    label: "Kontingent (kr)",
    color: "hsl(var(--chart-1))",
  },
};

export default function RapporterPage() {
  // Calculate statistics
  const currentMembers = memberData[memberData.length - 1].members;
  const previousMembers = memberData[0].members;
  const memberGrowth = currentMembers - previousMembers;
  const memberGrowthPercent = ((memberGrowth / previousMembers) * 100).toFixed(
    1
  );

  const totalParticipation = participationData.reduce(
    (sum, item) => sum + item.deltakere,
    0
  );
  // Compare with previous year's total (mock data: 876 vs current 1057)
  const previousTotalParticipation = 876;
  const participationGrowth = totalParticipation - previousTotalParticipation;
  const participationGrowthPercent = (
    (participationGrowth / previousTotalParticipation) *
    100
  ).toFixed(1);

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.inntekt, 0);
  // Compare with previous year (mock data: 685,000 kr vs current 798,000 kr)
  const previousRevenue = 685000;
  const revenueGrowth = totalRevenue - previousRevenue;
  const revenueGrowthPercent = (
    (revenueGrowth / previousRevenue) *
    100
  ).toFixed(1);

  return (
    <div className="flex-1 gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <IconChartBar className="h-8 w-8" />
            Rapporter og statistikk
          </h1>
          <p className="text-muted-foreground">
            Oversikt over medlemsutvikling, stevnedeltakelse og inntekter
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Totale medlemmer
              </CardTitle>
              <IconUsers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentMembers}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 font-semibold">
                  +{memberGrowth} ({memberGrowthPercent}%)
                </span>{" "}
                fra i fjor
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Stevnedeltakelse totalt
              </CardTitle>
              <IconTarget className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalParticipation}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 font-semibold">
                  +{participationGrowth} (+{participationGrowthPercent}%)
                </span>{" "}
                fra i fjor
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Inntekter
              </CardTitle>
              <IconCash className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalRevenue.toLocaleString("no-NO")} kr
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 font-semibold">
                  +{revenueGrowth.toLocaleString("no-NO")} kr (+
                  {revenueGrowthPercent}%)
                </span>{" "}
                fra i fjor
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Member Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Medlemmer</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Member Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Medlemsutvikling</CardTitle>
                <CardDescription>
                  Antall medlemmer over de siste 12 månedene
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={memberChartConfig}
                  className="h-[300px]"
                >
                  <LineChart data={memberData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="members"
                      stroke="var(--color-members)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-members)" }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Age Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Aldersfordeling</CardTitle>
                <CardDescription>
                  Medlemmer fordelt etter aldersgruppe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={ageChartConfig} className="h-[300px]">
                  <BarChart data={ageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="ageGroup"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="antall"
                      fill="var(--color-antall)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Competition Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Stevner</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Number of Competitions Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Antall stevner</CardTitle>
                <CardDescription>
                  Antall stevner arrangert per måned
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={competitionsChartConfig}
                  className="h-[300px]"
                >
                  <LineChart data={competitionsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="stevner"
                      stroke="var(--color-stevner)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-stevner)" }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Competition Participation Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Stevnedeltakelse</CardTitle>
                <CardDescription>
                  Antall deltakere på stevner per måned
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={participationChartConfig}
                  className="h-[300px]"
                >
                  <BarChart data={participationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="deltakere"
                      fill="var(--color-deltakere)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Revenue Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Økonomi</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Course and Competition Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Kurs- og stevneinntekter</CardTitle>
                <CardDescription>
                  Månedlige inntekter fra kurs og stevner
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={revenueChartConfig}
                  className="h-[300px]"
                >
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value) =>
                        `${Number(value).toLocaleString("no-NO")} kr`
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="inntekt"
                      stroke="var(--color-inntekt)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-inntekt)" }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Membership Fee Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Kontingentinntekter</CardTitle>
                <CardDescription>
                  Månedlige inntekter fra medlemskontingent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={membershipFeeChartConfig}
                  className="h-[300px]"
                >
                  <BarChart data={membershipFeeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value) =>
                        `${Number(value).toLocaleString("no-NO")} kr`
                      }
                    />
                    <Bar
                      dataKey="kontingent"
                      fill="var(--color-kontingent)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
