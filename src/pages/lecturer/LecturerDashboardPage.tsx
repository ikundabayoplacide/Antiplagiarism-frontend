import { useState } from "react";
import {
  FaUserGraduate,
  FaBookOpen,
  FaFileShield,
  FaTriangleExclamation,
  FaArrowTrendUp,
  FaArrowTrendDown,
} from "react-icons/fa6";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MOCK_STATS,
  MOCK_PROJECTS,
  MONTHLY_SUBMISSIONS_DATA,
  PLAGIARISM_LEVEL_DISTRIBUTION,
  SIMILARITY_TRENDS_DATA,
  MockProject,
} from "@/data/lecturerData";
import ProjectDetailsModal from "@/components/lecturer/ProjectDetailsModal";

const LecturerDashboardPage = () => {
  const [selectedProject, setSelectedProject] = useState<MockProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = MOCK_STATS;
  // Recent student submissions (e.g. limit to 4)
  const recentSubmissions = MOCK_PROJECTS.slice(0, 4);
  // Recent plagiarism reports (e.g. limit to 4, sorted or filter)
  const recentReports = [...MOCK_PROJECTS]
    .sort((a, b) => b.similarityPercent - a.similarityPercent)
    .slice(0, 4);

  // High similarity alerts (projects with > 50% similarity)
  const highSimilarityAlerts = MOCK_PROJECTS.filter((p) => p.similarityPercent >= 50);

  const getStatusBadge = (percent: number) => {
    if (percent <= 20) {
      return (
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-semibold rounded-lg">
          Low
        </Badge>
      );
    } else if (percent <= 49) {
      return (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-semibold rounded-lg">
          Medium
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20 font-semibold rounded-lg animate-pulse">
          High
        </Badge>
      );
    }
  };

  const handleOpenDetails = (project: MockProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Greeting Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 h-40 w-40 bg-white/5 rounded-full blur-2xl -translate-y-12 translate-x-12" />
        <div className="absolute left-1/3 bottom-0 h-32 w-32 bg-white/5 rounded-full blur-xl translate-y-12" />
        <div className="relative z-10 space-y-2">
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight">
            Lecturer Dashboard - Anti-Plagiarism System
          </h2>
          <p className="text-white/80 text-sm md:text-base max-w-xl font-medium">
            Supervise student research projects, review plagiarism reports, and monitor high-similarity alerts.
          </p>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Supervised Students */}
        <Card className="border-border/60 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 bg-card rounded-2xl overflow-hidden relative group">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Supervised Students</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <FaUserGraduate className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-extrabold text-foreground">{stats.supervisedStudents}</div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <FaArrowTrendUp className="h-3 w-3" />
              <span>{stats.supervisedStudentsTrend}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Total Submitted Projects */}
        <Card className="border-border/60 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 bg-card rounded-2xl overflow-hidden relative group">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Submitted Projects</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
              <FaBookOpen className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-extrabold text-foreground">{stats.totalProjects}</div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <FaArrowTrendUp className="h-3 w-3" />
              <span>{stats.totalProjectsTrend}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Reports Generated */}
        <Card className="border-border/60 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 bg-card rounded-2xl overflow-hidden relative group">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Reports Generated</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
              <FaFileShield className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-extrabold text-foreground">{stats.reportsGenerated}</div>
            <div className="flex items-center gap-1 text-xs font-semibold text-blue-600">
              <span>{stats.reportsGeneratedTrend}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: High Similarity Projects */}
        <Card className="border-border/60 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 bg-card rounded-2xl overflow-hidden relative group">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-rose-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">High Similarity Projects</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600">
              <FaTriangleExclamation className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-extrabold text-foreground">{stats.highSimilarityProjects}</div>
            <div className="flex items-center gap-1 text-xs font-semibold text-rose-600">
              <FaArrowTrendDown className="h-3 w-3" />
              <span>{stats.highSimilarityProjectsTrend}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* High Similarity Alerts Section */}
      {highSimilarityAlerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FaTriangleExclamation className="h-5 w-5 text-rose-500 animate-bounce" />
            <h3 className="font-heading text-lg font-bold text-foreground">Critical High Similarity Alerts</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {highSimilarityAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 shadow-xs transition-shadow hover:shadow-sm"
              >
                <div className="rounded-xl bg-rose-500/10 p-2.5 text-rose-600 shrink-0">
                  <FaTriangleExclamation className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-heading text-sm font-extrabold text-foreground truncate">{alert.title}</span>
                    <Badge variant="outline" className="bg-rose-500/20 text-rose-700 font-bold shrink-0">
                      {alert.similarityPercent}% similarity
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Student: <span className="font-semibold">{alert.studentName}</span></p>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-rose-600 font-bold hover:text-rose-700"
                    onClick={() => handleOpenDetails(alert)}
                  >
                    Investigate Matches
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Chart 1: Monthly Student Submissions */}
        <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-base font-bold">Monthly Student Submissions</CardTitle>
            <CardDescription className="text-xs">Submissions tracked over active school months</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_SUBMISSIONS_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="submissionsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(37, 99, 235)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="rgb(37, 99, 235)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="submissions" stroke="rgb(37, 99, 235)" strokeWidth={2.5} fillOpacity={1} fill="url(#submissionsGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 2: Plagiarism Distribution Pie */}
        <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-base font-bold">Plagiarism Level Distribution</CardTitle>
            <CardDescription className="text-xs">Supervised project similarity ratios</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] w-full flex items-center justify-center pt-4">
            <div className="relative w-full h-full">
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={PLAGIARISM_LEVEL_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {PLAGIARISM_LEVEL_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute bottom-0 flex justify-center gap-4 w-full text-[10px] font-semibold text-muted-foreground">
                {PLAGIARISM_LEVEL_DISTRIBUTION.map((d) => (
                  <div key={d.name} className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span>{d.name} ({d.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chart 3: Similarity Trends Line */}
        <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-base font-bold">Average Similarity Trends</CardTitle>
            <CardDescription className="text-xs">Avg. similarity percentage per month</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SIMILARITY_TRENDS_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} unit="%" />
                <Tooltip />
                <Line type="monotone" dataKey="avgSimilarity" stroke="rgb(124, 58, 237)" strokeWidth={3} dot={{ r: 4, strokeWidth: 1 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Grid of Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Student Submissions Section */}
        <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-3 bg-muted/10">
            <div>
              <CardTitle className="font-heading text-base font-bold">Recent Student Submissions</CardTitle>
              <CardDescription className="text-xs">Lately uploaded research papers</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6 text-xs font-bold">Student</TableHead>
                  <TableHead className="text-xs font-bold">Project Title</TableHead>
                  <TableHead className="text-xs font-bold">Date Submitted</TableHead>
                  <TableHead className="text-xs font-bold">Similarity</TableHead>
                  <TableHead className="text-xs font-bold">Status</TableHead>
                  <TableHead className="text-xs font-bold text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSubmissions.map((p) => (
                  <TableRow key={p.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="pl-6 font-semibold text-xs text-foreground">{p.studentName}</TableCell>
                    <TableCell className="max-w-[150px] truncate text-xs text-muted-foreground" title={p.title}>
                      {p.title}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.dateSubmitted}</TableCell>
                    <TableCell className="font-bold text-xs">{p.similarityPercent}%</TableCell>
                    <TableCell>{getStatusBadge(p.similarityPercent)}</TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 rounded-lg text-xs font-semibold px-2.5"
                        onClick={() => handleOpenDetails(p)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Plagiarism Reports Section */}
        <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-3 bg-muted/10">
            <div>
              <CardTitle className="font-heading text-base font-bold">Recent Plagiarism Reports</CardTitle>
              <CardDescription className="text-xs">Indexed plagiarism level checks</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6 text-xs font-bold">Project Title</TableHead>
                  <TableHead className="text-xs font-bold">Student Name</TableHead>
                  <TableHead className="text-xs font-bold">Similarity</TableHead>
                  <TableHead className="text-xs font-bold">Checked</TableHead>
                  <TableHead className="text-xs font-bold text-right pr-6">Report</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentReports.map((p) => (
                  <TableRow key={p.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="pl-6 max-w-[150px] truncate font-semibold text-xs text-foreground" title={p.title}>
                      {p.title}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.studentName}</TableCell>
                    <TableCell className={`font-bold text-xs ${p.similarityPercent >= 50 ? "text-rose-600" : p.similarityPercent >= 21 ? "text-amber-500" : "text-emerald-600"}`}>
                      {p.similarityPercent}%
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`rounded-lg text-xs font-bold ${
                          p.status === "Low"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : p.status === "Medium"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                        }`}
                      >
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.dateSubmitted}</TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 rounded-lg text-xs font-semibold px-2.5 text-blue-600 border-blue-500/20 hover:bg-blue-500/5"
                        onClick={() => handleOpenDetails(p)}
                      >
                        View Report
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Selected Project details overlay modal */}
      <ProjectDetailsModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => {
          setSelectedProject(null);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default LecturerDashboardPage;
