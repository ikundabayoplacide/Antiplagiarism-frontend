import { useState, useEffect } from "react";
import { FaUser, FaLock, FaSliders, FaBuilding } from "react-icons/fa6";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import PasswordInput from "@/components/PasswordInput";
import { getCurrentUser, getUsers, saveUsers, getSettings, saveSettings } from "@/lib/storage";
import type { AppSettings } from "@/lib/types";
import { toast } from "sonner";

const LecturerProfilePage = () => {
  const user = getCurrentUser();
  const [fullName, setFullName] = useState(user?.fullName ?? "Dr. Robert Carter");
  const [email, setEmail] = useState(user?.email ?? "r.carter@university.edu");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [researchArea, setResearchArea] = useState("Distributed Systems, ML Security");

  // Settings
  const [settings, setSettings] = useState<AppSettings>(() => getSettings());

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setEmail(user.email);
    }
    setSettings(getSettings());
  }, [user]);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }));
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      toast.error("Name and Email cannot be empty.");
      return;
    }

    // Save user info in users array
    const users = getUsers();
    const updatedUsers = users.map((u) => {
      if (u.id === user?.id) {
        return {
          ...u,
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
        };
      }
      return u;
    });
    saveUsers(updatedUsers);

    // Save app settings
    const updatedSettings = {
      ...settings,
      firstName: fullName.split(" ")[0] || "",
      lastName: fullName.split(" ").slice(1).join(" ") || "",
      email: email.trim().toLowerCase(),
    };
    saveSettings(updatedSettings);

    toast.success("Profile details updated successfully.");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (user && user.password !== currentPassword) {
      toast.error("Incorrect current password.");
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

    // Save updated password in users array
    const users = getUsers();
    const updatedUsers = users.map((u) => {
      if (u.id === user?.id) {
        return {
          ...u,
          password: newPassword,
        };
      }
      return u;
    });
    saveUsers(updatedUsers);

    // Clear password fields
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    toast.success("Password changed successfully.");
  };

  const handleSavePreferences = () => {
    saveSettings(settings);
    toast.success("Preferences saved successfully.");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Title */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">Lecturer Profile Management</h2>
        <p className="text-sm text-muted-foreground">Manage your credentials, academic department details, and notification thresholds.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left column: Quick Profile Display */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-blue-600 to-indigo-600" />
            <CardContent className="pt-0 flex flex-col items-center text-center -translate-y-10 mb-[-40px]">
              <div className="h-20 w-20 rounded-2xl bg-white dark:bg-card border-4 border-card shadow-md flex items-center justify-center font-heading text-xl font-bold text-blue-600">
                {fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <h3 className="mt-3 font-heading text-base font-extrabold text-foreground">{fullName}</h3>
              <Badge variant="outline" className="mt-1 border-blue-500/20 text-blue-600 font-bold bg-blue-500/5 rounded-lg">
                Lecturer Portal
              </Badge>
              <div className="mt-6 w-full text-left space-y-3.5 text-xs text-muted-foreground border-t border-border/50 pt-4">
                <div className="flex items-center gap-2">
                  <FaBuilding className="text-blue-500 shrink-0" />
                  <span className="truncate">{department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUser className="text-blue-500 shrink-0" />
                  <span className="truncate">{researchArea}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Form details */}
        <div className="md:col-span-2 space-y-6">
          {/* Section 1: Lecturer Info */}
          <Card className="border-border/60 shadow-sm rounded-2xl">
            <CardHeader className="pb-3 border-b border-border/40 bg-muted/10">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <FaUser className="text-blue-600 h-4.5 w-4.5" />
                <span>Academic Information</span>
              </CardTitle>
              <CardDescription className="text-xs">Update your academic supervisor account details.</CardDescription>
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
                      className="rounded-xl focus-visible:ring-blue-500 bg-muted/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-xl focus-visible:ring-blue-500 bg-muted/20"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-xs font-bold text-muted-foreground uppercase">Faculty Department</Label>
                    <Input
                      id="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="rounded-xl focus-visible:ring-blue-500 bg-muted/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="research" className="text-xs font-bold text-muted-foreground uppercase">Research Focus</Label>
                    <Input
                      id="research"
                      value={researchArea}
                      onChange={(e) => setResearchArea(e.target.value)}
                      className="rounded-xl focus-visible:ring-blue-500 bg-muted/20"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:from-blue-700 hover:to-indigo-700 font-semibold px-5">
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Section 2: Change Password */}
          <Card className="border-border/60 shadow-sm rounded-2xl">
            <CardHeader className="pb-3 border-b border-border/40 bg-muted/10">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <FaLock className="text-blue-600 h-4.5 w-4.5" />
                <span>Security & Password</span>
              </CardTitle>
              <CardDescription className="text-xs">Change your account login credentials.</CardDescription>
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
                    <Label htmlFor="confirmPass" className="text-xs font-bold text-muted-foreground uppercase">Confirm New Password</Label>
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
                  <Button type="submit" className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:from-blue-700 hover:to-indigo-700 font-semibold px-5">
                    Change Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Section 3: Preferences */}
          <Card className="border-border/60 shadow-sm rounded-2xl">
            <CardHeader className="pb-3 border-b border-border/40 bg-muted/10">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <FaSliders className="text-blue-600 h-4.5 w-4.5" />
                <span>Auditing Settings</span>
              </CardTitle>
              <CardDescription className="text-xs">Adjust notification thresholds and verification triggers.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive weekly candidate similarity reports.</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(v) => updateSetting("emailNotifications", v)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Plagiarism High-Similarity Warnings</p>
                  <p className="text-xs text-muted-foreground">Notify immediately if index checks trigger critical levels (50%+).</p>
                </div>
                <Switch
                  checked={settings.plagiarismAlerts}
                  onCheckedChange={(v) => updateSetting("plagiarismAlerts", v)}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="threshold" className="text-xs font-bold text-muted-foreground uppercase">Similarity Alert Threshold (%)</Label>
                <Input
                  id="threshold"
                  type="number"
                  min={1}
                  max={100}
                  className="w-32 rounded-xl focus-visible:ring-blue-500 bg-muted/20"
                  value={settings.similarityThreshold}
                  onChange={(e) => updateSetting("similarityThreshold", Number(e.target.value) || 40)}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum N-gram similarity rating before high plagiarism warnings are raised.
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={handleSavePreferences} className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:from-blue-700 hover:to-indigo-700 font-semibold px-5">
                  Save Auditing Rules
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LecturerProfilePage;
