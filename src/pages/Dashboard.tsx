import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FileText, Upload, CheckCircle, AlertTriangle, BarChart3 } from "lucide-react";
import StudentLayout from "@/components/student/StudentLayout";
import StudentStatCard from "@/components/student/StudentStatCard";
import QuickActions from "@/components/student/QuickActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getStudentGreeting } from "@/lib/studentData";
import { apiGetDocuments, type ApiDocument } from "@/lib/api";

const Dashboard = () => {
  const [documents, setDocuments] = useState<ApiDocument[]>([]);
  const greeting = getStudentGreeting();

  useEffect(() => {
    apiGetDocuments().then(setDocuments).catch(() => {});
  }, []);

  const total = documents.length;
  const recentDocs = documents.slice(0, 5);

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
        <StudentStatCard icon={FileText} title="Total Submissions" value={total} subtitle="Documents checked" trend={8.2} trendUp />
        <StudentStatCard icon={CheckCircle} title="Documents" value={total} subtitle="Uploaded files" iconColor="text-emerald-600" iconBg="bg-emerald-50" />
        <StudentStatCard icon={AlertTriangle} title="Storage Used" value={`${(documents.reduce((s, d) => s + d.fileSize, 0) / 1024 / 1024).toFixed(1)} MB`} subtitle="Total file size" iconColor="text-red-600" iconBg="bg-red-50" />
        <StudentStatCard icon={BarChart3} title="Recent Uploads" value={recentDocs.length} subtitle="Last 5 documents" iconColor="text-violet-600" iconBg="bg-violet-50" />
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
            {recentDocs.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No documents yet. Upload a document to get started.</p>
            ) : (
              <div className="space-y-3">
                {recentDocs.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{doc.fileName ?? doc.id}</p>
                      <p className="text-xs text-muted-foreground">{(doc.fileSize / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Latest Uploads</CardTitle>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No results yet. Upload a document to run a plagiarism check.</p>
            ) : (
              <div className="space-y-3">
                {documents.slice(0, 3).map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                    <p className="truncate text-sm font-medium text-foreground">{doc.fileName ?? doc.id}</p>
                    <span className="text-xs text-muted-foreground">{(doc.fileSize / 1024).toFixed(1)} KB</span>
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
