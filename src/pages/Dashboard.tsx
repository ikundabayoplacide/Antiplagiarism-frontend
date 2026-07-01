import { Link } from "react-router-dom";
import { FileText, Upload, CheckCircle, AlertTriangle, BarChart3 } from "lucide-react";
import StudentLayout from "@/components/student/StudentLayout";
import StudentStatCard from "@/components/student/StudentStatCard";
import QuickActions from "@/components/student/QuickActions";
import RecentSubmissions from "@/components/student/RecentSubmissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getRecentSubmissions, getStudentGreeting, getStudentStats } from "@/lib/studentData";
import { getPlagiarismResults } from "@/lib/studentData";
import PlagiarismBadge from "@/components/admin/PlagiarismBadge";

const Dashboard = () => {
  const stats = getStudentStats();
  const recentSubmissions = getRecentSubmissions(5);
  const latestResults = getPlagiarismResults(3);
  const greeting = getStudentGreeting();

  return (
    <StudentLayout title="Anti-Plagiarism System">
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
        <StudentStatCard
          icon={FileText}
          title="Total Submissions"
          value={stats.total}
          subtitle="Documents checked"
          trend={8.2}
          trendUp
        />
        <StudentStatCard
          icon={CheckCircle}
          title="Original Documents"
          value={stats.original}
          subtitle="Passed plagiarism check"
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StudentStatCard
          icon={AlertTriangle}
          title="Flagged Documents"
          value={stats.flagged}
          subtitle="Needs review"
          iconColor="text-red-600"
          iconBg="bg-red-50"
        />
        <StudentStatCard
          icon={BarChart3}
          title="Avg. Similarity"
          value={`${stats.avgSimilarity}%`}
          subtitle={`${stats.reports} reports available`}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
        />
      </div>

      <div className="mb-8">
        <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">Quick Actions</h3>
        <QuickActions />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-heading text-lg">Recent Submissions</CardTitle>
            <Link to="/dashboard/history" className="text-sm font-medium text-primary hover:underline">
              View history
            </Link>
          </CardHeader>
          <CardContent>
            <RecentSubmissions submissions={recentSubmissions} />
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-heading text-lg">Latest Plagiarism Results</CardTitle>
            <Link to="/dashboard/results" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {latestResults.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No results yet. Upload a document to run a plagiarism check.
              </p>
            ) : (
              <div className="space-y-4">
                {latestResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center justify-between rounded-lg border border-border/60 p-4 transition-colors hover:bg-muted/30"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">{result.fileName}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {result.matchedSections.length} matches found · {result.wordCount.toLocaleString()} words
                      </p>
                    </div>
                    <PlagiarismBadge percent={result.plagiarismPercent} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
};

export default Dashboard;
