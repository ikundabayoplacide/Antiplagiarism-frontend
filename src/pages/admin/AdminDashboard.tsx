import {
  HiOutlineDocumentDuplicate,
  HiOutlineDocumentReport,
  HiOutlineSearchCircle,
  HiOutlineUsers,
} from "react-icons/hi";
import AdminLayout from "@/components/admin/AdminLayout";
import StatCard from "@/components/admin/StatCard";
import DocumentsTable from "@/components/admin/DocumentsTable";
import SimilarityResultsTable from "@/components/admin/SimilarityResultsTable";
import DashboardCharts from "@/components/admin/DashboardCharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminStats, getRecentDocuments, getRecentSimilarityResults } from "@/lib/adminData";
import { getCurrentUser } from "@/lib/storage";

const statIcons = [
  { icon: HiOutlineUsers, iconColor: "text-primary", iconBg: "bg-primary/10" },
  { icon: HiOutlineDocumentDuplicate, iconColor: "text-accent", iconBg: "bg-accent/10" },
  { icon: HiOutlineSearchCircle, iconColor: "text-amber-600", iconBg: "bg-amber-50" },
  { icon: HiOutlineDocumentReport, iconColor: "text-violet-600", iconBg: "bg-violet-50" },
];

const AdminDashboard = () => {
  const stats = getAdminStats();
  const documents = getRecentDocuments(5);
  const similarityResults = getRecentSimilarityResults(5);
  const user = getCurrentUser();

  return (
    <AdminLayout title="Anti-Plagiarism System">
      <div className="mb-8">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Welcome back, {user?.fullName?.split(" ")[0] ?? "Admin"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor plagiarism checks, documents, and user activity across the university platform.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, i) => (
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
          <CardContent>
            <DocumentsTable documents={documents} compact />
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Recent Similarity Results</CardTitle>
          </CardHeader>
          <CardContent>
            <SimilarityResultsTable results={similarityResults} compact />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
