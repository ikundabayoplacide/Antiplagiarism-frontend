import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar, Loader2 } from "lucide-react";
import { apiGetScans, type ApiScan } from "@/lib/api";
import { downloadScanReport } from "@/lib/report";
import { safeFormat } from "@/lib/utils";
import { toast } from "sonner";

const Reports = () => {
  const [reports, setReports] = useState<ApiScan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetScans().then(setReports).catch(() => toast.error("Failed to load reports.")).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="Download Reports">
      <div className="mb-8">
        <h2 className="font-heading text-2xl font-bold text-foreground">Download Reports</h2>
        <p className="text-sm text-muted-foreground">Download plagiarism reports for your scanned documents</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : reports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No reports yet. Upload a document to generate a plagiarism report.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reports.map((r) => (
            <Card key={r.id} className="transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{r.fileName.replace(/\.[^.]+$/, "")} — Plagiarism Report</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {safeFormat(r.createdAt)}
                      </span>
                      <span>•</span>
                      <span>{r.matchedSections.length} matches</span>
                      <span>•</span>
                      <span className={r.plagiarismPercent >= 50 ? "text-destructive" : r.plagiarismPercent >= 21 ? "text-yellow-600" : "text-emerald-600"}>
                        {r.plagiarismPercent}% similarity
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2"
                  onClick={() => { downloadScanReport(r as never); toast.success("Report downloaded"); }}>
                  <Download className="h-4 w-4" /> Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Reports;
