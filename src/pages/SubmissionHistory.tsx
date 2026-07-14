import { useState, useEffect } from "react";

import { Clock, FileText, Loader2, Search } from "lucide-react";
import { Link } from "react-router-dom";
import StudentLayout from "@/components/student/StudentLayout";
import PlagiarismBadge from "@/components/admin/PlagiarismBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiGetScans, type ApiScan } from "@/lib/api";
import { cn, safeFormat } from "@/lib/utils";
import { toast } from "sonner";

const SubmissionHistory = () => {
  const [scans, setScans] = useState<ApiScan[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetScans()
      .then(setScans)
      .catch(() => toast.error("Failed to load history."))
      .finally(() => setLoading(false));
  }, []);

  const history = scans.filter((s) => s.fileName.toLowerCase().includes(search.toLowerCase()));

  return (
    <StudentLayout title="Submission History">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Submission History</h2>
          <p className="text-sm text-muted-foreground">Chronological record of all your document submissions and plagiarism checks</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search submissions..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : history.length === 0 ? (
        <Card className="border-border/60 shadow-sm">
          <CardContent className="py-16 text-center">
            <Clock className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-sm text-muted-foreground">No submission history yet.</p>
            <Link to="/dashboard/upload">
              <Button className="mt-4">Upload Your First Document</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="relative space-y-0">
          <div className="absolute bottom-0 left-6 top-0 w-px bg-border md:left-8" />
          {history.map((item, index) => (
            <div key={item.id} className="relative flex gap-4 pb-8 md:gap-6">
              <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-primary/20 bg-background md:h-14 md:w-14">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <Card className="flex-1 border-border/60 shadow-sm transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium text-foreground">{item.fileName}</h3>
                        <span className="text-xs text-muted-foreground">#{history.length - index}</span>
                      </div>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {safeFormat(item.createdAt, "MMMM d, yyyy 'at' h:mm a")}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {item.wordCount.toLocaleString()} words · {item.matchedSections.length} matches · {item.originalPercent}% original
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <PlagiarismBadge percent={item.plagiarismPercent} />
                      <span className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
                        item.status === "original" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                      )}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/dashboard/results">View Results</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/dashboard/reports">Download Report</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </StudentLayout>
  );
};

export default SubmissionHistory;
