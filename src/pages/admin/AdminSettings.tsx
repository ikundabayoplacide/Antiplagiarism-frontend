import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { apiGetSettings, apiUpdateSettings, type ApiSettings } from "@/lib/api";
import { toast } from "sonner";

const AdminSettings = () => {
  const [settings, setSettings] = useState<ApiSettings>({
    fullName: "",
    email: "",
    emailNotifications: true,
    plagiarismAlerts: true,
    similarityThreshold: 30,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiGetSettings().then(setSettings).catch(() => toast.error("Failed to load settings."));
  }, []);

  const update = <K extends keyof ApiSettings>(key: K, value: ApiSettings[K]) =>
    setSettings((s) => ({ ...s, [key]: value }));

  const handleSave = async (fields: Partial<ApiSettings>, label: string) => {
    setLoading(true);
    try {
      const updated = await apiUpdateSettings(fields);
      setSettings(updated);
      toast.success(`${label} saved.`);
    } catch {
      toast.error(`Failed to save ${label.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
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
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={settings.fullName} onChange={(e) => update("fullName", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={settings.email} disabled className="bg-muted cursor-not-allowed text-muted-foreground" />
            </div>
            <Button disabled={loading} onClick={() => handleSave({ fullName: settings.fullName }, "Profile")}>
              {loading ? "Saving…" : "Save Changes"}
            </Button>
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
              <Switch checked={settings.emailNotifications} onCheckedChange={(v) => update("emailNotifications", v)} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Plagiarism alerts</p>
                <p className="text-xs text-muted-foreground">Instant alerts when similarity exceeds threshold</p>
              </div>
              <Switch checked={settings.plagiarismAlerts} onCheckedChange={(v) => update("plagiarismAlerts", v)} />
            </div>
            <div className="space-y-2">
              <Label>Similarity threshold (%)</Label>
              <Input
                type="number" min={1} max={100} className="w-32"
                value={settings.similarityThreshold}
                onChange={(e) => update("similarityThreshold", Number(e.target.value) || 30)}
              />
            </div>
            <Button variant="outline" disabled={loading}
              onClick={() => handleSave({ emailNotifications: settings.emailNotifications, plagiarismAlerts: settings.plagiarismAlerts, similarityThreshold: settings.similarityThreshold }, "Preferences")}>
              {loading ? "Saving…" : "Save Preferences"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
