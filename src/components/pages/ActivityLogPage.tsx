import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback } from "../ui/avatar";
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
  Activity,
  LogIn,
  Eye,
  Edit,
  Plus,
  FileText,
  Users,
  Search,
  Filter,
  Download,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { api } from "../../utils/supabase/client";
import { toast } from "sonner@2.0.3";

type ActivityLog = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userType: "client" | "team" | "management";
  action: "sign_in" | "sign_out" | "task_viewed" | "task_edited" | "task_created" | "file_uploaded" | "client_viewed";
  description: string;
  metadata?: {
    taskId?: string;
    taskTitle?: string;
    clientId?: string;
    clientName?: string;
    ipAddress?: string;
  };
  timestamp: string;
};

type UserDetails = {
  userId: string;
  userName: string;
  userEmail: string;
  userType: "client" | "team" | "management";
  lastActivity: string;
  totalActivities: number;
  recentActivities: ActivityLog[];
};

export function ActivityLogPage() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityLog[]>([]);
  const [filterUser, setFilterUser] = useState("all");
  const [filterAction, setFilterAction] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("7days");
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);

  useEffect(() => {
    loadActivities();
    // Poll for new activities every 30 seconds
    const interval = setInterval(loadActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterActivities();
  }, [activities, filterUser, filterAction, searchQuery, dateRange]);

  const loadActivities = async () => {
    try {
      const response = await api.getActivityLogs();
      if (response.success && response.data) {
        setActivities(response.data);
      }
    } catch (error) {
      console.error("Error loading activities:", error);
    }
  };

  const filterActivities = () => {
    let filtered = [...activities];

    // Filter by user
    if (filterUser !== "all") {
      filtered = filtered.filter((a) => a.userType === filterUser);
    }

    // Filter by action
    if (filterAction !== "all") {
      filtered = filtered.filter((a) => a.action === filterAction);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.userName.toLowerCase().includes(query) ||
          a.userEmail.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query)
      );
    }

    // Filter by date range
    const now = new Date();
    const ranges: { [key: string]: number } = {
      "1day": 1,
      "7days": 7,
      "30days": 30,
      "90days": 90,
    };
    
    if (dateRange !== "all" && ranges[dateRange]) {
      const cutoffDate = new Date(now);
      cutoffDate.setDate(cutoffDate.getDate() - ranges[dateRange]);
      filtered = filtered.filter((a) => new Date(a.timestamp) >= cutoffDate);
    }

    // Sort by most recent first
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    setFilteredActivities(filtered);
  };

  const getActionIcon = (action: ActivityLog["action"]) => {
    switch (action) {
      case "sign_in":
      case "sign_out":
        return LogIn;
      case "task_viewed":
      case "client_viewed":
        return Eye;
      case "task_edited":
        return Edit;
      case "task_created":
        return Plus;
      case "file_uploaded":
        return FileText;
      default:
        return Activity;
    }
  };

  const handleUserClick = (activity: ActivityLog) => {
    const userActivities = activities.filter(a => a.userId === activity.userId);
    const sortedActivities = userActivities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    const userDetails: UserDetails = {
      userId: activity.userId,
      userName: activity.userName,
      userEmail: activity.userEmail,
      userType: activity.userType,
      lastActivity: sortedActivities[0]?.timestamp || activity.timestamp,
      totalActivities: userActivities.length,
      recentActivities: sortedActivities.slice(0, 10),
    };
    setSelectedUser(userDetails);
  };

  const getActionColor = (action: ActivityLog["action"]) => {
    switch (action) {
      case "sign_in":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "sign_out":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "task_viewed":
      case "client_viewed":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "task_edited":
        return "bg-cyan-accent/10 text-cyan-accent border-cyan-accent/20";
      case "task_created":
        return "bg-violet/10 text-violet border-violet/20";
      case "file_uploaded":
        return "bg-teal/10 text-teal border-teal/20";
      default:
        return "bg-text-secondary/10 text-text-secondary border-text-secondary/20";
    }
  };

  const getActionIconColor = (action: ActivityLog["action"]) => {
    switch (action) {
      case "sign_in":
        return "text-green-400";
      case "sign_out":
        return "text-orange-400";
      case "task_viewed":
      case "client_viewed":
        return "text-blue-400";
      case "task_edited":
        return "text-cyan-accent";
      case "task_created":
        return "text-violet";
      case "file_uploaded":
        return "text-teal";
      default:
        return "text-text-secondary";
    }
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case "client":
        return "bg-cyan-accent/10 text-cyan-accent border-cyan-accent/20";
      case "team":
        return "bg-teal/10 text-teal border-teal/20";
      case "management":
        return "bg-violet/10 text-violet border-violet/20";
      default:
        return "bg-text-secondary/10 text-text-secondary border-text-secondary/20";
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

  const exportToCSV = () => {
    const headers = ["Timestamp", "User", "Email", "Type", "Action", "Description"];
    const rows = filteredActivities.map((a) => [
      new Date(a.timestamp).toLocaleString(),
      a.userName,
      a.userEmail,
      a.userType,
      a.action,
      a.description,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-log-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Activity log exported");
  };

  // Calculate stats
  const signInsToday = activities.filter(
    (a) =>
      a.action === "sign_in" &&
      new Date(a.timestamp).toDateString() === new Date().toDateString()
  ).length;

  const uniqueUsers = new Set(activities.map((a) => a.userId)).size;

  const tasksViewedToday = activities.filter(
    (a) =>
      a.action === "task_viewed" &&
      new Date(a.timestamp).toDateString() === new Date().toDateString()
  ).length;

  const recentActivity = activities.filter(
    (a) => new Date().getTime() - new Date(a.timestamp).getTime() < 3600000
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl text-white mb-1">Activity Log</h2>
        <p className="text-text-secondary">
          Track user sign-ins, task views, and system activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <LogIn className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl text-white">{signInsToday}</p>
              <p className="text-sm text-text-secondary">Sign-ins Today</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-cyan-accent/10 to-cyan-accent/5 border-cyan-accent/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-cyan-accent/10 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-cyan-accent" />
            </div>
            <div>
              <p className="text-2xl text-white">{uniqueUsers}</p>
              <p className="text-sm text-text-secondary">Active Users</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Eye className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl text-white">{tasksViewedToday}</p>
              <p className="text-sm text-text-secondary">Tasks Viewed Today</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-violet/10 to-violet/5 border-violet/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-violet/10 rounded-xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-violet" />
            </div>
            <div>
              <p className="text-2xl text-white">{recentActivity}</p>
              <p className="text-sm text-text-secondary">Last Hour</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 glass-card border-border-subtle">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activities..."
              style={{ backgroundColor: '#1A1A1A', borderColor: '#333333' }}
              className="text-white placeholder:text-text-secondary pl-10"
            />
          </div>

          <Select value={filterUser} onValueChange={setFilterUser}>
            <SelectTrigger style={{ backgroundColor: '#1A1A1A', borderColor: '#333333' }} className="text-white w-[180px]">
              <SelectValue placeholder="User Type" />
            </SelectTrigger>
            <SelectContent className="rounded-lg" style={{ backgroundColor: '#1A1A1B', borderColor: '#2A2A2B' }}>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="client">Clients</SelectItem>
              <SelectItem value="team">Team</SelectItem>
              <SelectItem value="management">Management</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterAction} onValueChange={setFilterAction}>
            <SelectTrigger style={{ backgroundColor: '#1A1A1A', borderColor: '#333333' }} className="text-white w-[180px]">
              <SelectValue placeholder="Action Type" />
            </SelectTrigger>
            <SelectContent className="rounded-lg" style={{ backgroundColor: '#1A1A1B', borderColor: '#2A2A2B' }}>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="sign_in">Sign In</SelectItem>
              <SelectItem value="sign_out">Sign Out</SelectItem>
              <SelectItem value="task_viewed">Task Viewed</SelectItem>
              <SelectItem value="task_edited">Task Edited</SelectItem>
              <SelectItem value="task_created">Task Created</SelectItem>
              <SelectItem value="file_uploaded">File Uploaded</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger style={{ backgroundColor: '#1A1A1A', borderColor: '#333333' }} className="text-white w-[150px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent className="rounded-lg" style={{ backgroundColor: '#1A1A1B', borderColor: '#2A2A2B' }}>
              <SelectItem value="1day">Last 24 Hours</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={exportToCSV}
            className="border-border-subtle text-white hover:bg-cyan-accent/10 hover:border-cyan-accent/30"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </Card>

      {/* Activity Log Table */}
      <Card className="glass-card border-border-subtle">
        <div className="p-6 border-b border-border-subtle">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white">Activity Timeline</h4>
              <p className="text-text-secondary text-sm mt-1">
                {filteredActivities.length} activities found
              </p>
            </div>
            <Badge variant="outline" className="bg-cyan-accent/10 text-cyan-accent border-cyan-accent/20">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Live Tracking
            </Badge>
          </div>
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-card-bg z-10">
              <TableRow className="border-border-subtle hover:bg-transparent">
                <TableHead className="text-text-secondary w-[60px]"></TableHead>
                <TableHead className="text-text-secondary">User</TableHead>
                <TableHead className="text-text-secondary">Type</TableHead>
                <TableHead className="text-text-secondary">Action</TableHead>
                <TableHead className="text-text-secondary">Description</TableHead>
                <TableHead className="text-text-secondary">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.length === 0 ? (
                <TableRow className="border-border-subtle hover:bg-transparent">
                  <TableCell colSpan={6} className="text-center text-text-secondary py-8">
                    No activities found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredActivities.map((activity) => {
                  const ActionIcon = getActionIcon(activity.action);
                  return (
                    <TableRow 
                      key={activity.id} 
                      className="border-border-subtle hover:bg-card-bg/50 cursor-pointer"
                      onClick={() => handleUserClick(activity)}
                    >
                      <TableCell>
                        <Avatar className="w-8 h-8 border-2 border-cyan-accent/20">
                          <AvatarFallback className="bg-gradient-to-br from-cyan-accent/20 to-violet/20 text-cyan-accent text-xs">
                            {getInitials(activity.userName)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-white text-sm hover:text-cyan-accent transition-colors">{activity.userName}</div>
                          <div className="text-text-secondary text-xs">{activity.userEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getUserTypeColor(activity.userType)}>
                          {activity.userType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-card-bg border border-border-subtle">
                            <ActionIcon className={`h-4 w-4 ${getActionIconColor(activity.action)}`} />
                          </div>
                          <Badge variant="outline" className={getActionColor(activity.action)}>
                            {activity.action.replace("_", " ")}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-text-secondary max-w-md">
                        {activity.description}
                      </TableCell>
                      <TableCell className="text-text-secondary text-sm">
                        {new Date(activity.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* User Details Panel */}
      {selectedUser && (
        <Card className="glass-card border-cyan-accent/30">
          <div className="p-6 border-b border-border-subtle bg-gradient-to-r from-cyan-accent/5 to-violet/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-cyan-accent/30">
                  <AvatarFallback className="bg-gradient-to-br from-cyan-accent/20 to-violet/20 text-cyan-accent text-lg">
                    {getInitials(selectedUser.userName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-white">{selectedUser.userName}</h3>
                  <p className="text-text-secondary text-sm">{selectedUser.userEmail}</p>
                  <Badge variant="outline" className={`mt-2 ${getUserTypeColor(selectedUser.userType)}`}>
                    {selectedUser.userType}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedUser(null)}
                className="text-text-secondary hover:text-white"
              >
                Close
              </Button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-text-secondary text-sm mb-1">Total Activities</p>
                <p className="text-white text-2xl">{selectedUser.totalActivities}</p>
              </div>
              <div>
                <p className="text-text-secondary text-sm mb-1">Last Activity</p>
                <p className="text-white text-sm">
                  {new Date(selectedUser.lastActivity).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-text-secondary text-sm mb-1">User ID</p>
                <p className="text-white text-sm font-mono">{selectedUser.userId}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-white">Recent Activity</h4>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {selectedUser.recentActivities.map((activity) => {
                  const ActionIcon = getActionIcon(activity.action);
                  return (
                    <div
                      key={activity.id}
                      className="p-3 bg-card-bg rounded-lg border border-border-subtle"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-dark-bg border border-border-subtle flex-shrink-0">
                            <ActionIcon className={`h-4 w-4 ${getActionIconColor(activity.action)}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className={getActionColor(activity.action)}>
                                {activity.action.replace("_", " ")}
                              </Badge>
                            </div>
                            <p className="text-text-secondary text-sm">{activity.description}</p>
                          </div>
                        </div>
                        <span className="text-text-secondary text-xs flex-shrink-0">
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
