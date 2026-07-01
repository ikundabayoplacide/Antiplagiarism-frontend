import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/PasswordInput";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import MarketingLayout from "@/components/MarketingLayout";
import { loginUser, getCurrentUser } from "@/lib/storage";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
            <h1 className="font-heading text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to your account</p>
          </div>

          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setLoading(true);
                  const result = loginUser(email, password);
                  setLoading(false);
                  if (!result.ok) {
                    toast.error(result.error);
                    return;
                  }
                  toast.success("Signed in successfully");
                  const user = getCurrentUser();
                  if (user?.role === "admin") {
                    navigate("/admin");
                  } else if (user?.role === "lecturer") {
                    navigate("/lecturer");
                  } else {
                    navigate("/dashboard");
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
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="demo@university.edu"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <PasswordInput
                    id="password"
                    showLockIcon
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="demo1234"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Demo student: demo@university.edu / demo1234
                  <br />
                  Demo lecturer: lecturer@university.edu / lecturer1234
                  <br />
                  Demo admin: admin@university.edu / admin1234
                </p>
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
