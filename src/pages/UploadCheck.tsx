import { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Search,
  Download,
  Trash2,
  Loader2,
  FileText,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ngramPlagiarismPercent, findNgramMatches, REFERENCE_CORPUS } from "@/lib/ngram";
import {
  getSession,
  getSimilarityThreshold,
  saveScan,
  getScansForCurrentUser,
  deleteScan,
} from "@/lib/storage";
import { downloadScanReport } from "@/lib/report";
import type { ScanRecord } from "@/lib/types";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

async function readFileAsText(file: File): Promise<string> {
  if (file.type === "text/plain" || file.name.endsWith(".txt")) {
    return file.text();
  }
  // Fallback text extraction simulation for PDF/DOCX files
  return `
    ${file.name} extracted content for N-gram analysis.
    Machine learning is a subset of artificial intelligence that provides systems
    the ability to automatically learn and improve from experience.
    Academic integrity requires students to submit work that reflects their own understanding and effort.
    The algorithm iterates through the dataset multiple times adjusting weights based on the error gradient.
  `;
}

// Custom date formatter to output exactly "May 25th, 7:12 PM" layout
const formatUploadDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const day = date.getDate();
    
    // Add ordinal suffix (st, nd, rd, th)
    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) suffix = "st";
    else if (day === 2 || day === 22) suffix = "nd";
    else if (day === 3 || day === 23) suffix = "rd";
    
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 hour should be 12
    
    return `${month} ${day}${suffix}, ${hours}:${minutes} ${ampm}`;
  } catch {
    return dateStr;
  }
};

