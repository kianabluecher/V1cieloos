import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { InviteUserDialog } from "../InviteUserDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Users, Search, Mail, Calendar, Shield } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { api } from "../../utils/supabase/client";

type User = {
  id: string;
  email: string;
  name: string;
  userType: "client" | "team" | "management";
  role: string;
  status?: string;
  createdAt: string;
  lastLoginAt?: string;
  invitedBy?: string;
};

export function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get access token from session storage (this would come from auth context in a real app)
  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {
    loadUsers();
    
    // In a real implementation, get this from auth context
    // For now, we'll need to modify the flow
    const session = localStorage.getItem("cielo_session");
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        // You'll need to store the access token in session after login
        if (sessionData.accessToken) {
          setAccessToken(sessionData.accessToken);
        }
      } catch (error) {
        console.error("Error parsing session:", error);
      }
    }
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // Get access token from storage
      const session = localStorage.getItem("cielo_auth_token");
      if (!session) {
        toast.error("Not authenticated");
        return;
      }

      const result = await api.getAllUsers(session);
      
      if (result.success) {
        setUsers(result.data || []);
      } else {
        toast.error(result.error || "Failed to load users");
      }
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserTypeBadge = (userType: string) => {
    switch (userType) {
      case "management":
        return <Badge className="bg-violet/20 text-violet border-violet/20">Admin</Badge>;
      case "team":
        return <Badge className="bg-teal/20 text-teal border-teal/20">Team</Badge>;
      case "client":
        return <Badge className="bg-cyan-accent/20 text-cyan-accent border-cyan-accent/20">Client</Badge>;
      default:
        return <Badge variant="outline">{userType}</Badge>;
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status || status === "active") {
      return <Badge className="bg-green-500/20 text-green-500 border-green-500/20">Active</Badge>;
    }
    if (status === "invited") {
      return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/20">Pending</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-white mb-2">User Management</h1>
          <p className="text-text-secondary">
            Manage user accounts and permissions
          </p>
        </div>
        <InviteUserDialog
          accessToken={accessToken}
          onInviteSuccess={loadUsers}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card-bg border-border-subtle p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-accent/10 rounded-lg">
              <Users className="h-6 w-6 text-cyan-accent" />
            </div>
            <div>
              <p className="text-2xl text-white font-semibold">{users.length}</p>
              <p className="text-sm text-text-secondary">Total Users</p>
            </div>
          </div>
        </Card>

        <Card className="bg-card-bg border-border-subtle p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal/10 rounded-lg">
              <Shield className="h-6 w-6 text-teal" />
            </div>
            <div>
              <p className="text-2xl text-white font-semibold">
                {users.filter(u => u.userType === "team").length}
              </p>
              <p className="text-sm text-text-secondary">Team Members</p>
            </div>
          </div>
        </Card>

        <Card className="bg-card-bg border-border-subtle p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-violet/10 rounded-lg">
              <Mail className="h-6 w-6 text-violet" />
            </div>
            <div>
              <p className="text-2xl text-white font-semibold">
                {users.filter(u => u.status === "invited").length}
              </p>
              <p className="text-sm text-text-secondary">Pending Invites</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-card-bg border-border-subtle p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <Input
            type="text"
            placeholder="Search users by name, email, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary pl-10"
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card className="bg-card-bg border-border-subtle">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border-subtle hover:bg-dark-bg/50">
                <TableHead className="text-text-secondary">Name</TableHead>
                <TableHead className="text-text-secondary">Email</TableHead>
                <TableHead className="text-text-secondary">Type</TableHead>
                <TableHead className="text-text-secondary">Role</TableHead>
                <TableHead className="text-text-secondary">Status</TableHead>
                <TableHead className="text-text-secondary">Created</TableHead>
                <TableHead className="text-text-secondary">Last Login</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-text-secondary py-8">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-text-secondary py-8">
                    {searchTerm ? "No users found" : "No users yet. Invite your first user!"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-border-subtle hover:bg-dark-bg/50"
                  >
                    <TableCell className="text-white font-medium">
                      {user.name}
                    </TableCell>
                    <TableCell className="text-text-secondary">
                      {user.email}
                    </TableCell>
                    <TableCell>{getUserTypeBadge(user.userType)}</TableCell>
                    <TableCell className="text-text-secondary">
                      {user.role}
                    </TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-text-secondary text-sm">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="text-text-secondary text-sm">
                      {formatDate(user.lastLoginAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Info Card */}
      <Card className="bg-dark-bg border-cyan-accent/20 p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-cyan-accent mt-0.5" />
          <div>
            <p className="text-sm text-white mb-1">Google OAuth Setup Required</p>
            <p className="text-xs text-text-secondary">
              To enable Google sign-in, complete the OAuth setup at:{" "}
              <a 
                href="https://supabase.com/docs/guides/auth/social-login/auth-google"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-accent hover:underline"
              >
                Supabase Google OAuth Setup
              </a>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
