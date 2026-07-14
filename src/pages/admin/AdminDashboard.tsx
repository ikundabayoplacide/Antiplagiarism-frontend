import { useEffect, useState } from "react";
import {
  HiOutlineDocumentDuplicate,
  HiOutlineDocumentReport,
  HiOutlineSearchCircle,
  HiOutlineUsers,
} from "react-icons/hi";
import AdminLayout from "@/components/admin/AdminLayout";
import StatCard from "@/components/admin/StatCard";
import DashboardCharts from "@/components/admin/DashboardCharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PlagiarismBadge from "@/components/admin/PlagiarismBadge";
import { apiGetAdminStats, apiGetAdminDocuments, apiGetAdminSimilarity, type ApiAdminStats, type ApiAdminDocument, type ApiSimilarityResult } from "@/lib/api";
import { getSession } from "@/lib/storage";
import { safeFormat } from "@/lib/utils";
import { toast } from "sonner";

const statIcons = [
  { icon: HiOutlineUsers, iconColor: "text-primary", iconBg: "bg-primary/10" },
  { icon: HiOutlineDocumentDuplicate, iconColor: "text-accent", iconBg: "bg-accent/10" },
  { icon: HiOutlineSearchCircle, iconColor: "text-amber-600", iconBg: "bg-amber-50" },
  { icon: HiOutlineDocumentReport, iconColor: "text-violet-600", iconBg: "bg-violet-50" },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState<ApiAdminStats | null>(null);
  const [documents, setDocuments] = useState<ApiAdminDocument[]>([]);
  const [similarity, setSimilarity] = useState<ApiSimilarityResult[]>([]);
  const session = getSession();

  useEffect(() => {
    apiGetAdminStats().then(setStats).catch((e) => toast.error(e?.message || "Failed to load stats."));
    apiGetAdminDocuments().then((d) => setDocuments(d.slice(0, 5))).catch((e) => { toast.error(e?.message || "Failed to load documents."); console.error("documents error", e); });
    apiGetAdminSimilarity().then((s) => setSimilarity(s.slice(0, 5))).catch((e) => toast.error(e?.message || "Failed to load similarity."));
  }, []);

  const statCards = stats ? [
    { title: "Total Users", count: stats.totalUsers, trend: 12.5, trendUp: true },
    { title: "Total Uploaded Documents", count: stats.totalDocuments, trend: 8.3, trendUp: true },
    { title: "Total Plagiarism Checks", count: stats.totalChecks, trend: 15.2, trendUp: true },
    { title: "Total Reports Generated", count: stats.totalReports, trend: 3.1, trendUp: false },
  ] : [];

  return (
    <AdminLayout title="Anti-Plagiarism System">
      <div className="mb-8">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Welcome back, {session?.fullName?.split(" ")[0] ?? "Admin"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor plagiarism checks, documents, and user activity across the university platform.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat, i) => (
          <StatCard
            key={stat.title}
            icon={statIcons[i].icon}
            title={stat.title}
            count={stat.count}
            trend={stat.trend}
            trendUp={stat.trendUp}
            iconColor={statIcons[i].iconColor}
            iconBg={statIcons[i].iconBg}
          />
        ))}
      </div>

      <div className="mb-8">
        <DashboardCharts />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Recent Uploaded Documents</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {documents.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">No documents yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead>File Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium max-w-[180px] truncate">{doc.fileName}</TableCell>
                      <TableCell className="text-muted-foreground uppercase text-xs">{doc.fileType}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{safeFormat(doc.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Recent Similarity Results</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {similarity.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">No results yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead>Document</TableHead>
                    <TableHead>Similarity</TableHead>
                    <TableHead>Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {similarity.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium max-w-[160px] truncate">{r.documentName}</TableCell>
                      <TableCell className="font-bold">{r.similarityPercent}%</TableCell>
                      <TableCell><PlagiarismBadge percent={r.similarityPercent} showPercent={false} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
