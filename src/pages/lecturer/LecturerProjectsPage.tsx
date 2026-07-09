import { useState, useEffect } from "react";
import { FaBookOpen, FaMagnifyingGlass, FaFileLines, FaDownload } from "react-icons/fa6";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiGetLecturerProjects, apiGetDocument, type LecturerProject } from "@/lib/api";
import ProjectDetailsModal from "@/components/lecturer/ProjectDetailsModal";
import { toast } from "sonner";

const statusColor = (status: LecturerProject["status"]) => {
  switch (status) {
    case "Low": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "Medium": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "High": return "bg-rose-500/10 text-rose-600 border-rose-500/20";
  }
};

const LecturerProjectsPage = () => {
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<LecturerProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<LecturerProject | null>(null);

  useEffect(() => {
    apiGetLecturerProjects()
      .then((data) => {
        console.log("[LecturerProjects] response:", data);
        setProjects(data);
      })
      .catch((err) => {
        console.error("[LecturerProjects] error:", err);
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (p: LecturerProject) => {
    setDownloading(p.id);
    try {
      const doc = await apiGetDocument(p.id);
      if (!doc.content) { toast.error("No file content available."); return; }
      const byteString = atob(doc.content);
      const bytes = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) bytes[i] = byteString.charCodeAt(i);
      const blob = new Blob([bytes], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = p.title;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Downloaded successfully.");
    } catch {
      toast.error("Failed to download file.");
    } finally {
      setDownloading(null);
    }
  };

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.studentName.toLowerCase().includes(search.toLowerCase()) ||
    p.studentEmail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">Supervised Student Projects</h2>
        <p className="text-sm text-muted-foreground">View and audit all submitted documents from your assigned students.</p>
      </div>

      <Card className="border-border/60 shadow-sm rounded-2xl">
        <CardContent className="pt-6">
          <div className="relative">
            <FaMagnifyingGlass className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title, student name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-muted/20 focus-visible:ring-blue-500 rounded-xl"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 bg-muted/10">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <FaBookOpen className="text-blue-600 h-4 w-4" />
            <span>Document Register ({filtered.length})</span>
          </CardTitle>
          <CardDescription className="text-xs">Documents submitted by your assigned students</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">No documents found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6 text-xs font-bold">No.</TableHead>
                  <TableHead className="text-xs font-bold">Title</TableHead>
                  <TableHead className="text-xs font-bold">Student</TableHead>
                  <TableHead className="text-xs font-bold">Similarity</TableHead>
                  <TableHead className="text-xs font-bold">Status</TableHead>
                  <TableHead className="text-xs font-bold">Submitted</TableHead>
                  <TableHead className="text-xs font-bold text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p, idx) => (
                  <TableRow key={p.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="pl-6 font-mono text-xs text-muted-foreground">{idx + 1}</TableCell>
                    <TableCell className="max-w-[200px] font-semibold text-xs truncate" title={p.title}>{p.title}</TableCell>
                    <TableCell className="text-xs">
                      <p className="font-medium text-foreground">{p.studentName}</p>
                      <p className="text-muted-foreground">{p.studentEmail}</p>
                    </TableCell>
                    <TableCell className="text-xs font-bold">{p.similarityPercent}%</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`rounded-lg text-[10px] font-bold ${statusColor(p.status)}`}>
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(p.dateSubmitted).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-lg text-xs px-3 text-blue-600 border-blue-500/20 hover:bg-blue-500/5 hover:text-blue-600"
                          onClick={() => setSelected(p)}
                        >
                          <FaFileLines className="h-3 w-3 mr-1.5" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-lg text-xs px-3 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/5 hover:text-emerald-600"
                          disabled={downloading === p.id}
                          onClick={() => handleDownload(p)}
                        >
                          <FaDownload className="h-3 w-3 mr-1.5" />
                          {downloading === p.id ? "..." : "Download"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ProjectDetailsModal
        project={selected}
        isOpen={!!selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
};

export default LecturerProjectsPage;
