import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  UserPlus,
  Shield,
  Mail,
  Trash2,
  Edit,
  CheckCircle,
  Users,
} from "lucide-react";
import { api } from "../../utils/supabase/client";
import { toast } from "sonner@2.0.3";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "designer" | "strategist";
  status: "active" | "pending" | "inactive";
  joinedAt: string;
  permissions: string[];
};

export function ManagementPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isInviteTeamDialogOpen, setIsInviteTeamDialogOpen] = useState(false);

  // Invite team form
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    role: "designer" as "admin" | "manager" | "designer" | "strategist",
    permissions: [] as string[],
  });

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      const response = await api.getTeamMembers();
      if (response.success && response.data) {
        setTeamMembers(response.data);
      }
    } catch (error) {
      console.error("Error loading team members:", error);
    }
  };

  const handleInviteTeamMember = async () => {
    if (!inviteForm.name || !inviteForm.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await api.inviteTeamMember(inviteForm);
      if (response.success) {
        toast.success("Team member invited successfully");
        await loadTeamMembers();
        setIsInviteTeamDialogOpen(false);
        setInviteForm({
          name: "",
          email: "",
          role: "designer",
          permissions: [],
        });
      } else {
        toast.error(response.error || "Failed to invite team member");
      }
    } catch (error) {
      console.error("Error inviting team member:", error);
      toast.error("Failed to invite team member");
    }
  };

  const handleRemoveTeamMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this team member?")) {
      return;
    }

    try {
      const response = await api.removeTeamMember(memberId);
      if (response.success) {
        toast.success("Team member removed");
        await loadTeamMembers();
      } else {
        toast.error("Failed to remove team member");
      }
    } catch (error) {
      console.error("Error removing team member:", error);
      toast.error("Failed to remove team member");
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "manager":
        return "bg-violet/10 text-violet border-violet/20";
      case "designer":
        return "bg-cyan-accent/10 text-cyan-accent border-cyan-accent/20";
      case "strategist":
        return "bg-teal/10 text-teal border-teal/20";
      default:
        return "bg-text-secondary/10 text-text-secondary border-text-secondary/20";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "pending":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "inactive":
        return "bg-text-secondary/10 text-text-secondary border-text-secondary/20";
      default:
        return "bg-text-secondary/10 text-text-secondary border-text-secondary/20";
    }
  };

  const availablePermissions = [
    "manage_clients",
    "manage_tasks",
    "upload_documents",
    "view_billing",
    "manage_team",
    "edit_strategy",
    "view_analytics",
  ];

  const togglePermission = (permission: string) => {
    setInviteForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white">Team & Permissions</h3>
          <p className="text-text-secondary mt-1">
            Manage team members and access permissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-cyan-accent/10 text-cyan-accent border-cyan-accent/20">
            Management View
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="team" className="space-y-6">
        <TabsList className="bg-card-bg border border-border-subtle">
          <TabsTrigger value="team" className="data-[state=active]:bg-cyan-accent/10 data-[state=active]:text-cyan-accent">
            <Users className="h-4 w-4 mr-2" />
            Team Members
          </TabsTrigger>
          <TabsTrigger value="permissions" className="data-[state=active]:bg-cyan-accent/10 data-[state=active]:text-cyan-accent">
            <Shield className="h-4 w-4 mr-2" />
            Permissions
          </TabsTrigger>
        </TabsList>

        {/* Team Members Tab */}
        <TabsContent value="team" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white">Team Members</h4>
              <p className="text-text-secondary text-sm mt-1">
                Invite and manage your agency team members
              </p>
            </div>
            <Dialog open={isInviteTeamDialogOpen} onOpenChange={setIsInviteTeamDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Team Member
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl rounded-xl" style={{ backgroundColor: '#0F0F0F', borderColor: '#1F1F1F' }}>
                <DialogHeader>
                  <DialogTitle className="text-white">Invite Team Member</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Send an invitation to a new team member
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Name *</Label>
                      <Input
                        value={inviteForm.name}
                        onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                        placeholder="John Doe"
                        style={{ backgroundColor: '#0A0A0B', borderColor: '#1F1F1F' }}
                        className="text-white placeholder:text-text-secondary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Email *</Label>
                      <Input
                        type="email"
                        value={inviteForm.email}
                        onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                        placeholder="john@agency.com"
                        style={{ backgroundColor: '#0A0A0B', borderColor: '#1F1F1F' }}
                        className="text-white placeholder:text-text-secondary"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Role</Label>
                    <Select 
                      value={inviteForm.role}
                      onValueChange={(value: "admin" | "manager" | "designer" | "strategist") => 
                        setInviteForm({ ...inviteForm, role: value })
                      }
                    >
                      <SelectTrigger style={{ backgroundColor: '#0A0A0B', borderColor: '#1F1F1F' }} className="text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg" style={{ backgroundColor: '#0F0F0F', borderColor: '#1F1F1F' }}>
                        <SelectItem value="admin">Admin - Full access</SelectItem>
                        <SelectItem value="manager">Manager - Client & task management</SelectItem>
                        <SelectItem value="designer">Designer - Design tasks only</SelectItem>
                        <SelectItem value="strategist">Strategist - Strategy & analytics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Permissions</Label>
                    <div className="grid grid-cols-2 gap-2 p-4 border rounded-lg" style={{ backgroundColor: '#0A0A0B', borderColor: '#1F1F1F' }}>
                      {availablePermissions.map((permission) => (
                        <label
                          key={permission}
                          className="flex items-center gap-2 cursor-pointer text-[rgb(255,255,255)]"
                        >
                          <input
                            type="checkbox"
                            checked={inviteForm.permissions.includes(permission)}
                            onChange={() => togglePermission(permission)}
                            style={{ backgroundColor: '#0A0A0B', borderColor: '#1F1F1F' }}
                            className="w-4 h-4 rounded text-cyan-accent focus:ring-cyan-accent"
                          />
                          <span className="text-text-secondary text-sm">
                            {permission.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsInviteTeamDialogOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-[rgba(255,255,255,0)] hover:bg-cyan-accent/80 text-white"
                    onClick={handleInviteTeamMember}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invitation
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="glass-card border-border-subtle">
            <Table>
              <TableHeader>
                <TableRow className="border-border-subtle hover:bg-transparent">
                  <TableHead className="text-text-secondary">Name</TableHead>
                  <TableHead className="text-text-secondary">Email</TableHead>
                  <TableHead className="text-text-secondary">Role</TableHead>
                  <TableHead className="text-text-secondary">Status</TableHead>
                  <TableHead className="text-text-secondary">Joined</TableHead>
                  <TableHead className="text-text-secondary">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.length === 0 ? (
                  <TableRow className="border-border-subtle hover:bg-transparent">
                    <TableCell colSpan={6} className="text-center text-text-secondary py-8">
                      No team members yet. Invite your first team member to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  teamMembers.map((member) => (
                    <TableRow key={member.id} className="border-border-subtle hover:bg-card-bg/50">
                      <TableCell className="text-white">{member.name}</TableCell>
                      <TableCell className="text-text-secondary">{member.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getRoleColor(member.role)}>
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(member.status)}>
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-text-secondary">
                        {new Date(member.joinedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-text-secondary hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-text-secondary hover:text-red-400"
                            onClick={() => handleRemoveTeamMember(member.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <div>
            <h4 className="text-white">Role Permissions</h4>
            <p className="text-text-secondary text-sm mt-1">
              Manage what each role can do in the system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["admin", "manager", "designer", "strategist"].map((role) => (
              <Card key={role} className="p-6 glass-card border-border-subtle">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h5 className="text-white capitalize">{role}</h5>
                    <p className="text-text-secondary text-sm">
                      {role === "admin" && "Full system access"}
                      {role === "manager" && "Client & task management"}
                      {role === "designer" && "Design tasks only"}
                      {role === "strategist" && "Strategy & analytics"}
                    </p>
                  </div>
                  <Badge variant="secondary" className={getRoleColor(role)}>
                    {role}
                  </Badge>
                </div>
                <Separator className="bg-border-subtle mb-4" />
                <div className="space-y-2">
                  {availablePermissions.map((permission) => (
                    <div key={permission} className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">
                        {permission.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
