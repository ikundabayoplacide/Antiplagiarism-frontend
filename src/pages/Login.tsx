import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/PasswordInput";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import MarketingLayout from "@/components/MarketingLayout";
import { setSession, setToken } from "@/lib/storage";
import { apiLogin, ApiError } from "@/lib/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  return (
    <MarketingLayout>
      <div className="flex flex-col items-center justify-center bg-muted/30 px-4 py-12 md:py-16">
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center">
            <h1 className="font-heading text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to your account</p>
          </div>

          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setErrors({});
                  setLoading(true);
                  try {
                    const { token, user } = await apiLogin(email, password);
                    setToken(token);
                    setSession({ userId: String(user.id), email: user.email, role: user.role, fullName: user.fullName });
                    toast.success("Signed in successfully");
                    if (user.role === "admin") navigate("/admin");
                    else if (user.role === "lecturer") navigate("/lecturer");
                    else navigate("/dashboard");
                  } catch (err: unknown) {
                    if (err instanceof ApiError && err.field) {
                      setErrors({ [err.field]: err.message });
                    } else {
                      toast.error(err instanceof Error ? err.message : "Login failed");
                    }
                  } finally {
                    setLoading(false);
                  }
                }}
              >
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
                      placeholder="demo@university.edu"
                      className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <PasswordInput
                    id="password"
                    showLockIcon
                    required
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                    placeholder="demo1234"
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </div>
                <Button type="submit" className="w-full gap-2" disabled={loading}>
                  {loading ? "Signing in…" : "Sign In"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="font-medium text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MarketingLayout>
  );
};

export default Login;
