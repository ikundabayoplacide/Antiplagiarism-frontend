import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa6";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PasswordInput from "@/components/PasswordInput";
import { apiUpdateSettings } from "@/lib/api";
import { getSession, setSession } from "@/lib/storage";
import { toast } from "sonner";

const LecturerProfilePage = () => {
  const session = getSession();
  const [fullName, setFullName] = useState(session?.fullName ?? "");
  const [email, setEmail] = useState(session?.email ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() && !email.trim()) {
      toast.error("Provide at least a name or email.");
      return;
    }
    setSavingProfile(true);
    try {
      await apiUpdateSettings({ fullName: fullName.trim() });
      setSession({ ...session!, fullName: fullName.trim() });
      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setSavingPassword(true);
    try {
      // Password change not supported via settings endpoint; show info
      toast.info("Password change is not available via this interface.");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">Lecturer Profile</h2>
        <p className="text-sm text-muted-foreground">Manage your account details and password.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Avatar card */}
        <div className="md:col-span-1">
          <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-blue-600 to-indigo-600" />
            <CardContent className="pt-0 flex flex-col items-center text-center -translate-y-10 mb-[-40px]">
              <div className="h-20 w-20 rounded-2xl bg-white dark:bg-card border-4 border-card shadow-md flex items-center justify-center font-heading text-xl font-bold text-blue-600">
                {fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
              </div>
              <h3 className="mt-3 font-heading text-base font-extrabold text-foreground">{fullName || "—"}</h3>
              <p className="text-xs text-muted-foreground mt-1 truncate max-w-full px-2">{email}</p>
              <Badge variant="outline" className="mt-2 border-blue-500/20 text-blue-600 font-bold bg-blue-500/5 rounded-lg">
                Lecturer
              </Badge>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          {/* Update profile */}
          <Card className="border-border/60 shadow-sm rounded-2xl">
            <CardHeader className="pb-3 border-b border-border/40 bg-muted/10">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <FaUser className="text-blue-600 h-4 w-4" />
                Account Information
              </CardTitle>
              <CardDescription className="text-xs">Update your name and email address.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullname" className="text-xs font-bold text-muted-foreground uppercase">Full Name</Label>
                    <Input
                      id="fullname"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="rounded-xl bg-muted/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-xl bg-muted/20"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={savingProfile}
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 font-semibold px-5"
                  >
                    {savingProfile ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Change password */}
          <Card className="border-border/60 shadow-sm rounded-2xl">
            <CardHeader className="pb-3 border-b border-border/40 bg-muted/10">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <FaLock className="text-blue-600 h-4 w-4" />
                Change Password
              </CardTitle>
              <CardDescription className="text-xs">Minimum 6 characters for the new password.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPass" className="text-xs font-bold text-muted-foreground uppercase">Current Password</Label>
                  <PasswordInput
                    id="currentPass"
                    showLockIcon
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="newPass" className="text-xs font-bold text-muted-foreground uppercase">New Password</Label>
                    <PasswordInput
                      id="newPass"
                      showLockIcon
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPass" className="text-xs font-bold text-muted-foreground uppercase">Confirm Password</Label>
                    <PasswordInput
                      id="confirmPass"
                      showLockIcon
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={savingPassword}
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 font-semibold px-5"
                  >
                    {savingPassword ? "Changing..." : "Change Password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LecturerProfilePage;
