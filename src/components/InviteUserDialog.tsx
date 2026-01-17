import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { UserPlus, Copy, Check } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { api } from "../utils/supabase/client";

type InviteUserDialogProps = {
  accessToken: string;
  onInviteSuccess?: () => void;
};

export function InviteUserDialog({ accessToken, onInviteSuccess }: InviteUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState<"client" | "team" | "management">("client");
  const [isLoading, setIsLoading] = useState(false);
  const [inviteResult, setInviteResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleInvite = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    setIsLoading(true);
    try {
      const result = await api.inviteUser(accessToken, email, userType, name);
      
      if (result.success) {
        toast.success(`Invitation sent to ${email}`);
        setInviteResult(result.data);
        
        // Clear form
        setEmail("");
        setName("");
        setUserType("client");
        
        // Notify parent
        if (onInviteSuccess) {
          onInviteSuccess();
        }
      } else {
        toast.error(result.error || "Failed to invite user");
      }
    } catch (error) {
      console.error("Invite error:", error);
      toast.error("Failed to invite user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPassword = () => {
    if (inviteResult?.tempPassword) {
      navigator.clipboard.writeText(inviteResult.tempPassword);
      setCopied(true);
      toast.success("Password copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setInviteResult(null);
    setEmail("");
    setName("");
    setUserType("client");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg">
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card-bg border-border-subtle">
        <DialogHeader>
          <DialogTitle className="text-white">Invite New User</DialogTitle>
          <DialogDescription className="text-text-secondary">
            Send an invitation to a new user to join CIELO OS
          </DialogDescription>
        </DialogHeader>

        {inviteResult ? (
          <div className="space-y-4">
            <div className="p-4 bg-dark-bg rounded-lg border border-cyan-accent/20">
              <p className="text-sm text-text-secondary mb-2">
                User invited successfully! Here's their temporary password:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-black/30 rounded text-cyan-accent font-mono text-sm">
                  {inviteResult.tempPassword}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyPassword}
                  className="border-border-subtle"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-text-secondary mt-3">
                💡 Share this password securely with the new user. They can change it after first login.
              </p>
            </div>
            
            <DialogFooter>
              <Button onClick={handleClose} className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg">
                Done
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Name (Optional)
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userType" className="text-white">
                  User Type *
                </Label>
                <Select value={userType} onValueChange={(value: any) => setUserType(value)} disabled={isLoading}>
                  <SelectTrigger className="bg-dark-bg border-border-subtle text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card-bg border-border-subtle">
                    <SelectItem value="client" className="text-white hover:bg-dark-bg">
                      Client
                    </SelectItem>
                    <SelectItem value="team" className="text-white hover:bg-dark-bg">
                      Team Member
                    </SelectItem>
                    <SelectItem value="management" className="text-white hover:bg-dark-bg">
                      Administrator
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-text-secondary">
                  {userType === "client" && "Client users have limited access to their own data"}
                  {userType === "team" && "Team members can manage clients and tasks"}
                  {userType === "management" && "Administrators have full system access"}
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)} className="border-border-subtle text-white">
                Cancel
              </Button>
              <Button
                onClick={handleInvite}
                disabled={isLoading}
                className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
              >
                {isLoading ? "Sending..." : "Send Invitation"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
