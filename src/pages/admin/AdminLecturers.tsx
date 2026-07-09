import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiGetUsers, apiGetAssignmentsByLecturer, apiUnassignStudent, type ApiUser, type ApiAssignment } from "@/lib/api";
import { toast } from "sonner";
import { HiOutlineTrash } from "react-icons/hi";

const AdminLecturers = () => {
  const [lecturers, setLecturers] = useState<ApiUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedLecturer, setSelectedLecturer] = useState<ApiUser | null>(null);
  const [assignments, setAssignments] = useState<ApiUser[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);

  useEffect(() => {
    apiGetUsers()
      .then((users) => setLecturers(users.filter((u) => u.role === "lecturer")))
      .finally(() => setLoading(false));
  }, []);

  const openLecturer = (lecturer: ApiUser) => {
    setSelectedLecturer(lecturer);
    setLoadingAssignments(true);
    apiGetAssignmentsByLecturer(lecturer.id)
      .then((data) => setAssignments(data as unknown as ApiUser[]))
      .finally(() => setLoadingAssignments(false));
  };

  const handleUnassign = async (assignment: ApiAssignment) => {
    try {
      await apiUnassignStudent(assignment.id);
      toast.success("Student unassigned");
      setAssignments((prev) => prev.filter((a) => a.id !== assignment.id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to unassign");
    }
  };

  const filtered = lecturers.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Lecturers">
      <div className="mb-8">
        <h2 className="font-heading text-2xl font-bold text-foreground">Lecturers</h2>
        <p className="text-sm text-muted-foreground">All registered lecturers</p>
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
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">Loading...</TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">No lecturers found</TableCell>
                  </TableRow>
                ) : (
                  filtered.map((u, i) => (
                    <TableRow key={u.id}>
                      <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                      <TableCell className="font-medium">{u.fullName}</TableCell>
                      <TableCell className="text-muted-foreground">{u.email}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => openLecturer(u)}>
                          View Students
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedLecturer} onOpenChange={(o) => { if (!o) setSelectedLecturer(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Students assigned to {selectedLecturer?.fullName}</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            {loadingAssignments ? (
              <p className="text-center text-sm text-muted-foreground py-4">Loading...</p>
            ) : assignments.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-4">No students assigned</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.fullName}</TableCell>
                      <TableCell className="text-muted-foreground">{s.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminLecturers;
