import { useEffect, useState } from "react";
import { FaUserGraduate, FaMagnifyingGlass, FaEnvelope, FaBuilding } from "react-icons/fa6";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { apiGetLecturerStudents, type ApiUser } from "@/lib/api";

const LecturerStudentsPage = () => {
  const [students, setStudents] = useState<ApiUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<ApiUser | null>(null);

  useEffect(() => {
    apiGetLecturerStudents()
      .then((users) => {
        setStudents(users);
        if (users.length > 0) setSelectedStudent(users[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  const initials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">Supervised Students Registry</h2>
        <p className="text-sm text-muted-foreground">Manage supervised candidates and their profiles.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: student list */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-border/60 shadow-sm rounded-2xl">
            <CardContent className="pt-4">
              <div className="relative">
                <FaMagnifyingGlass className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-muted/20 rounded-xl"
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {loading ? (
              <p className="text-xs text-muted-foreground text-center py-6">Loading...</p>
            ) : filtered.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No students assigned.</p>
            ) : (
              filtered.map((s) => {
                const isSelected = selectedStudent?.id === s.id;
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
                      {initials(s.fullName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-heading text-xs font-bold truncate">{s.fullName}</p>
                      <p className={`text-[10px] truncate ${isSelected ? "text-white/70" : "text-muted-foreground"}`}>
                        {s.department ?? s.email}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: selected student detail */}
        <div className="lg:col-span-2">
          {selectedStudent ? (
            <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-muted/40 dark:to-muted/20 border-b border-border/40 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="h-12 w-12 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                      {initials(selectedStudent.fullName)}
                    </div>
                    <div>
                      <CardTitle className="font-heading text-lg font-bold text-foreground">{selectedStudent.fullName}</CardTitle>
                      <CardDescription className="text-xs font-mono">{selectedStudent.phoneNumber ?? "No phone number"}</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-blue-500 hover:bg-blue-600 rounded-xl px-2.5 py-0.5 w-fit font-bold">
                    Supervised Candidate
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6 grid gap-4 sm:grid-cols-2 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FaEnvelope className="h-4 w-4 text-blue-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold text-muted-foreground uppercase text-[9px] tracking-wider">Email</p>
                    <p className="font-semibold text-foreground truncate">{selectedStudent.email}</p>
                  </div>
                </div>
                {selectedStudent.department && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FaBuilding className="h-4 w-4 text-blue-500 shrink-0" />
                    <div>
                      <p className="font-bold text-muted-foreground uppercase text-[9px] tracking-wider">Department</p>
                      <p className="font-semibold text-foreground">{selectedStudent.department}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : !loading && (
            <Card className="border-border/60 shadow-sm rounded-2xl">
              <CardContent className="py-16 text-center text-sm text-muted-foreground">
                <FaUserGraduate className="mx-auto mb-3 h-8 w-8 opacity-30" />
                No students have been assigned to you yet.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LecturerStudentsPage;
