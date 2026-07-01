import { format } from "date-fns";
import { HiOutlineDownload } from "react-icons/hi";
import AdminLayout from "@/components/admin/AdminLayout";
import PlagiarismBadge from "@/components/admin/PlagiarismBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllSimilarityResults } from "@/lib/adminData";

const SEED_REPORTS = [
  { id: "RPT-301", title: "Healthcare ML Thesis — Full Report", author: "Sarah Mitchell", date: "2026-06-14T10:00:00Z", similarity: 12 },
  { id: "RPT-300", title: "Climate Ecosystems Paper — Analysis", author: "James Okafor", date: "2026-06-14T09:00:00Z", similarity: 38 },
  { id: "RPT-299", title: "Quantum Cryptography Study — Report", author: "Emily Chen", date: "2026-06-13T17:00:00Z", similarity: 67 },
  { id: "RPT-298", title: "Urban Planning Research — Report", author: "Michael Torres", date: "2026-06-13T15:00:00Z", similarity: 8 },
  { id: "RPT-297", title: "NLP Neural Networks — Full Report", author: "Priya Sharma", date: "2026-06-12T12:00:00Z", similarity: 45 },
  { id: "RPT-296", title: "Energy Policy Analysis — Report", author: "David Kim", date: "2026-06-12T10:00:00Z", similarity: 72 },
];

const AdminReports = () => {
  const similarity = getAllSimilarityResults();
  const reports = [
    ...similarity.slice(0, 3).map((s, i) => ({
      id: `RPT-${400 + i}`,
      title: `${s.documentName} — Plagiarism Report`,
      author: "System Generated",
      date: new Date().toISOString(),
      similarity: s.similarityPercent,
    })),
    ...SEED_REPORTS,
  ];

  return (
    <AdminLayout title="Plagiarism Reports">
      <div className="mb-8">
        <h2 className="font-heading text-2xl font-bold text-foreground">Plagiarism Reports</h2>
        <p className="text-sm text-muted-foreground">
          Generated plagiarism analysis reports for academic submissions
        </p>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-6">
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead>Report ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Plagiarism Level</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs text-primary">{r.id}</TableCell>
                    <TableCell className="max-w-[220px] truncate font-medium">{r.title}</TableCell>
                    <TableCell className="text-muted-foreground">{r.author}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(r.date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <PlagiarismBadge percent={r.similarity} showPercent={false} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <HiOutlineDownload className="h-4 w-4" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminReports;
