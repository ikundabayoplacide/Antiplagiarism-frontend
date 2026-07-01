import { useState } from "react";
import { FaUserGraduate, FaMagnifyingGlass, FaFilter, FaRegCalendar, FaEnvelope, FaBuilding, FaBook, FaFileLines } from "react-icons/fa6";
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
import { MOCK_STUDENTS, MOCK_PROJECTS, MockStudent, MockProject } from "@/data/lecturerData";
import ProjectDetailsModal from "@/components/lecturer/ProjectDetailsModal";

const LecturerStudentsPage = () => {
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("ALL");
  const [selectedStudent, setSelectedStudent] = useState<MockStudent>(MOCK_STUDENTS[0]);
  const [selectedProject, setSelectedProject] = useState<MockProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredStudents = MOCK_STUDENTS.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase()) ||
      student.id.toLowerCase().includes(search.toLowerCase());

    const matchesDept = filterDept === "ALL" || student.department === filterDept;

    return matchesSearch && matchesDept;
  });

  const getStudentSubmissions = (studentId: string) => {
    return MOCK_PROJECTS.filter((p) => p.studentId === studentId);
  };

  const getStatusColor = (status: MockProject["status"]) => {
    switch (status) {
      case "Low":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Medium":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "High":
        return "bg-rose-500/10 text-rose-600 border-rose-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const departments = Array.from(new Set(MOCK_STUDENTS.map((s) => s.department)));
  const currentStudentSubmissions = selectedStudent ? getStudentSubmissions(selectedStudent.id) : [];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">Supervised Students Registry</h2>
        <p className="text-sm text-muted-foreground">Manage supervised candidates, evaluate active portfolios, and verify document scans.</p>
      </div>

      {/* Grid wrapper */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side: Search & Student Grid */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-border/60 shadow-sm rounded-2xl">
            <CardContent className="pt-4 space-y-3">
              {/* Search */}
              <div className="relative">
                <FaMagnifyingGlass className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-muted/20 focus-visible:ring-blue-500 rounded-xl"
                />
              </div>
              {/* Filter */}
              <div className="relative">
                <Select value={filterDept} onValueChange={setFilterDept}>
                  <SelectTrigger className="bg-muted/20 rounded-xl focus:ring-blue-500 text-xs">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="ALL">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Student list container */}
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {filteredStudents.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No students match search filters.</p>
            ) : (
              filteredStudents.map((s) => {
                const isSelected = selectedStudent?.id === s.id;
                const initials = s.name.split(" ").map(n => n[0]).join("").toUpperCase();
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStudent(s)}
                    className={`w-full text-left flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-300 ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-md shadow-blue-500/10"
                        : "bg-card border-border hover:bg-muted/40 text-foreground"
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected ? "bg-white/20 text-white" : "bg-blue-500/10 text-blue-600"
                    }`}>
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-heading text-xs font-bold truncate">{s.name}</p>
                      <p className={`text-[10px] truncate ${isSelected ? "text-white/70" : "text-muted-foreground"}`}>{s.department}</p>
                    </div>
                    <Badge variant="outline" className={`rounded-xl text-[10px] shrink-0 font-bold ${
                      isSelected ? "border-white/20 text-white bg-white/10" : "border-border text-muted-foreground bg-muted/40"
                    }`}>
                      {s.submissionsCount} check{s.submissionsCount > 1 ? "s" : ""}
                    </Badge>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Selected Student Portfolio */}
        <div className="lg:col-span-2">
          {selectedStudent ? (
            <div className="space-y-6">
              {/* Student Metadata Profile Card */}
              <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-muted/40 dark:to-muted/20 border-b border-border/40 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="h-12 w-12 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                        {selectedStudent.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                      </div>
                      <div>
                        <CardTitle className="font-heading text-lg font-bold text-foreground">{selectedStudent.name}</CardTitle>
                        <CardDescription className="text-xs font-mono">{selectedStudent.id}</CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-blue-500 hover:bg-blue-600 rounded-xl px-2.5 py-0.5 w-fit font-bold">
                      Supervised Candidate
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 grid gap-4 sm:grid-cols-3 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FaEnvelope className="h-4 w-4 text-blue-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-muted-foreground uppercase text-[9px] tracking-wider">Email Contact</p>
                      <p className="font-semibold text-foreground truncate">{selectedStudent.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FaBuilding className="h-4 w-4 text-blue-500 shrink-0" />
                    <div>
                      <p className="font-bold text-muted-foreground uppercase text-[9px] tracking-wider">Academic School</p>
                      <p className="font-semibold text-foreground">{selectedStudent.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FaRegCalendar className="h-4 w-4 text-blue-500 shrink-0" />
                    <div>
                      <p className="font-bold text-muted-foreground uppercase text-[9px] tracking-wider">Supervisor Joined</p>
                      <p className="font-semibold text-foreground">{selectedStudent.joinedDate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submissions list for selected student */}
              <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="pb-3 bg-muted/10">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <FaBook className="text-blue-600 h-4.5 w-4.5" />
                    <span>Research Papers Portfolio ({currentStudentSubmissions.length})</span>
                  </CardTitle>
                  <CardDescription className="text-xs">Individual similarity scores and file logs</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {currentStudentSubmissions.length === 0 ? (
                    <p className="text-xs text-muted-foreground p-6 text-center">This student has not submitted any projects for check.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="pl-6 text-xs font-bold">Project Title</TableHead>
                          <TableHead className="text-xs font-bold">Checked Date</TableHead>
                          <TableHead className="text-xs font-bold">Similarity Score</TableHead>
                          <TableHead className="text-xs font-bold">Risk Level</TableHead>
                          <TableHead className="text-xs font-bold text-right pr-6">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentStudentSubmissions.map((p) => (
                          <TableRow key={p.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell className="pl-6 max-w-[200px] font-semibold text-xs text-foreground truncate" title={p.title}>
                              {p.title}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">{p.dateSubmitted}</TableCell>
                            <TableCell className="text-xs font-bold">{p.similarityPercent}%</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`rounded-lg text-[10px] font-bold ${getStatusColor(p.status)}`}>
                                {p.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-lg text-xs font-semibold px-2.5"
                                onClick={() => {
                                  setSelectedProject(p);
                                  setIsModalOpen(true);
                                }}
                              >
                                <FaFileLines className="h-3.5 w-3.5 mr-1" />
                                Audit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="border-border/60 shadow-sm rounded-2xl">
              <CardContent className="py-16 text-center text-sm text-muted-foreground">
                Select a student from the sidebar list to view their supervisory portfolio and project logs.
              </CardContent>
            </Card>
          )}
        </div>
      </div>

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

export default LecturerStudentsPage;
