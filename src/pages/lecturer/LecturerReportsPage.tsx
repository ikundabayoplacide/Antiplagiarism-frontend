import { useState, useEffect } from "react";
import { FaFileShield, FaMagnifyingGlass, FaFilter, FaFileLines } from "react-icons/fa6";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiGetLecturerReports, type LecturerReport } from "@/lib/api";
import { toast } from "sonner";

const levelColor = (p?: number) => {
  if (p === undefined) return "bg-muted/30 text-muted-foreground border-border";
  return p <= 20
    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
    : p <= 49
    ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
    : "bg-rose-500/10 text-rose-600 border-rose-500/20 animate-pulse";
};

const deriveStatus = (p?: number): string => {
  if (p === undefined) return "—";
  if (p <= 20) return "Low";
  if (p <= 49) return "Medium";
  return "High";
};

const formatSize = (bytes: number) =>
  bytes >= 1_000_000 ? `${(bytes / 1_000_000).toFixed(1)} MB` : `${(bytes / 1_000).toFixed(0)} KB`;

const LecturerReportsPage = () => {
  const [reports, setReports] = useState<LecturerReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("ALL");
  const [viewReport, setViewReport] = useState<LecturerReport | null>(null);

  useEffect(() => {
    apiGetLecturerReports()
      .then(setReports)
      .catch(() => toast.error("Failed to load reports."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = reports.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
    const status = deriveStatus(r.similarityPercent);
    const matchesFilter = filterLevel === "ALL" || status.toUpperCase() === filterLevel;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">Plagiarism Audit Reports</h2>
        <p className="text-sm text-muted-foreground">Download and review compiled index check reports.</p>
      </div>

      <Card className="border-border/60 shadow-sm rounded-2xl">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <FaMagnifyingGlass className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by title..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-muted/20 rounded-xl" />
            </div>
            <div className="flex items-center gap-2 min-w-[200px]">
              <FaFilter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="bg-muted/20 rounded-xl"><SelectValue placeholder="All Levels" /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="ALL">All Levels</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 bg-muted/10">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <FaFileShield className="text-blue-600 h-4 w-4" />
            <span>Generated Reports Registry ({filtered.length})</span>
          </CardTitle>
          <CardDescription className="text-xs">Indexed plagiarism database search files</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">No matching plagiarism reports found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6 text-xs font-bold">Title</TableHead>
                  <TableHead className="text-xs font-bold">Student</TableHead>
                  <TableHead className="text-xs font-bold">Similarity</TableHead>
                  <TableHead className="text-xs font-bold">Level</TableHead>
                  <TableHead className="text-xs font-bold">File Size</TableHead>
                  <TableHead className="text-xs font-bold">Submitted</TableHead>
                  <TableHead className="text-xs font-bold text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => {
                  const status = deriveStatus(r.similarityPercent);
                  return (
                    <TableRow key={r.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="pl-6 max-w-[180px] font-semibold text-xs text-foreground truncate">{r.title}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{r.studentName}</TableCell>
                      <TableCell className={`font-bold text-xs ${r.similarityPercent === undefined ? "text-muted-foreground" : r.similarityPercent >= 50 ? "text-rose-600" : r.similarityPercent >= 21 ? "text-amber-500" : "text-emerald-600"}`}>
                        {r.similarityPercent !== undefined ? `${r.similarityPercent}%` : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`rounded-lg text-xs font-bold ${levelColor(r.similarityPercent)}`}>
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatSize(r.fileSize)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{new Date(r.dateSubmitted).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs px-2.5 text-blue-600 border-blue-500/20 hover:bg-blue-500/5" onClick={() => setViewReport(r)}>
                          <FaFileLines className="h-3.5 w-3.5 mr-1" />View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!viewReport} onOpenChange={(o) => !o && setViewReport(null)}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
          {viewReport && (
            <>
              <DialogHeader><DialogTitle>{viewReport.title}</DialogTitle></DialogHeader>
              <div className="space-y-3 text-sm">
                <p><strong>Student:</strong> {viewReport.studentName} ({viewReport.studentEmail})</p>
                <p>
                  <strong>Similarity:</strong> {viewReport.similarityPercent !== undefined ? `${viewReport.similarityPercent}%` : "—"}
                  &nbsp;|&nbsp;
                  <strong>Level:</strong> {deriveStatus(viewReport.similarityPercent)}
                </p>
                <p>
                  <strong>File Size:</strong> {formatSize(viewReport.fileSize)}
                  &nbsp;|&nbsp;
                  <strong>Submitted:</strong> {new Date(viewReport.dateSubmitted).toLocaleDateString()}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LecturerReportsPage;
