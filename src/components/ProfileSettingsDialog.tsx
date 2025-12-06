import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { User, Mail, Building2, Lock, Save } from "lucide-react";
import { toast } from "sonner@2.0.3";

type ProfileSettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userType: "client" | "team";
  currentUser: {
    name: string;
    email: string;
    companyName?: string;
    role?: string;
  };
  onSave: (data: any) => Promise<void>;
};

export function ProfileSettingsDialog({
  open,
  onOpenChange,
  userType,
  currentUser,
  onSave,
}: ProfileSettingsDialogProps) {
  const [formData, setFormData] = useState({
    name: currentUser.name || "",
    email: currentUser.email || "",
    companyName: currentUser.companyName || "",
    role: currentUser.role || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData({
      name: currentUser.name || "",
      email: currentUser.email || "",
      companyName: currentUser.companyName || "",
      role: currentUser.role || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [currentUser, open]);

  const handleSave = async () => {
    // Validate form
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required");
      return;
    }

    // Validate password change if attempted
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

      if (userType === "client" && formData.companyName) {
        dataToSave.companyName = formData.companyName;
      }

      if (userType === "team" && formData.role) {
        dataToSave.role = formData.role;
      }

      if (formData.newPassword) {
        dataToSave.password = formData.newPassword;
      }

      await onSave(dataToSave);
      toast.success("Profile updated successfully");
      onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" style={{ backgroundColor: '#0F0F0F', borderColor: '#333333', border: '1px solid #333333' }}>
        <DialogHeader>
          <DialogTitle className="text-white">Profile Settings</DialogTitle>
          <DialogDescription className="text-text-secondary">
            Update your profile information and account settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Picture Section */}
          <div className="flex items-center gap-6 p-6 bg-dark-bg rounded-lg border border-border-subtle">
            <Avatar className="h-20 w-20 border-2 border-cyan-accent/20">
              <AvatarFallback className="bg-cyan-accent/10 text-cyan-accent text-xl">
                {getInitials(formData.name || "U")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-white mb-1">{formData.name || "User"}</h4>
              <p className="text-text-secondary text-sm mb-3">
                {userType === "client" ? "Client Account" : "Team Member"}
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

          <Separator className="bg-border-subtle" />

          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="text-white">Personal Information</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                    className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary pl-10"
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
                    className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary pl-10"
                  />
                </div>
              </div>
            </div>

            {userType === "client" && (
              <div className="space-y-2">
                <Label className="text-white">Company Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <Input
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Your company"
                    className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary pl-10"
                  />
                </div>
              </div>
            )}

            {userType === "team" && (
              <div className="space-y-2">
                <Label className="text-white">Role</Label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Your role"
                  className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary"
                  disabled
                />
                <p className="text-xs text-text-secondary">
                  Contact management to change your role
                </p>
              </div>
            )}
          </div>

          <Separator className="bg-border-subtle" />

          {/* Change Password */}
          <div className="space-y-4">
            <h4 className="text-white">Change Password</h4>
            <p className="text-sm text-text-secondary">
              Leave blank to keep your current password
            </p>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-white">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <Input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    placeholder="Enter new password"
                    className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border-subtle text-text-secondary hover:text-white hover:border-cyan-accent/30"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
