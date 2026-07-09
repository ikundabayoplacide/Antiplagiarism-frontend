import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/PasswordInput";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, User, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import MarketingLayout from "@/components/MarketingLayout";
import { setSession, setToken } from "@/lib/storage";
import { apiRegister, ApiError } from "@/lib/api";
import type { UserRole } from "@/lib/types";

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; password?: string; role?: string; department?: string }>({});

  return (
    <MarketingLayout>
      <div className="flex flex-col items-center justify-center bg-muted/30 px-4 py-12 md:py-16">
        <div className="mb-6 w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="font-heading text-2xl font-bold text-foreground">Create Account</h1>
            <p className="mt-1 text-sm text-muted-foreground">Get started with plagiarism detection</p>
          </div>

          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setErrors({});
                  if (password.length < 6) {
                    setErrors({ password: "Password must be at least 6 characters" });
                    return;
                  }
                  if (role === "student" && !department.trim()) {
                    setErrors({ department: "Department is required for students" });
                    return;
                  }
                  setLoading(true);
                  try {
                    const { token, user } = await apiRegister({ fullName, email, password, role, ...(role === "student" && { department }) });
                    setToken(token);
                    setSession({ userId: String(user.id), email: user.email, role: user.role, fullName: user.fullName });
                    toast.success("Account created");
                    if (user.role === "admin") navigate("/admin");
                    else if (user.role === "lecturer") navigate("/lecturer");
                    else navigate("/dashboard");
                  } catch (err: unknown) {
                    if (err instanceof ApiError && err.field) {
                      setErrors({ [err.field]: err.message });
                    } else {
                      toast.error(err instanceof Error ? err.message : "Registration failed");
                    }
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      required
                      value={fullName}
                      onChange={(e) => { setFullName(e.target.value); setErrors((p) => ({ ...p, fullName: undefined })); }}
                      placeholder="John Doe"
                      className={`pl-10 ${errors.fullName ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                      placeholder="you@university.edu"
                      className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={role} onValueChange={(v) => { setRole(v as UserRole); setErrors((p) => ({ ...p, role: undefined })); }}>
                    <SelectTrigger className={errors.role ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="lecturer">Lecturer</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && <p className="text-xs text-destructive">{errors.role}</p>}
                </div>
                {role === "student" && (
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      required
                      value={department}
                      onChange={(e) => { setDepartment(e.target.value); setErrors((p) => ({ ...p, department: undefined })); }}
                      placeholder="e.g. Computer Science"
                      className={errors.department ? "border-destructive" : ""}
                    />
                    {errors.department && <p className="text-xs text-destructive">{errors.department}</p>}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <PasswordInput
                    id="password"
                    showLockIcon
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                    placeholder="••••••••"
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </div>
                <Button type="submit" className="w-full gap-2" disabled={loading}>
                  {loading ? "Creating…" : "Create Account"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MarketingLayout>
  );
};

export default Register;
