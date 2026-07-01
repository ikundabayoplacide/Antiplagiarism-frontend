import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { getSettings, saveSettings } from "@/lib/storage";
import type { AppSettings } from "@/lib/types";
import { toast } from "sonner";

const SettingsPage = () => {
  const [settings, setSettings] = useState<AppSettings>(() => getSettings());

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const update = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }));
  };

  const handleSaveProfile = () => {
    saveSettings(settings);
    toast.success("Profile and preferences saved");
  };

  return (
    <DashboardLayout title="Profile">
      <div className="mb-8">
        <h2 className="font-heading text-2xl font-bold text-foreground">Profile Management</h2>
        <p className="text-sm text-muted-foreground">Manage your account details and scan preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  value={settings.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input value={settings.lastName} onChange={(e) => update("lastName", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={settings.email}
                disabled
                className="bg-muted cursor-not-allowed text-muted-foreground select-none"
              />
            </div>
            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Email notifications</p>
                <p className="text-xs text-muted-foreground">Notify when a scan completes</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(v) => update("emailNotifications", v)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Plagiarism alerts</p>
                <p className="text-xs text-muted-foreground">Alert when similarity exceeds threshold</p>
              </div>
              <Switch
                checked={settings.plagiarismAlerts}
                onCheckedChange={(v) => update("plagiarismAlerts", v)}
              />
            </div>
            <Button variant="outline" onClick={handleSaveProfile}>
              Save notifications
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Scan Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Similarity threshold (%)</Label>
              <Input
                type="number"
                min={1}
                max={100}
                className="w-32"
                value={settings.similarityThreshold}
                onChange={(e) => update("similarityThreshold", Number(e.target.value) || 40)}
              />
              <p className="text-xs text-muted-foreground">
                Documents at or above this N-gram score are marked as flagged
              </p>
            </div>
            <Button onClick={handleSaveProfile}>Save threshold</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
