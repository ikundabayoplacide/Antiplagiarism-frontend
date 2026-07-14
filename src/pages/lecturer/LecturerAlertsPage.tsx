import { useState, useEffect } from "react";
import { FaTriangleExclamation, FaFileLines, FaRegCalendar } from "react-icons/fa6";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiGetLecturerScans, type ApiScan } from "@/lib/api";
import { format } from "date-fns";
import { toast } from "sonner";

const LecturerAlertsPage = () => {
  const [alerts, setAlerts] = useState<ApiScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewScan, setViewScan] = useState<ApiScan | null>(null);

  useEffect(() => {
    apiGetLecturerScans()
      .then((scans) => setAlerts(scans.filter((s) => s.plagiarismPercent >= 50)))
      .catch(() => toast.error("Failed to load alerts."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">High Similarity Alerts</h2>
        <p className="text-sm text-muted-foreground">Critical alerts for documents exceeding the 50% plagiarism threshold.</p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : alerts.length === 0 ? (
        <Card className="border-border/60 shadow-sm rounded-2xl">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No active high-similarity alerts. All supervised documents are within the safe threshold.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {alerts.map((alert) => (
            <Card key={alert.id} className="border-rose-500/20 bg-rose-500/5 shadow-sm rounded-2xl overflow-hidden relative transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
              <div className="absolute inset-y-0 left-0 w-1.5 bg-rose-500" />
              <CardHeader className="pb-3 pl-8 flex flex-row items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <FaTriangleExclamation className="h-4 w-4 text-rose-500 shrink-0" />
                    <span className="font-mono text-[10px] font-bold text-rose-600 uppercase tracking-widest bg-rose-500/10 px-2 py-0.5 rounded">
                      Critically Flagged
                    </span>
                  </div>
                  <CardTitle className="font-heading text-base font-extrabold text-foreground leading-snug truncate max-w-[280px]" title={alert.fileName}>
                    {alert.fileName}
                  </CardTitle>
                </div>
                <Badge variant="outline" className="bg-rose-500/20 text-rose-700 font-extrabold border-rose-500/30 rounded-xl shrink-0 px-3 py-1">
                  {alert.plagiarismPercent}% Match
                </Badge>
              </CardHeader>
              <CardContent className="pl-8 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <FaRegCalendar className="h-3.5 w-3.5 text-rose-500/60" />
                    <span>Submitted: <strong className="text-foreground">{format(new Date(alert.createdAt), "MMM d, yyyy")}</strong></span>
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Words: <strong className="text-foreground">{alert.wordCount.toLocaleString()}</strong>
                  </div>
                </div>
                <div className="text-xs text-rose-700 bg-rose-500/10 p-3 rounded-xl border border-rose-500/10 leading-relaxed italic">
                  {alert.matchedSections.length} matched section(s) found. Review recommended prior to formal grading.
                </div>
                <div className="flex justify-end pt-1">
                  <Button onClick={() => setViewScan(alert)} className="gap-2 bg-rose-600 text-white shadow-sm hover:bg-rose-700 rounded-xl text-xs font-semibold px-4 py-2">
                    <FaFileLines className="h-3.5 w-3.5" />
                    Audit Similarity Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!viewScan} onOpenChange={(o) => !o && setViewScan(null)}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
          {viewScan && (
            <>
              <DialogHeader><DialogTitle>{viewScan.fileName}</DialogTitle></DialogHeader>
              <div className="space-y-3 text-sm">
                <p><strong>Plagiarism:</strong> {viewScan.plagiarismPercent}% &nbsp;|&nbsp; <strong>Original:</strong> {viewScan.originalPercent}%</p>
                <p><strong>Words:</strong> {viewScan.wordCount.toLocaleString()}</p>
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
                ) : <p className="text-muted-foreground">No matched sections available.</p>}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LecturerAlertsPage;
