import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Search, Trash2, Eye, Loader2 } from "lucide-react";
import { apiGetScans, apiDeleteScan, type ApiScan } from "@/lib/api";
import { toast } from "sonner";
import { safeFormat } from "@/lib/utils";
import PlagiarismBadge from "@/components/admin/PlagiarismBadge";

const ScanHistory = () => {
  const [scans, setScans] = useState<ApiScan[]>([]);
  const [search, setSearch] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [viewScan, setViewScan] = useState<ApiScan | null>(null);

  const loadScans = async () => {
    try {
      const data = await apiGetScans();
      setScans(data);
    } catch {
      toast.error("Failed to load scans.");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => { loadScans(); }, []);

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleteLoading(true);
    try {
      await apiDeleteScan(deletingId);
      toast.success("Scan removed.");
      setDeletingId(null);
      loadScans();
    } catch {
      toast.error("Failed to delete scan.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filtered = scans.filter((s) =>
    s.fileName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="My Documents">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">My Documents</h2>
          <p className="text-sm text-muted-foreground">View and manage your plagiarism scan history</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search documents..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {pageLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="p-12 text-center text-sm text-muted-foreground">No scans yet. Upload a file to get started.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Document</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Similarity</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-border transition-colors last:border-0 hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium text-foreground">{item.fileName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{safeFormat(item.createdAt)}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{(item.fileSize / 1024).toFixed(1)} KB</td>
                    <td className="px-6 py-4 text-sm font-bold">{item.plagiarismPercent}%</td>
                    <td className="px-6 py-4"><PlagiarismBadge percent={item.plagiarismPercent} showPercent={false} /></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setViewScan(item)} title="View"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeletingId(item.id)} title="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!viewScan} onOpenChange={(o) => !o && setViewScan(null)}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
          {viewScan && (
            <>
              <DialogHeader><DialogTitle>{viewScan.fileName}</DialogTitle></DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="flex flex-wrap gap-2">
                  <PlagiarismBadge percent={viewScan.plagiarismPercent} />
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${viewScan.status === "flagged" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                    {viewScan.status}
                  </span>
                </div>
                <p><strong>Plagiarism:</strong> {viewScan.plagiarismPercent}% &nbsp;|&nbsp; <strong>Original:</strong> {viewScan.originalPercent}%</p>
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
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete Scan</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this scan? This action cannot be undone.</p>
          <div className="flex gap-2 pt-2">
            <Button variant="destructive" className="flex-1" onClick={handleDelete} disabled={deleteLoading}>
              {deleteLoading ? "Deleting…" : "Delete"}
            </Button>
            <Button variant="outline" onClick={() => setDeletingId(null)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ScanHistory;
