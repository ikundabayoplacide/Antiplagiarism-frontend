import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { getSettings, saveSettings } from "@/lib/storage";
import type { AppSettings } from "@/lib/types";
import { toast } from "sonner";

const AdminSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(() => getSettings());

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const update = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }));
  };

  const handleSave = () => {
    saveSettings(settings);
    toast.success("Admin settings saved");
  };

  return (
    <AdminLayout title="Settings">
      <div className="mb-8">
        <h2 className="font-heading text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground">Configure system preferences and notifications</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Administrator Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={settings.firstName} onChange={(e) => update("firstName", e.target.value)} />
              </div>
            
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={settings.email} onChange={(e) => update("email", e.target.value)} />
            </div>
            <Button onClick={handleSave}>Save Changes</Button>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading text-lg">System Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email notifications</p>
                <p className="text-xs text-muted-foreground">Receive alerts for high plagiarism cases</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(v) => update("emailNotifications", v)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Plagiarism alerts</p>
                <p className="text-xs text-muted-foreground">Instant alerts when similarity exceeds threshold</p>
              </div>
              <Switch
                checked={settings.plagiarismAlerts}
                onCheckedChange={(v) => update("plagiarismAlerts", v)}
              />
            </div>
            <div className="space-y-2">
              <Label>Similarity threshold (%)</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={settings.similarityThreshold}
                onChange={(e) => update("similarityThreshold", Number(e.target.value))}
              />
            </div>
            <Button onClick={handleSave}>Save Preferences</Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
