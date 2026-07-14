import { useState, useEffect } from "react";
import { safeFormat } from "@/lib/utils";
import { Download, Eye, Loader2, Search } from "lucide-react";
import StudentLayout from "@/components/student/StudentLayout";
import PlagiarismBadge from "@/components/admin/PlagiarismBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiGetScans, type ApiScan } from "@/lib/api";
import { downloadScanReport } from "@/lib/report";
import { toast } from "sonner";

const PlagiarismResults = () => {
  const [scans, setScans] = useState<ApiScan[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewScan, setViewScan] = useState<ApiScan | null>(null);

  useEffect(() => {
    apiGetScans().then(setScans).catch(() => toast.error("Failed to load results.")).finally(() => setLoading(false));
  }, []);

  const results = scans.filter((r) => r.fileName.toLowerCase().includes(search.toLowerCase()));

  return (
    <StudentLayout title="Plagiarism Results">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Plagiarism Results</h2>
          <p className="text-sm text-muted-foreground">View similarity scores and matched sources for your submitted documents</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search results..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm">
          <span className="font-semibold text-emerald-700">Low (0–20%)</span>
          <span className="ml-2 text-emerald-600">{results.filter((r) => r.plagiarismPercent <= 20).length}</span>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm">
          <span className="font-semibold text-amber-700">Medium (21–49%)</span>
          <span className="ml-2 text-amber-600">{results.filter((r) => r.plagiarismPercent > 20 && r.plagiarismPercent <= 49).length}</span>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm">
          <span className="font-semibold text-red-700">High (50%+)</span>
          <span className="ml-2 text-red-600">{results.filter((r) => r.plagiarismPercent >= 50).length}</span>
        </div>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : results.length === 0 ? (
            <p className="p-12 text-center text-sm text-muted-foreground">No plagiarism results yet. Upload a document to get started.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="font-semibold">Document</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Similarity</TableHead>
                    <TableHead className="font-semibold">Level</TableHead>
                    <TableHead className="font-semibold">Matches</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="max-w-[200px] truncate font-medium">{result.fileName}</TableCell>
                      <TableCell className="text-muted-foreground">{safeFormat(result.createdAt)}</TableCell>
                      <TableCell className="font-heading font-bold">{result.plagiarismPercent}%</TableCell>
                      <TableCell><PlagiarismBadge percent={result.plagiarismPercent} showPercent={false} /></TableCell>
                      <TableCell className="text-muted-foreground">{result.matchedSections.length}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setViewScan(result)}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => { downloadScanReport(result as never); toast.success("Report downloaded"); }}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!viewScan} onOpenChange={(open) => !open && setViewScan(null)}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
          {viewScan && (
            <>
              <DialogHeader><DialogTitle>{viewScan.fileName}</DialogTitle></DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="flex flex-wrap gap-2">
                  <PlagiarismBadge percent={viewScan.plagiarismPercent} />
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${viewScan.status === "flagged" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                    {viewScan.status}
                  </span>
                </div>
                <p><strong>Original content:</strong> {viewScan.originalPercent}%</p>
                <p><strong>Word count:</strong> {viewScan.wordCount.toLocaleString()}</p>
                {viewScan.matchedSections.length > 0 ? (
                  <div className="space-y-2">
                    <p className="font-medium">Matched sections:</p>
                    {viewScan.matchedSections.map((m, i) => (
                      <div key={i} className="rounded-lg border bg-muted/30 p-3 text-xs">
                        <p className="font-semibold text-destructive">{m.similarity}% — {m.source}</p>
                        <p className="mt-1 italic text-muted-foreground">{m.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No significant matches found.</p>
                )}
                <Button className="w-full gap-2" onClick={() => { downloadScanReport(viewScan as never); toast.success("Report downloaded"); }}>
                  <Download className="h-4 w-4" />Download Report
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </StudentLayout>
  );
};

export default PlagiarismResults;
