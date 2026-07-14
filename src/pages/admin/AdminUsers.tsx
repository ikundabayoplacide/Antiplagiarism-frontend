import { useEffect, useState } from "react";
import { HiOutlineTrash, HiOutlineUserAdd } from "react-icons/hi";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PasswordInput from "@/components/PasswordInput";
import { apiGetUsers, apiCreateAdminUser, apiDeleteAdminUser, type ApiUser } from "@/lib/api";
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

const AdminUsers = () => {
  const session = getSession();
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    apiGetUsers().then(setUsers).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAdd = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    try {
      await apiCreateAdminUser({ fullName, email, password, role, ...(phoneNumber.trim() && { phoneNumber }) });
      toast.success("User created");
      setOpen(false);
      setFullName(""); setEmail(""); setPassword(""); setRole("student"); setPhoneNumber("");
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (id === session?.userId) { toast.error("You cannot delete your own account"); return; }
    if (!confirm(`Delete user "${name}"?`)) return;
    try {
      await apiDeleteAdminUser(id);
      toast.success("User removed");
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Users Management">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Users Management</h2>
          <p className="text-sm text-muted-foreground">Manage student, lecturer, and admin accounts</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><HiOutlineUserAdd className="h-4 w-4" /> Add User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add new user</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full name</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Phone number <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="e.g. 0501234567" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="lecturer">Lecturer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleAdd} disabled={saving}>
                {saving ? "Creating…" : "Create user"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
                      <TableCell className="text-right">
                        <Button
                          variant="ghost" size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(u.id, u.fullName)}
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
