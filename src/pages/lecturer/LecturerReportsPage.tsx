import { useState, useEffect } from "react";
import { FaFileShield, FaMagnifyingGlass, FaFilter, FaDownload, FaFileLines } from "react-icons/fa6";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiGetLecturerScans, type ApiScan } from "@/lib/api";
import { downloadScanReport } from "@/lib/report";
import { toast } from "sonner";

const getLevel = (p: number) => p <= 20 ? "Low" : p <= 49 ? "Medium" : "High";
const levelColor = (p: number) =>
  p <= 20 ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
  : p <= 49 ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
  : "bg-rose-500/10 text-rose-600 border-rose-500/20 animate-pulse";

const LecturerReportsPage = () => {
  const [scans, setScans] = useState<ApiScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("ALL");
  const [viewScan, setViewScan] = useState<ApiScan | null>(null);

  useEffect(() => {
    apiGetLecturerScans().then(setScans).catch(() => toast.error("Failed to load reports.")).finally(() => setLoading(false));
  }, []);

  const filtered = scans.filter((s) => {
    const matchesSearch = s.fileName.toLowerCase().includes(search.toLowerCase());
    const level = getLevel(s.plagiarismPercent).toUpperCase();
    const matchesFilter = filterLevel === "ALL" || level === filterLevel;
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
              <Input placeholder="Search by file name..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-muted/20 rounded-xl" />
            </div>
            <div className="flex items-center gap-2 min-w-[200px]">
              <FaFilter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="bg-muted/20 rounded-xl"><SelectValue placeholder="All Levels" /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="ALL">All Levels</SelectItem>
                  <SelectItem value="LOW">Low (0–20%)</SelectItem>
                  <SelectItem value="MEDIUM">Medium (21–49%)</SelectItem>
                  <SelectItem value="HIGH">High (50%+)</SelectItem>
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
                  <TableHead className="pl-6 text-xs font-bold">File Name</TableHead>
                  <TableHead className="text-xs font-bold">Similarity</TableHead>
                  <TableHead className="text-xs font-bold">Level</TableHead>
                  <TableHead className="text-xs font-bold">Words</TableHead>
                  <TableHead className="text-xs font-bold text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="pl-6 max-w-[220px] font-semibold text-xs text-foreground truncate">{s.fileName}</TableCell>
                    <TableCell className={`font-bold text-xs ${s.plagiarismPercent >= 50 ? "text-rose-600" : s.plagiarismPercent >= 21 ? "text-amber-500" : "text-emerald-600"}`}>
                      {s.plagiarismPercent}%
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`rounded-lg text-xs font-bold ${levelColor(s.plagiarismPercent)}`}>
                        {getLevel(s.plagiarismPercent)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{s.wordCount.toLocaleString()}</TableCell>
                    <TableCell className="text-right pr-6 space-x-2">
                      <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs px-2.5 text-blue-600 border-blue-500/20 hover:bg-blue-500/5" onClick={() => setViewScan(s)}>
                        <FaFileLines className="h-3.5 w-3.5 mr-1" />View
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs px-2.5 text-indigo-600 border-indigo-500/20 hover:bg-indigo-500/5"
                        onClick={() => { downloadScanReport(s); toast.success("Report downloaded"); }}>
                        <FaDownload className="h-3.5 w-3.5 mr-1" />Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!viewScan} onOpenChange={(o) => !o && setViewScan(null)}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
          {viewScan && (
            <>
              <DialogHeader><DialogTitle>{viewScan.fileName}</DialogTitle></DialogHeader>
              <div className="space-y-3 text-sm">
                <p><strong>Plagiarism:</strong> {viewScan.plagiarismPercent}% &nbsp;|&nbsp; <strong>Original:</strong> {viewScan.originalPercent}%</p>
                <p><strong>Words:</strong> {viewScan.wordCount.toLocaleString()} &nbsp;|&nbsp; <strong>Status:</strong> <span className="capitalize">{viewScan.status}</span></p>
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
                ) : <p className="text-muted-foreground">No significant matches found.</p>}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LecturerReportsPage;
