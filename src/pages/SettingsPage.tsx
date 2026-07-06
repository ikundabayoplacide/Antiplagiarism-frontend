import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { apiGetSettings, apiUpdateSettings, type ApiSettings } from "@/lib/api";
import { getSession } from "@/lib/storage";
import { toast } from "sonner";

const SettingsPage = () => {
  const [settings, setSettings] = useState<ApiSettings>({
    fullName: "",
    email: "",
    emailNotifications: true,
    plagiarismAlerts: true,
    similarityThreshold: 30,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const session = getSession();
    apiGetSettings()
      .then((data) => {
        setSettings((prev) => ({
          ...prev,
          ...data,
          fullName: data.fullName || session?.fullName || "",
          email: data.email || session?.email || "",
        }));
      })
      .catch(() => {
        if (session) {
          setSettings((prev) => ({
            ...prev,
            fullName: session.fullName || "",
            email: session.email || "",
          }));
        }
        toast.error("Failed to load settings.");
      });
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
              <Switch checked={settings.emailNotifications} onCheckedChange={(v) => update("emailNotifications", v)} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Plagiarism alerts</p>
                <p className="text-xs text-muted-foreground">Alert when similarity exceeds threshold</p>
              </div>
              <Switch checked={settings.plagiarismAlerts} onCheckedChange={(v) => update("plagiarismAlerts", v)} />
            </div>
            <Button variant="outline" disabled={loading} onClick={() => handleSave({ emailNotifications: settings.emailNotifications, plagiarismAlerts: settings.plagiarismAlerts }, "Notifications")}>
              {loading ? "Saving…" : "Save Notifications"}
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
                onChange={(e) => update("similarityThreshold", Number(e.target.value) || 30)}
              />
              <p className="text-xs text-muted-foreground">Documents at or above this score are marked as flagged</p>
            </div>
            <Button disabled={loading} onClick={() => handleSave({ similarityThreshold: settings.similarityThreshold }, "Threshold")}>
              {loading ? "Saving…" : "Save Threshold"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
