import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { User, Mail, Building2, Lock, Save, Camera, Link as LinkIcon, Key } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { api } from "../../utils/supabase/client";

type ManageProfilePageProps = {
  user: {
    name: string;
    email: string;
    companyName?: string;
    role?: string;
    userType: "client" | "team" | "management";
  };
  onSave: (data: any) => Promise<void>;
};

export function ManageProfilePage({ user, onSave }: ManageProfilePageProps) {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    companyName: user.companyName || "",
    role: user.role || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    liveDataUrl: "",
    liveDataApiKey: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingLiveData, setIsLoadingLiveData] = useState(true);

  // Load existing live data settings
  useEffect(() => {
    if (user.userType === "client") {
      loadLiveDataSettings();
    }
  }, [user.userType, user.email]);

  const loadLiveDataSettings = async () => {
    try {
      setIsLoadingLiveData(true);
      const response = await api.getLiveDataSettings(user.email);
      if (response.success && response.data) {
        setFormData(prev => ({
          ...prev,
          liveDataUrl: response.data.url || "",
          liveDataApiKey: response.data.apiKey || "",
        }));
      }
    } catch (error) {
      console.error("Error loading live data settings:", error);
    } finally {
      setIsLoadingLiveData(false);
    }
  };

  const handleSaveLiveData = async () => {
    if (!formData.liveDataUrl && !formData.liveDataApiKey) {
      toast.error("Please enter both URL and API key");
      return;
    }

    if (formData.liveDataUrl && !formData.liveDataApiKey) {
      toast.error("Please enter an API key");
      return;
    }

    if (!formData.liveDataUrl && formData.liveDataApiKey) {
      toast.error("Please enter a URL");
      return;
    }

    try {
      setIsSaving(true);
      const response = await api.saveLiveDataSettings({
        clientEmail: user.email,
        url: formData.liveDataUrl,
        apiKey: formData.liveDataApiKey,
      });

      if (response.success) {
        toast.success("Live data settings saved successfully");
      } else {
        toast.error(response.error || "Failed to save live data settings");
      }
    } catch (error) {
      console.error("Error saving live data settings:", error);
      toast.error("Failed to save live data settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required");
      return;
    }

    if (formData.newPassword || formData.confirmPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }
      if (formData.newPassword.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
    }

    setIsSaving(true);
    try {
      const dataToSave: any = {
        name: formData.name,
        email: formData.email,
      };

      if (user.userType === "client" && formData.companyName) {
        dataToSave.companyName = formData.companyName;
      }

      if ((user.userType === "team" || user.userType === "management") && formData.role) {
        dataToSave.role = formData.role;
      }

      if (formData.newPassword) {
        dataToSave.password = formData.newPassword;
      }

      await onSave(dataToSave);
      toast.success("Profile updated successfully");
      
      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl text-white mb-2">Manage Profile</h1>
        <p className="text-text-secondary">
          Update your personal information and account settings
        </p>
      </div>

      {/* Profile Picture Section */}
      <Card className="p-6 rounded-xl" style={{ backgroundColor: '#1A1A1B', borderColor: '#2A2A2B' }}>
        <h3 className="text-white mb-6">Profile Picture</h3>
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-cyan-accent/20">
              <AvatarFallback className="bg-gradient-to-br from-cyan-accent/20 to-violet/20 text-cyan-accent text-2xl">
                {getInitials(formData.name || "U")}
              </AvatarFallback>
            </Avatar>
            <button
              className="absolute bottom-0 right-0 w-8 h-8 bg-cyan-accent rounded-full flex items-center justify-center hover:bg-cyan-accent/80 transition-colors"
              disabled
            >
              <Camera className="h-4 w-4 text-dark-bg" />
            </button>
          </div>
          <div>
            <h4 className="text-white mb-1">{formData.name || "User"}</h4>
            <p className="text-text-secondary text-sm mb-3">
              {user.userType === "client"
                ? "Client Account"
                : user.userType === "management"
                ? "Management Account"
                : "Team Member"}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="border-border-subtle text-text-secondary hover:text-white hover:border-cyan-accent/30"
              disabled
            >
              Change Avatar (Coming Soon)
            </Button>
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card className="p-6 rounded-xl" style={{ backgroundColor: '#1A1A1B', borderColor: '#2A2A2B' }}>
        <h3 className="text-white mb-6">Personal Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                  style={{ backgroundColor: '#1A1A1A', borderColor: '#333333' }}
                  className="text-white placeholder:text-text-secondary pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  style={{ backgroundColor: '#1A1A1A', borderColor: '#333333' }}
                  className="text-white placeholder:text-text-secondary pl-10"
                />
              </div>
            </div>
          </div>

          {user.userType === "client" && (
            <div className="space-y-2">
              <Label className="text-white">Company Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <Input
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  placeholder="Your company"
                  style={{ backgroundColor: '#1A1A1A', borderColor: '#333333' }}
                  className="text-white placeholder:text-text-secondary pl-10"
                />
              </div>
            </div>
          )}

          {(user.userType === "team" || user.userType === "management") && (
            <div className="space-y-2">
              <Label className="text-white">Role</Label>
              <Input
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Your role"
                style={{ backgroundColor: '#1A1A1A', borderColor: '#333333' }}
                className="text-white placeholder:text-text-secondary"
                disabled={user.userType === "team"}
              />
              {user.userType === "team" && (
                <p className="text-xs text-text-secondary">
                  Contact management to change your role
                </p>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Security */}
      <Card className="p-6 rounded-xl" style={{ backgroundColor: '#1A1A1B', borderColor: '#2A2A2B' }}>
        <h3 className="text-white mb-2">Security</h3>
        <p className="text-sm text-text-secondary mb-6">
          Update your password to keep your account secure
        </p>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input
                type="password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                placeholder="Enter new password"
                style={{ backgroundColor: '#1A1A1A', borderColor: '#333333' }}
                className="text-white placeholder:text-text-secondary pl-10"
              />
            </div>
            <p className="text-xs text-text-secondary">
              Leave blank to keep your current password
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Confirm New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="Confirm new password"
                style={{ backgroundColor: '#1A1A1A', borderColor: '#333333' }}
                className="text-white placeholder:text-text-secondary pl-10"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Live Data Settings */}
      {user.userType === "client" && (
        <Card className="p-6 rounded-xl" style={{ backgroundColor: '#1A1A1B', borderColor: '#2A2A2B' }}>
          <h3 className="text-white mb-2">Live Data Settings</h3>
          <p className="text-sm text-text-secondary mb-6">
            Configure your live data feed
          </p>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Data URL</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <Input
                  value={formData.liveDataUrl}
                  onChange={(e) => setFormData({ ...formData, liveDataUrl: e.target.value })}
                  placeholder="Enter data URL"
                  style={{ backgroundColor: '#1A1A1A', borderColor: '#333333' }}
                  className="text-white placeholder:text-text-secondary pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">API Key</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <Input
                  value={formData.liveDataApiKey}
                  onChange={(e) => setFormData({ ...formData, liveDataApiKey: e.target.value })}
                  placeholder="Enter API key"
                  style={{ backgroundColor: '#1A1A1A', borderColor: '#333333' }}
                  className="text-white placeholder:text-text-secondary pl-10"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSaveLiveData}
              disabled={isSaving}
              className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg px-8"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Live Data Settings"}
            </Button>
          </div>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg px-8"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}