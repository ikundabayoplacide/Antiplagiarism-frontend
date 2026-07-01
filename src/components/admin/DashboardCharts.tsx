import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  getDocumentsPerMonth,
  getPlagiarismDetectionStats,
  getUserActivityOverview,
} from "@/lib/adminData";

const documentsConfig: ChartConfig = {
  value: { label: "Documents", color: "hsl(var(--primary))" },
};

const plagiarismConfig: ChartConfig = {
  low: { label: "Low (0–20%)", color: "hsl(152 60% 42%)" },
  medium: { label: "Medium (21–49%)", color: "hsl(38 92% 50%)" },
  high: { label: "High (50%+)", color: "hsl(0 84% 60%)" },
};

const activityConfig: ChartConfig = {
  students: { label: "Students", color: "hsl(var(--primary))" },
  lecturers: { label: "Lecturers", color: "hsl(152 60% 42%)" },
  admins: { label: "Admins", color: "hsl(211 70% 65%)" },
};

const DashboardCharts = () => {
  const documentsPerMonth = getDocumentsPerMonth();
  const plagiarismStats = getPlagiarismDetectionStats();
  const userActivity = getUserActivityOverview();

  return (
    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
      <Card className="border-border/60 shadow-sm transition-shadow hover:shadow-md lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="font-heading text-base font-semibold">Documents Uploaded Per Month</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={documentsConfig} className="h-[260px] w-full">
            <BarChart data={documentsPerMonth} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--color-value)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm transition-shadow hover:shadow-md lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="font-heading text-base font-semibold">Plagiarism Detection Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={plagiarismConfig} className="h-[260px] w-full">
            <BarChart data={plagiarismStats} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="low" stackId="a" fill="var(--color-low)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="medium" stackId="a" fill="var(--color-medium)" />
              <Bar dataKey="high" stackId="a" fill="var(--color-high)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm transition-shadow hover:shadow-md lg:col-span-2 xl:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="font-heading text-base font-semibold">User Activity Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={activityConfig} className="h-[260px] w-full">
            <LineChart data={userActivity} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line type="monotone" dataKey="students" stroke="var(--color-students)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="lecturers" stroke="var(--color-lecturers)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="admins" stroke="var(--color-admins)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
