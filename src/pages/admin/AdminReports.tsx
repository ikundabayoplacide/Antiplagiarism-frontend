import { useEffect, useState } from "react";
import { format } from "date-fns";
import { HiOutlineDownload } from "react-icons/hi";
import AdminLayout from "@/components/admin/AdminLayout";
import PlagiarismBadge from "@/components/admin/PlagiarismBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiGetAdminSimilarity, type ApiSimilarityResult } from "@/lib/api";

const AdminReports = () => {
  const [results, setResults] = useState<ApiSimilarityResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetAdminSimilarity().then(setResults).finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Plagiarism Reports">
      <div className="mb-8">
        <h2 className="font-heading text-2xl font-bold text-foreground">Plagiarism Reports</h2>
        <p className="text-sm text-muted-foreground">Generated plagiarism analysis reports for academic submissions</p>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-6">
          {loading ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Loading...</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead>Report ID</TableHead>
                    <TableHead>Document</TableHead>
                    <TableHead>Compared With</TableHead>
                    <TableHead>Plagiarism Level</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs text-primary">{r.id}</TableCell>
                      <TableCell className="max-w-[200px] truncate font-medium">{r.documentName}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[160px] truncate">{r.comparedWith}</TableCell>
                      <TableCell><PlagiarismBadge percent={r.similarityPercent} showPercent={false} /></TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="gap-1.5">
                          <HiOutlineDownload className="h-4 w-4" />Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminReports;