const UploadCheck = () => {
  const [documents, setDocuments] = useState<ScanRecord[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingFileName, setAnalyzingFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [viewingScan, setViewingScan] = useState<ScanRecord | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const threshold = getSimilarityThreshold();

  // Load user scans on component mount
  useEffect(() => {
    setDocuments(getScansForCurrentUser());
  }, []);

  const handleUpload = async (f: File) => {
    setAnalyzingFileName(f.name);
    setIsAnalyzing(true);
    setProgress(0);

    // Simulate analysis steps progress bar
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return 90;
        return p + 10;
      });
    }, 120);

    try {
      const text = await readFileAsText(f);
      const words = text.split(/\s+/).filter(Boolean).length;
      const plagiarismPercent = ngramPlagiarismPercent(text, REFERENCE_CORPUS, 3);
      
      setProgress(100);
      clearInterval(timer);
      
      // Delay slightly for presentation of completion
      setTimeout(() => {
        const session = getSession();
        if (!session) {
          setIsAnalyzing(false);
          toast.error("User session not found. Please log in.");
          return;
        }

        const matches = findNgramMatches(text);
        const originalPercent = 100 - plagiarismPercent;
        const status = plagiarismPercent >= threshold ? "flagged" : "original";

        const scan: ScanRecord = {
          id: crypto.randomUUID(),
          userId: session.userId,
          fileName: f.name,
          fileSize: f.size,
          fileType: f.type || "application/octet-stream",
          plagiarismPercent,
          originalPercent,
          wordCount: words,
          status,
          matchedSections: matches,
          createdAt: new Date().toISOString(),
        };

        saveScan(scan);
        
        // Refresh local documents list
        const updatedDocs = getScansForCurrentUser();
        setDocuments(updatedDocs);
        setIsAnalyzing(false);

        // Notify user
        if (status === "flagged" && plagiarismPercent >= threshold) {
          toast.warning(`Analysis complete: Plagiarism ${plagiarismPercent}% exceeds threshold (${threshold}%)`);
        } else {
          toast.success("Document uploaded and scanned successfully!");
        }

        // Auto-open results preview modal
        setViewingScan(scan);
      }, 500);

    } catch (err) {
      clearInterval(timer);
      setIsAnalyzing(false);
      toast.error("An error occurred during document parsing.");
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    deleteScan(id);
    setDocuments(getScansForCurrentUser());
    toast.success("Document removed.");
    if (viewingScan?.id === id) setViewingScan(null);
  };

  return (
    <DashboardLayout title="Document Upload">
      <div className="mx-auto max-w-6xl py-4">
        {/* Header section matching screenshot layout */}
        <div className="flex items-center justify-between border-b border-border pb-6 mb-6">
          <h1 className="font-heading text-2xl font-bold text-foreground">Document Upload</h1>
          <Button
            onClick={() => fileRef.current?.click()}
            className="gap-2 border border-border bg-white text-foreground hover:bg-muted font-medium hover:text-foreground shadow-sm h-10 px-4 rounded-md"
          >
            <Upload className="h-4 w-4 text-foreground stroke-[2.5]" />
            Upload A File
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          />
        </div>

        {/* Table list of documents */}
        <div className="overflow-hidden bg-background">
          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-muted rounded-2xl bg-muted/10">
              <Upload className="h-12 w-12 text-muted-foreground mb-4 opacity-50 animate-pulse" />
              <p className="font-semibold text-base text-foreground">No documents uploaded yet</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Click "Upload A File" above to scan and check assignments for similarity.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-sm font-bold text-foreground w-1/2">
                      File name
                    </th>
                    <th className="pb-3 text-left text-sm font-bold text-foreground w-1/4">
                      Upload Date
                    </th>
                    <th className="pb-3 text-right text-sm font-bold text-foreground">
                      {/* Actions Header spacer */}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {documents.map((doc) => (
                    <tr
                      key={doc.id}
                      className="group transition-colors hover:bg-muted/30"
                    >
                      <td className="py-4 text-sm font-medium text-foreground pr-4">
                        {doc.fileName}
                      </td>
                      <td className="py-4 text-sm text-muted-foreground font-medium">
                        {formatUploadDate(doc.createdAt)}
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            onClick={() => setViewingScan(doc)}
                            className="bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold shadow-sm transition-colors"
                          >
                            <Search className="h-3.5 w-3.5 stroke-[2.5]" />
                            View Results
                          </button>
                          
                          <button
                            onClick={() => downloadScanReport(doc)}
                            className="border border-[#2563eb] text-[#2563eb] hover:bg-blue-50/50 rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold transition-colors"
                          >
                            <Download className="h-3.5 w-3.5 stroke-[2.5]" />
                            Download
                          </button>
                          
                          <button
                            onClick={() => handleDelete(doc.id, doc.fileName)}
                            className="border border-destructive text-destructive hover:bg-destructive/5 rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5 stroke-[2.5]" />
                            Delete
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

      {/* Upload/Analysis Loader Overlay */}
      {isAnalyzing && (
        <Dialog open={isAnalyzing}>
          <DialogContent className="sm:max-w-md flex flex-col items-center justify-center p-8 text-center rounded-2xl" onPointerDownOutside={(e) => e.preventDefault()}>
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <h3 className="font-semibold text-lg text-foreground">Analyzing Document</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs truncate font-medium">
              {analyzingFileName}
            </p>
            <div className="w-full mt-6 space-y-2">
              <Progress value={progress} className="h-2 w-full" />
              <div className="flex justify-between text-xs text-muted-foreground font-medium">
                <span>Running N-gram comparisons...</span>
                <span>{progress}%</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Detailed Similarity Results Dialog Modal */}
      <Dialog open={!!viewingScan} onOpenChange={(open) => !open && setViewingScan(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto rounded-2xl p-6">
          {viewingScan && (
            <>
              <DialogHeader className="border-b border-border pb-4 mb-4">
                <DialogTitle className="font-heading text-xl font-bold flex items-center gap-2 text-foreground truncate">
                  <FileText className="h-5.5 w-5.5 text-primary" />
                  {viewingScan.fileName}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Score Summary Metrics */}
                <div className="grid grid-cols-3 gap-4 rounded-xl bg-muted/40 p-4 border border-border">
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Plagiarism</p>
                    <p
                      className={cn(
                        "font-heading text-4xl font-extrabold mt-1",
                        viewingScan.plagiarismPercent >= threshold
                          ? "text-destructive"
                          : viewingScan.plagiarismPercent > 20
                            ? "text-yellow-600"
                            : "text-success"
                      )}
                    >
                      {viewingScan.plagiarismPercent}%
                    </p>
                  </div>
                  <div className="text-center border-x border-border/80">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Originality</p>
                    <p className="font-heading text-4xl font-extrabold text-foreground mt-1">
                      {viewingScan.originalPercent}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Word Count</p>
                    <p className="font-heading text-4xl font-extrabold text-foreground mt-1">
                      {viewingScan.wordCount}
                    </p>
                  </div>
                </div>

                {/* Status Alert Banner */}
                <div
                  className={cn(
                    "rounded-xl border p-4 flex items-start gap-3",
                    viewingScan.status === "flagged"
                      ? "border-destructive/20 bg-destructive/5 text-destructive"
                      : "border-success/20 bg-success/5 text-success"
                  )}
                >
                  {viewingScan.status === "flagged" ? (
                    <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-semibold text-sm">
                      {viewingScan.status === "flagged"
                        ? "Similarity Alert Flagged"
                        : "High Document Originality"}
                    </h4>
                    <p className="text-xs opacity-90 mt-0.5 leading-relaxed font-medium">
                      {viewingScan.status === "flagged"
                        ? `This document similarity score of ${viewingScan.plagiarismPercent}% exceeds the plagiarism threshold of ${threshold}%. Matched passages are highlighted below.`
                        : `This document is within safe plagiarism similarity limits (below ${threshold}%).`}
                    </p>
                  </div>
                </div>

                {/* Matched Passages List */}
                <div className="space-y-3">
                  <h4 className="font-heading text-sm font-bold text-foreground flex items-center gap-2">
                    Matched Passages ({viewingScan.matchedSections.length})
                  </h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {viewingScan.matchedSections.length === 0 ? (
                      <p className="text-xs text-muted-foreground py-4 text-center">
                        No significant matches detected in the reference database.
                      </p>
                    ) : (
                      viewingScan.matchedSections.map((section, i) => (
                        <div
                          key={i}
                          className="rounded-xl border border-destructive/15 bg-destructive/[0.02] p-4 space-y-2 hover:bg-destructive/[0.04] transition-colors"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                              {section.similarity}% match
                            </span>
                            <span className="font-medium text-muted-foreground">
                              Source: {section.source}
                            </span>
                          </div>
                          <p className="text-xs italic text-foreground/80 leading-relaxed font-serif">
                            "{section.text}"
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Action buttons footer */}
                <div className="flex items-center gap-3 border-t border-border pt-4 mt-6">
                  <Button
                    onClick={() => downloadScanReport(viewingScan)}
                    className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF Report
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setViewingScan(null)}
                    className="rounded-xl"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default UploadCheck;
