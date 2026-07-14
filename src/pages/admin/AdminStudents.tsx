import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiGetUsers, apiGetAssignments, apiAssignStudent, type ApiUser, type ApiAssignment } from "@/lib/api";
import { toast } from "sonner";

const AdminStudents = () => {
  const [students, setStudents] = useState<ApiUser[]>([]);
  const [lecturers, setLecturers] = useState<ApiUser[]>([]);
  const [assignments, setAssignments] = useState<ApiAssignment[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<ApiUser | null>(null);
  const [selectedLecturerId, setSelectedLecturerId] = useState("");
  const [assigning, setAssigning] = useState(false);

  const fetchData = () => {
    Promise.all([apiGetUsers(), apiGetAssignments()])
      .then(([users, assigns]) => {
        setStudents(users.filter((u) => u.role === "student"));
        setLecturers(users.filter((u) => u.role === "lecturer"));
        setAssignments(assigns);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const getAssignedLecturer = (studentId: string) => {
    const a = assignments.find((a) => a.studentId === studentId);
    if (!a) return null;
    return { assignmentId: a.id, lecturer: lecturers.find((l) => l.id === a.lecturerId) };
  };

  const handleAssign = async () => {
    if (!selectedStudent || !selectedLecturerId) return;
    setAssigning(true);
    console.log("[assign] payload:", { lecturerId: selectedLecturerId, studentId: selectedStudent.id });
    try {
      const result = await apiAssignStudent(selectedLecturerId, selectedStudent.id);
      console.log("[assign] success:", result);
      toast.success(`${selectedStudent.fullName} assigned successfully`);
      setSelectedStudent(null);
      setSelectedLecturerId("");
      fetchData();
    } catch (err) {
      console.error("[assign] error:", err);
      toast.error(err instanceof Error ? err.message : "Assignment failed");
    } finally {
      setAssigning(false);
    }
  };

  const filtered = students.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Students">
      <div className="mb-8">
        <h2 className="font-heading text-2xl font-bold text-foreground">Students</h2>
        <p className="text-sm text-muted-foreground">All registered students</p>
      </div>
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-6">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-6 max-w-sm"
          />
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead>#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Assigned Lecturer</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">Loading...</TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">No students found</TableCell>
                  </TableRow>
                ) : (
                  filtered.map((u, i) => {
                    const assigned = getAssignedLecturer(u.id);
                    return (
                      <TableRow key={u.id}>
                        <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                        <TableCell className="font-medium">{u.fullName}</TableCell>
                        <TableCell className="text-muted-foreground">{u.email}</TableCell>
                        <TableCell className="text-muted-foreground">{u.department ?? "—"}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {assigned?.lecturer?.fullName ?? <span className="text-muted-foreground/50 italic">Unassigned</span>}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => { setSelectedStudent(u); setSelectedLecturerId(""); }}
                          >
                            {assigned ? "Reassign" : "Assign"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedStudent} onOpenChange={(o) => { if (!o) setSelectedStudent(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Lecturer to {selectedStudent?.fullName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Select value={selectedLecturerId} onValueChange={setSelectedLecturerId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a lecturer" />
              </SelectTrigger>
              <SelectContent>
                {lecturers.map((l) => (
                  <SelectItem key={l.id} value={l.id}>{l.fullName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="w-full" disabled={!selectedLecturerId || assigning} onClick={handleAssign}>
              {assigning ? "Assigning..." : "Confirm Assignment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminStudents;
