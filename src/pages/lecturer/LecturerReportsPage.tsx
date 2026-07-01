import { useState } from "react";
import { FaFileShield, FaMagnifyingGlass, FaFilter, FaDownload, FaFileLines } from "react-icons/fa6";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MOCK_PROJECTS, MockProject } from "@/data/lecturerData";
import ProjectDetailsModal from "@/components/lecturer/ProjectDetailsModal";
import { toast } from "sonner";

const LecturerReportsPage = () => {
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState<string>("ALL");
  const [selectedProject, setSelectedProject] = useState<MockProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredReports = MOCK_PROJECTS.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.studentName.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filterLevel === "ALL" || p.status.toUpperCase() === filterLevel;

    return matchesSearch && matchesFilter;
  });

  const getPlagiarismLevelColor = (percent: number) => {
    if (percent <= 20) return "text-emerald-600";
    if (percent <= 49) return "text-amber-500";
    return "text-rose-600 font-bold";
  };

  const handleDownload = (p: MockProject) => {
    const reportText = `
ANTI-PLAGIARISM SYSTEM - PLAGIARISM SUMMARY
===========================================
REPORT ID: REP-${p.id.toUpperCase()}
DOCUMENT TITLE: ${p.title}
STUDENT: ${p.studentName}
CHECK DATE: ${p.dateSubmitted}
SIMILARITY SCORE: ${p.similarityPercent}%
PLAGIARISM LEVEL: ${p.status.toUpperCase()}
WORDS CHECKED: ${p.wordCount}

MATCH DETAILS:
--------------
${p.matchedDocs.map((doc, i) => `${i + 1}. [${doc.similarity}%] ${doc.source}\nSnippet: "${doc.matchedText}"`).join("\n\n")}

===========================================
End of Plagiarism Audit Summary.
`;
    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${p.title.replace(/\s+/g, "_")}_Audit_Report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Plagiarism report downloaded for: ${p.studentName}`);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">Plagiarism Audit Reports</h2>
        <p className="text-sm text-muted-foreground">Download and review compiled index check reports.</p>
      </div>

      {/* Filters Card */}
      <Card className="border-border/60 shadow-sm rounded-2xl">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <FaMagnifyingGlass className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search reports by project title or student..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-muted/20 focus-visible:ring-blue-500 rounded-xl"
              />
            </div>
            {/* Filter select */}
            <div className="flex items-center gap-2 min-w-[200px]">
              <FaFilter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="bg-muted/20 rounded-xl focus:ring-blue-500">
                  <SelectValue placeholder="All Similarity Levels" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="ALL">All Levels</SelectItem>
                  <SelectItem value="LOW">Low (0-20%)</SelectItem>
                  <SelectItem value="MEDIUM">Medium (21-49%)</SelectItem>
                  <SelectItem value="HIGH">High (50%+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table List */}
      <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 bg-muted/10">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <FaFileShield className="text-blue-600 h-4.5 w-4.5" />
            <span>Generated Reports Registry ({filteredReports.length})</span>
          </CardTitle>
          <CardDescription className="text-xs">Indexed plagiarism database search files</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredReports.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No matching plagiarism reports found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6 text-xs font-bold">Project Title</TableHead>
                  <TableHead className="text-xs font-bold">Student Name</TableHead>
                  <TableHead className="text-xs font-bold">Similarity Percentage</TableHead>
                  <TableHead className="text-xs font-bold">Plagiarism Level</TableHead>
                  <TableHead className="text-xs font-bold">Date Checked</TableHead>
                  <TableHead className="text-xs font-bold text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((p) => (
                  <TableRow key={p.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="pl-6 max-w-[220px] font-semibold text-xs text-foreground truncate" title={p.title}>
                      {p.title}
                    </TableCell>
                    <TableCell className="text-xs text-foreground font-medium">{p.studentName}</TableCell>
                    <TableCell className={`font-bold text-xs ${getPlagiarismLevelColor(p.similarityPercent)}`}>
                      {p.similarityPercent}%
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`rounded-lg text-xs font-bold ${
                          p.status === "Low"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : p.status === "Medium"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : "bg-rose-500/10 text-rose-600 border-rose-500/20 animate-pulse"
                        }`}
                      >
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.dateSubmitted}</TableCell>
                    <TableCell className="text-right pr-6 space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 rounded-lg text-xs font-semibold px-2.5 text-blue-600 border-blue-500/20 hover:bg-blue-500/5"
                        onClick={() => {
                          setSelectedProject(p);
                          setIsModalOpen(true);
                        }}
                      >
                        <FaFileLines className="h-3.5 w-3.5 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 rounded-lg text-xs font-semibold px-2.5 text-indigo-600 border-indigo-500/20 hover:bg-indigo-500/5 hover:border-indigo-500"
                        onClick={() => handleDownload(p)}
                      >
                        <FaDownload className="h-3.5 w-3.5 mr-1" />
                        Download PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ProjectDetailsModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => {
          setSelectedProject(null);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default LecturerReportsPage;
