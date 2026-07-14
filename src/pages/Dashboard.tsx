import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FileText, Upload, CheckCircle, AlertTriangle, BarChart3, Loader2 } from "lucide-react";
import StudentLayout from "@/components/student/StudentLayout";
import StudentStatCard from "@/components/student/StudentStatCard";
import QuickActions from "@/components/student/QuickActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getStudentGreeting } from "@/lib/studentData";
import { apiGetStudentStats, apiGetScans, type ApiStudentStats, type ApiScan } from "@/lib/api";

const Dashboard = () => {
  const [stats, setStats] = useState<ApiStudentStats>({ total: 0, original: 0, flagged: 0, reports: 0, avgSimilarity: 0 });
  const [recentScans, setRecentScans] = useState<ApiScan[]>([]);
  const [loading, setLoading] = useState(true);
  const greeting = getStudentGreeting();

  useEffect(() => {
    Promise.all([
      apiGetStudentStats().then(setStats).catch(() => {}),
      apiGetScans().then((scans) => setRecentScans(scans.slice(0, 5))).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  return (
    <StudentLayout title="Anti-Plagiarism System">
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (<>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Welcome back, {greeting}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload documents, track plagiarism results, and download reports for your research projects.
          </p>
          </div>
          <Link to="/dashboard/upload">
          <Button className="gap-2 shadow-sm">
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
        </Link>
        </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StudentStatCard icon={FileText} title="Total Submissions" value={stats.total} subtitle="Documents checked" trend={8.2} trendUp />
        <StudentStatCard icon={CheckCircle} title="Original" value={stats.original} subtitle="Clean documents" iconColor="text-emerald-600" iconBg="bg-emerald-50" />
        <StudentStatCard icon={AlertTriangle} title="Flagged" value={stats.flagged} subtitle="Plagiarism detected" iconColor="text-red-600" iconBg="bg-red-50" />
        <StudentStatCard icon={BarChart3} title="Avg Similarity" value={`${stats.avgSimilarity}%`} subtitle="Across all scans" iconColor="text-violet-600" iconBg="bg-violet-50" />
      </div>

      <div className="mb-8">
        <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">Quick Actions</h3>
        <QuickActions />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-heading text-lg">Recent Submissions</CardTitle>
            <Link to="/dashboard/documents" className="text-sm font-medium text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent>
            {recentScans.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No documents yet. Upload a document to get started.</p>
            ) : (
              <div className="space-y-3">
                {recentScans.map((scan) => (
                  <div key={scan.id} className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{scan.fileName}</p>
                      <p className="text-xs text-muted-foreground">{(scan.fileSize / 1024).toFixed(1)} KB · {scan.plagiarismPercent}% similarity</p>
                    </div>
                    <span className={`ml-3 rounded-full px-2 py-0.5 text-xs font-semibold ${scan.status === "flagged" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                      {scan.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Plagiarism Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <span className="text-sm font-medium text-emerald-700">Original documents</span>
                <span className="font-bold text-emerald-700">{stats.original}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3">
                <span className="text-sm font-medium text-red-700">Flagged documents</span>
                <span className="font-bold text-red-700">{stats.flagged}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-violet-200 bg-violet-50 p-3">
                <span className="text-sm font-medium text-violet-700">Average similarity</span>
                <span className="font-bold text-violet-700">{stats.avgSimilarity}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </>)}
    </StudentLayout>
  );
};

export default Dashboard;
