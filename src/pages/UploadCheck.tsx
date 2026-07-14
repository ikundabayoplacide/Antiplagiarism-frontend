import { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Loader2, Eye } from "lucide-react";
import { apiUploadScan, apiGetScans, apiDeleteScan, type ApiScan } from "@/lib/api";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PlagiarismBadge from "@/components/admin/PlagiarismBadge";

const formatDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const day = date.getDate();
    const suffix = day === 1 || day === 21 || day === 31 ? "st" : day === 2 || day === 22 ? "nd" : day === 3 || day === 23 ? "rd" : "th";
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${months[date.getMonth()]} ${day}${suffix}, ${hours}:${minutes} ${ampm}`;
  } catch { return dateStr; }
};

const UploadCheck = () => {
  const [scans, setScans] = useState<ApiScan[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingFileName, setAnalyzingFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [viewScan, setViewScan] = useState<ApiScan | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadScans = () => apiGetScans().then(setScans).catch(() => toast.error("Failed to load scans.")).finally(() => setPageLoading(false));

  useEffect(() => { loadScans(); }, []);

  const handleUpload = async (f: File) => {
    setAnalyzingFileName(f.name);
    setIsAnalyzing(true);
    setProgress(0);
    const timer = setInterval(() => setProgress((p) => p >= 90 ? 90 : p + 10), 120);
    try {
      await apiUploadScan(f);
      clearInterval(timer);
      setProgress(100);
      setTimeout(() => {
        setIsAnalyzing(false);
        toast.success("Document scanned successfully!");
        loadScans();
      }, 500);
    } catch (err: unknown) {
      clearInterval(timer);
      setIsAnalyzing(false);
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleteLoading(true);
    try {
      await apiDeleteScan(deletingId);
      toast.success("Scan deleted.");
      setDeletingId(null);
      loadScans();
    } catch {
      toast.error("Failed to delete scan.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <DashboardLayout title="Document Upload">
      <div className="mx-auto max-w-6xl py-4">
        <div className="flex items-center justify-between border-b border-border pb-6 mb-6">
          <h1 className="font-heading text-2xl font-bold text-foreground">Document Upload</h1>
          <Button onClick={() => fileRef.current?.click()} className="gap-2 border border-border bg-white text-foreground hover:bg-muted font-medium shadow-sm h-10 px-4 rounded-md">
            <Upload className="h-4 w-4 stroke-[2.5]" />
            Upload A File
          </Button>
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) { handleUpload(e.target.files[0]); e.target.value = ""; } }} />
        </div>

        <div className="overflow-hidden bg-background">
          {pageLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : scans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-muted rounded-2xl bg-muted/10">
              <Upload className="h-12 w-12 text-muted-foreground mb-4 opacity-50 animate-pulse" />
              <p className="font-semibold text-base text-foreground">No documents uploaded yet</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">Click "Upload A File" above to scan assignments for plagiarism.</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-sm font-bold text-foreground w-2/5">File name</th>
                    <th className="pb-3 text-left text-sm font-bold text-foreground">Upload Date</th>
                    <th className="pb-3 text-left text-sm font-bold text-foreground">Size</th>
                    <th className="pb-3 text-left text-sm font-bold text-foreground">Similarity</th>
                    <th className="pb-3 text-left text-sm font-bold text-foreground">Status</th>
                    <th className="pb-3 text-right text-sm font-bold text-foreground"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {scans.map((scan) => (
                    <tr key={scan.id} className="group transition-colors hover:bg-muted/30">
                      <td className="py-4 text-sm font-medium text-foreground pr-4">{scan.fileName}</td>
                      <td className="py-4 text-sm text-muted-foreground font-medium">{formatDate(scan.createdAt)}</td>
                      <td className="py-4 text-sm text-muted-foreground">{(scan.fileSize / 1024).toFixed(1)} KB</td>
                      <td className="py-4 text-sm font-bold">{scan.plagiarismPercent}%</td>
                      <td className="py-4"><PlagiarismBadge percent={scan.plagiarismPercent} showPercent={false} /></td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button onClick={() => setViewScan(scan)}
                            className="bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold shadow-sm transition-colors">
                            <Eye className="h-3.5 w-3.5 stroke-[2.5]" />View
                          </button>
                          <button onClick={() => setDeletingId(scan.id)}
                            className="border border-destructive text-destructive hover:bg-destructive/5 rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold transition-colors">
                            <Trash2 className="h-3.5 w-3.5 stroke-[2.5]" />Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isAnalyzing && (
        <Dialog open={isAnalyzing}>
          <DialogContent className="sm:max-w-md flex flex-col items-center justify-center p-8 text-center rounded-2xl" onPointerDownOutside={(e) => e.preventDefault()}>
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <h3 className="font-semibold text-lg text-foreground">Analyzing Document</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs truncate font-medium">{analyzingFileName}</p>
            <div className="w-full mt-6 space-y-2">
              <Progress value={progress} className="h-2 w-full" />
              <div className="flex justify-between text-xs text-muted-foreground font-medium">
                <span>Running AI similarity check...</span>
                <span>{progress}%</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

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

export default UploadCheck;
