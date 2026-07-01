import { useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Search, Download, Eye, Trash2 } from "lucide-react";
import { deleteScan, getScansForCurrentUser } from "@/lib/storage";
import { downloadScanReport } from "@/lib/report";
import type { ScanRecord } from "@/lib/types";
import { toast } from "sonner";
import { format } from "date-fns";

const ScanHistory = () => {
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [viewScan, setViewScan] = useState<ScanRecord | null>(null);

  const documents = useMemo(() => {
    void refresh;
    return getScansForCurrentUser().filter((d) =>
      d.fileName.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, refresh]);

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Remove "${name}" from your documents?`)) return;
    deleteScan(id);
    setRefresh((r) => r + 1);
    toast.success("Document removed");
    if (viewScan?.id === id) setViewScan(null);
  };

  return (
    <DashboardLayout title="My Documents">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">My Documents</h2>
          <p className="text-sm text-muted-foreground">View, manage, and download your uploaded documents</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {documents.length === 0 ? (
            <p className="p-12 text-center text-sm text-muted-foreground">
              No documents yet. Upload and confirm a scan from Upload Document.
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                    Words
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {documents.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border transition-colors last:border-0 hover:bg-muted/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium text-foreground">{item.fileName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {format(new Date(item.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {item.wordCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-semibold ${
                          item.plagiarismPercent > 40
                            ? "text-destructive"
                            : item.plagiarismPercent > 20
                              ? "text-yellow-600"
                              : "text-success"
                        }`}
                      >
                        {item.plagiarismPercent}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          item.status === "original"
                            ? "bg-success/10 text-success"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {item.status === "original" ? "Original" : "Flagged"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setViewScan(item)} title="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadScanReport(item)}
                          title="Download report"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id, item.fileName)}
                          title="Remove"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!viewScan} onOpenChange={(open) => !open && setViewScan(null)}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
          {viewScan && (
            <>
              <DialogHeader>
                <DialogTitle>{viewScan.fileName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <p>
                  <strong>N-gram plagiarism:</strong> {viewScan.plagiarismPercent}%
                </p>
                <p>
                  <strong>Original:</strong> {viewScan.originalPercent}% · <strong>Words:</strong>{" "}
                  {viewScan.wordCount}
                </p>
                <p>
                  <strong>Status:</strong> {viewScan.status}
                </p>
                {viewScan.matchedSections.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-medium">Matches:</p>
                    {viewScan.matchedSections.map((m, i) => (
                      <div key={i} className="rounded border bg-muted/30 p-2 text-xs">
                        <p className="text-destructive">{m.similarity}% — {m.source}</p>
                        <p className="mt-1 italic">{m.text}</p>
                      </div>
                    ))}
                  </div>
                )}
                <Button className="w-full gap-2" onClick={() => downloadScanReport(viewScan)}>
                  <Download className="h-4 w-4" />
                  Download report
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ScanHistory;
