import { useEffect, useState } from "react";
import { HiOutlineTrash, HiOutlineUserAdd, HiOutlinePencil } from "react-icons/hi";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PasswordInput from "@/components/PasswordInput";
import { apiGetUsers, apiCreateAdminUser, apiUpdateAdminUser, apiDeleteAdminUser, type ApiUser } from "@/lib/api";
import { getSession } from "@/lib/storage";
import type { UserRole } from "@/lib/types";
import { toast } from "sonner";

const roleBadge = (role: string) => {
  const styles: Record<string, string> = {
    admin: "bg-primary/10 text-primary",
    lecturer: "bg-accent/10 text-accent",
    student: "bg-muted text-muted-foreground",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${styles[role] ?? "bg-muted text-muted-foreground"}`}>
      {role}
    </span>
  );
};

const emptyForm = { fullName: "", email: "", password: "", role: "student" as UserRole, phoneNumber: "", department: "" };

const AdminUsers = () => {
  const session = getSession();
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editUser, setEditUser] = useState<ApiUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<ApiUser | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    apiGetUsers().then(setUsers).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const set = (key: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleAdd = async () => {
    if (!form.fullName.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    try {
      await apiCreateAdminUser({
        fullName: form.fullName, email: form.email, password: form.password, role: form.role,
        ...(form.phoneNumber.trim() && { phoneNumber: form.phoneNumber }),
        department: form.department.trim() || undefined,
      });
      toast.success("User created");
      setAddOpen(false);
      setForm(emptyForm);
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (u: ApiUser) => {
    setEditUser(u);
    setForm({ fullName: u.fullName, email: u.email, password: "", role: u.role, phoneNumber: u.phoneNumber ?? "", department: u.department ?? "" });
  };

  const handleUpdate = async () => {
    if (!editUser) return;
    setSaving(true);
    try {
      await apiUpdateAdminUser(editUser.id, {
        fullName: form.fullName, email: form.email, role: form.role,
        ...(form.phoneNumber.trim() && { phoneNumber: form.phoneNumber }),
        ...(form.department.trim() && { department: form.department }),
      });
      toast.success("User updated");
      setEditUser(null);
      setForm(emptyForm);
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    setDeleteLoading(true);
    try {
      await apiDeleteAdminUser(deletingUser.id);
      toast.success("User removed");
      setDeletingUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const formFields = (showPassword?: boolean) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Full name</Label>
        <Input value={form.fullName} onChange={set("fullName")} />
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input type="email" value={form.email} onChange={set("email")} />
      </div>
      {showPassword && (
        <div className="space-y-2">
          <Label>Password</Label>
          <PasswordInput value={form.password} onChange={set("password")} />
        </div>
      )}
          <div className="space-y-2">
        <Label>Phone number <span className="text-muted-foreground font-normal">(optional)</span></Label>
        <Input value={form.phoneNumber} onChange={set("phoneNumber")} placeholder="e.g. 0501234567" />
      </div>
      <div className="space-y-2">
        <Label>Role</Label>
        <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v as UserRole }))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="lecturer">Lecturer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Department <span className="text-muted-foreground font-normal">(optional)</span></Label>
        <Input value={form.department} onChange={set("department")} placeholder="e.g. Computer Science" />
      </div>
  
    </div>
  );

  return (
    <AdminLayout title="Users Management">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Users Management</h2>
          <p className="text-sm text-muted-foreground">Manage student, lecturer, and admin accounts</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><HiOutlineUserAdd className="h-4 w-4" /> Add User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add new user</DialogTitle></DialogHeader>
            {formFields(true)}
            <Button className="w-full mt-2" onClick={handleAdd} disabled={saving}>
              {saving ? "Creating…" : "Create user"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editUser} onOpenChange={(o) => { if (!o) { setEditUser(null); setForm(emptyForm); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit user</DialogTitle></DialogHeader>
          {formFields()}
          <Button className="w-full mt-2" onClick={handleUpdate} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingUser} onOpenChange={(o) => !o && setDeletingUser(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete User</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete <strong>{deletingUser?.fullName}</strong>? This action cannot be undone.</p>
          <div className="flex gap-2 pt-2">
            <Button variant="destructive" className="flex-1" onClick={handleDelete} disabled={deleteLoading}>
              {deleteLoading ? "Deleting…" : "Delete"}
            </Button>
            <Button variant="outline" onClick={() => setDeletingUser(null)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-6">
          <Input
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-6 max-w-sm"
          />
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Loading...</TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No users found.</TableCell></TableRow>
                ) : (
                  filtered.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.fullName}</TableCell>
                      <TableCell className="text-muted-foreground">{u.email}</TableCell>
                      <TableCell>{roleBadge(u.role)}</TableCell>
                      <TableCell className="text-muted-foreground">{u.department ?? "—"}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(u)}>
                          <HiOutlinePencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost" size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeletingUser(u)}
                          disabled={u.id === session?.userId}
                        >
                          <HiOutlineTrash className="h-4 w-4" />
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
    </AdminLayout>
  );
};

export default AdminUsers;
