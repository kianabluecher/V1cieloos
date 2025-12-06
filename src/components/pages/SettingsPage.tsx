import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { Bell, Moon, Mail, Shield, Database } from "lucide-react";

export function SettingsPage() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    taskUpdates: true,
    darkMode: true,
    twoFactorAuth: false,
    activityLog: true,
  });

  const updateSetting = (key: string, value: boolean) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl text-white mb-2">Settings</h1>
        <p className="text-text-secondary">
          Manage your account preferences and notification settings
        </p>
      </div>

      {/* Notifications */}
      <Card className="bg-card-bg border-border-subtle p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-cyan-accent/10 rounded-lg flex items-center justify-center">
            <Bell className="h-5 w-5 text-cyan-accent" />
          </div>
          <div>
            <h3 className="text-white">Notifications</h3>
            <p className="text-sm text-text-secondary">
              Manage how you receive updates
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <Label className="text-white">Email Notifications</Label>
              <p className="text-sm text-text-secondary mt-1">
                Receive updates via email
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                updateSetting("emailNotifications", checked)
              }
            />
          </div>

          <Separator className="bg-border-subtle" />

          <div className="flex items-center justify-between py-3">
            <div>
              <Label className="text-white">Push Notifications</Label>
              <p className="text-sm text-text-secondary mt-1">
                Get browser notifications for important updates
              </p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) =>
                updateSetting("pushNotifications", checked)
              }
            />
          </div>

          <Separator className="bg-border-subtle" />

          <div className="flex items-center justify-between py-3">
            <div>
              <Label className="text-white">Weekly Reports</Label>
              <p className="text-sm text-text-secondary mt-1">
                Receive weekly activity summaries
              </p>
            </div>
            <Switch
              checked={settings.weeklyReports}
              onCheckedChange={(checked) => updateSetting("weeklyReports", checked)}
            />
          </div>

          <Separator className="bg-border-subtle" />

          <div className="flex items-center justify-between py-3">
            <div>
              <Label className="text-white">Task Updates</Label>
              <p className="text-sm text-text-secondary mt-1">
                Get notified when tasks are updated
              </p>
            </div>
            <Switch
              checked={settings.taskUpdates}
              onCheckedChange={(checked) => updateSetting("taskUpdates", checked)}
            />
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <Card className="bg-card-bg border-border-subtle p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-violet/10 rounded-lg flex items-center justify-center">
            <Moon className="h-5 w-5 text-violet" />
          </div>
          <div>
            <h3 className="text-white">Appearance</h3>
            <p className="text-sm text-text-secondary">
              Customize your interface
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between py-3">
          <div>
            <Label className="text-white">Dark Mode</Label>
            <p className="text-sm text-text-secondary mt-1">
              Use dark theme (recommended)
            </p>
          </div>
          <Switch
            checked={settings.darkMode}
            onCheckedChange={(checked) => updateSetting("darkMode", checked)}
          />
        </div>
      </Card>

      {/* Security */}
      <Card className="bg-card-bg border-border-subtle p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-teal" />
          </div>
          <div>
            <h3 className="text-white">Security</h3>
            <p className="text-sm text-text-secondary">
              Keep your account secure
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <Label className="text-white">Two-Factor Authentication</Label>
              <p className="text-sm text-text-secondary mt-1">
                Add an extra layer of security (Coming Soon)
              </p>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onCheckedChange={(checked) =>
                updateSetting("twoFactorAuth", checked)
              }
              disabled
            />
          </div>

          <Separator className="bg-border-subtle" />

          <div className="flex items-center justify-between py-3">
            <div>
              <Label className="text-white">Activity Log</Label>
              <p className="text-sm text-text-secondary mt-1">
                Track login and account activity
              </p>
            </div>
            <Switch
              checked={settings.activityLog}
              onCheckedChange={(checked) => updateSetting("activityLog", checked)}
            />
          </div>
        </div>
      </Card>

      {/* Privacy */}
      <Card className="bg-card-bg border-border-subtle p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange/10 rounded-lg flex items-center justify-center">
            <Database className="h-5 w-5 text-orange" />
          </div>
          <div>
            <h3 className="text-white">Data & Privacy</h3>
            <p className="text-sm text-text-secondary">
              Manage your data preferences
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-text-secondary">
            Your data is encrypted and stored securely. We never share your
            information with third parties without your consent.
          </p>
          <p className="text-sm text-text-secondary">
            To request data export or account deletion, please contact your account
            manager.
          </p>
        </div>
      </Card>
    </div>
  );
}
