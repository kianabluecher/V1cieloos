import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Plus,
  Filter,
  Search,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  FolderKanban,
  MessageSquare,
  Bell,
  TrendingUp,
  ListChecks,
  HardDrive,
  Users,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { TaskDetailSheet } from "../TaskDetailSheet";

type Task = {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  assignee: string;
  reporter: string;
  project: string;
  dueDate: string;
  startDate: string;
  createdAt: string;
  labels: string[];
  subtasks: { id: string; title: string; completed: boolean }[];
  linkedItems: { id: string; title: string; type: string }[];
  comments: { id: string; author: string; content: string; timestamp: string }[];
  timeTracked: string;
};

type Notification = {
  id: string;
  taskId: string;
  taskTitle: string;
  author: string;
  content: string;
  timestamp: string;
  read: boolean;
};

type Project = {
  id: string;
  name: string;
  description: string;
  taskCount: number;
  openTasks: number;
  fileStorage: string;
  accountOwner: string;
  manager: string;
  color: string;
};

export function TaskManagementPage() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [projects] = useState<Project[]>([
    {
      id: "cielo-marketing",
      name: "CIELO Marketing Project",
      description: "Main marketing campaign and brand development",
      taskCount: 47,
      openTasks: 12,
      fileStorage: "2.4 GB",
      accountOwner: "Sarah Johnson",
      manager: "Mike Chen",
      color: "cyan-accent",
    },
    {
      id: "tech-startup",
      name: "Tech Startup Rebrand",
      description: "Complete brand overhaul for tech company",
      taskCount: 32,
      openTasks: 8,
      fileStorage: "1.8 GB",
      accountOwner: "David Park",
      manager: "Emily Watson",
      color: "violet",
    },
    {
      id: "ecommerce-platform",
      name: "E-commerce Platform Design",
      description: "UI/UX design for new platform launch",
      taskCount: 56,
      openTasks: 15,
      fileStorage: "3.2 GB",
      accountOwner: "Alex Rodriguez",
      manager: "Sarah Johnson",
      color: "teal",
    },
  ]);

  const [tasks] = useState<Task[]>([
    {
      id: "CIELO-123",
      title: "Design new brand guidelines for Q4 campaign",
      description: "Create comprehensive brand guidelines including color palette, typography, and logo usage for the upcoming Q4 marketing campaign.",
      status: "in-progress",
      priority: "high",
      assignee: "Sarah Johnson",
      reporter: "Mike Chen",
      project: "cielo-marketing",
      dueDate: "2024-11-15",
      startDate: "2024-10-20",
      createdAt: "2024-10-15T10:30:00Z",
      labels: ["design", "brand", "high-priority"],
      subtasks: [
        { id: "sub1", title: "Research color trends", completed: true },
        { id: "sub2", title: "Create mood boards", completed: true },
        { id: "sub3", title: "Draft guidelines", completed: false },
      ],
      linkedItems: [],
      comments: [
        {
          id: "c1",
          author: "Mike Chen",
          content: "Great progress on the mood boards!",
          timestamp: "2024-11-01T14:30:00Z",
        },
      ],
      timeTracked: "12h 30m",
    },
    {
      id: "CIELO-124",
      title: "Update social media templates",
      description: "Refresh all social media templates with new brand colors",
      status: "todo",
      priority: "medium",
      assignee: "Emily Watson",
      reporter: "Sarah Johnson",
      project: "cielo-marketing",
      dueDate: "2024-11-20",
      startDate: "2024-11-05",
      createdAt: "2024-10-20T09:00:00Z",
      labels: ["social", "design"],
      subtasks: [],
      linkedItems: [],
      comments: [],
      timeTracked: "0h",
    },
    {
      id: "TECH-45",
      title: "Develop logo concepts for tech startup",
      description: "Create 5 unique logo concepts exploring modern, minimal design directions",
      status: "review",
      priority: "urgent",
      assignee: "David Park",
      reporter: "Alex Rodriguez",
      project: "tech-startup",
      dueDate: "2024-11-10",
      startDate: "2024-10-25",
      createdAt: "2024-10-18T11:00:00Z",
      labels: ["logo", "design", "urgent"],
      subtasks: [
        { id: "sub1", title: "Sketch initial concepts", completed: true },
        { id: "sub2", title: "Digital mockups", completed: true },
        { id: "sub3", title: "Client presentation", completed: false },
      ],
      linkedItems: [],
      comments: [
        {
          id: "c2",
          author: "Alex Rodriguez",
          content: "The minimalist concepts are looking excellent. Client will love these!",
          timestamp: "2024-11-02T16:45:00Z",
        },
      ],
      timeTracked: "18h 15m",
    },
    {
      id: "ECOM-78",
      title: "Homepage hero section redesign",
      description: "Redesign the homepage hero section with improved CTAs and visual hierarchy",
      status: "in-progress",
      priority: "high",
      assignee: "Sarah Johnson",
      reporter: "Mike Chen",
      project: "ecommerce-platform",
      dueDate: "2024-11-12",
      startDate: "2024-10-28",
      createdAt: "2024-10-22T13:20:00Z",
      labels: ["ui", "homepage", "high-priority"],
      subtasks: [
        { id: "sub1", title: "Wireframes", completed: true },
        { id: "sub2", title: "High-fidelity mockups", completed: false },
      ],
      linkedItems: [],
      comments: [],
      timeTracked: "8h 45m",
    },
    {
      id: "CIELO-125",
      title: "Prepare monthly analytics report",
      description: "Compile and analyze marketing metrics for October",
      status: "todo",
      priority: "low",
      assignee: "Mike Chen",
      reporter: "Sarah Johnson",
      project: "cielo-marketing",
      dueDate: "2024-11-08",
      startDate: "2024-11-01",
      createdAt: "2024-10-28T10:00:00Z",
      labels: ["analytics", "reporting"],
      subtasks: [],
      linkedItems: [],
      comments: [],
      timeTracked: "0h",
    },
  ]);

  // Initialize notifications
  useState(() => {
    setNotifications([
      {
        id: "n1",
        taskId: "CIELO-123",
        taskTitle: "Design new brand guidelines for Q4 campaign",
        author: "Mike Chen",
        content: "Great progress on the mood boards!",
        timestamp: "2024-11-01T14:30:00Z",
        read: false,
      },
      {
        id: "n2",
        taskId: "TECH-45",
        taskTitle: "Develop logo concepts for tech startup",
        author: "Alex Rodriguez",
        content: "The minimalist concepts are looking excellent. Client will love these!",
        timestamp: "2024-11-02T16:45:00Z",
        read: false,
      },
    ]);
  });

  const filteredTasks = selectedProject
    ? tasks.filter((t) => t.project === selectedProject)
    : tasks;

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    toast.success("Task updated successfully");
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "high":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "low":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      default:
        return "bg-text-secondary/10 text-text-secondary border-text-secondary/20";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "in-progress":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "review":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "todo":
        return "bg-text-secondary/10 text-text-secondary border-text-secondary/20";
      default:
        return "bg-text-secondary/10 text-text-secondary border-text-secondary/20";
    }
  };

  // Calculate overall stats across all projects
  const allTasksByStatus = {
    todo: tasks.filter((t) => t.status === "todo"),
    "in-progress": tasks.filter((t) => t.status === "in-progress"),
    review: tasks.filter((t) => t.status === "review"),
    done: tasks.filter((t) => t.status === "done"),
  };

  const tasksByStatus = {
    todo: filteredTasks.filter((t) => t.status === "todo"),
    "in-progress": filteredTasks.filter((t) => t.status === "in-progress"),
    review: filteredTasks.filter((t) => t.status === "review"),
    done: filteredTasks.filter((t) => t.status === "done"),
  };

  const unreadNotifications = notifications.filter((n) => !n.read);

  return (
    <div className="space-y-6">
      {/* Task Summary Cards - Always visible at top */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-border-subtle" style={{ backgroundColor: '#1A1A1A' }}>
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-text-secondary/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-text-secondary" />
            </div>
            <div>
              <p className="text-2xl text-white">{allTasksByStatus.todo.length}</p>
              <p className="text-sm text-text-secondary">Open Tasks</p>
            </div>
          </div>
        </Card>
        
        <Card className="border-border-subtle" style={{ backgroundColor: '#1A1A1A' }}>
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl text-white">{allTasksByStatus["in-progress"].length}</p>
              <p className="text-sm text-text-secondary">In Progress</p>
            </div>
          </div>
        </Card>
        
        <Card className="border-border-subtle" style={{ backgroundColor: '#1A1A1A' }}>
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl text-white">{allTasksByStatus.review.length}</p>
              <p className="text-sm text-text-secondary">In Review</p>
            </div>
          </div>
        </Card>
        
        <Card className="border-border-subtle" style={{ backgroundColor: '#1A1A1A' }}>
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl text-white">{allTasksByStatus.done.length}</p>
              <p className="text-sm text-text-secondary">Completed</p>
            </div>
          </div>
        </Card>
      </div>



      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-white mb-1">Client Projects</h2>
          <p className="text-text-secondary">
            {selectedProject ? "Project tasks and details" : "Overview of all client projects"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedProject && (
            <Button
              variant="outline"
              onClick={() => setSelectedProject(null)}
              className="border-border-subtle text-white hover:bg-card-bg"
            >
              ← Back to All Projects
            </Button>
          )}
          {selectedProject && (
            <Button
              onClick={() => setIsCreateTaskOpen(true)}
              className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      {!selectedProject ? (
        /* Minimalistic Client/Project List Table */
        <div style={{ backgroundColor: '#2A2A2A' }} className="rounded-lg border border-border-subtle">
          <div className="px-6 py-4 border-b border-[#3A3A3A]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FolderKanban className="h-5 w-5 text-cyan-accent" />
                <h3 className="text-white">All Projects</h3>
                <Badge variant="secondary" className="bg-border-subtle/20 text-text-secondary">
                  {projects.length} Active
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Minimalistic table */}
          <div>
            {projects.map((project, index) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project.id)}
                className="px-6 py-5 hover:bg-cyan-accent/5 transition-colors cursor-pointer group"
                style={{ 
                  borderBottom: index < projects.length - 1 ? '1px solid #3A3A3A' : 'none'
                }}
              >
                <div className="flex items-center gap-6">
                  {/* Project name - 40% */}
                  <div className="flex-[2]">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ 
                          backgroundColor: project.color === 'cyan-accent' ? '#A6E0FF' : 
                                         project.color === 'violet' ? '#8B5CF6' : 
                                         project.color === 'teal' ? '#14B8A6' : '#A6E0FF' 
                        }} 
                      />
                      <div>
                        <h4 className="text-white group-hover:text-cyan-accent transition-colors">
                          {project.name}
                        </h4>
                        <p className="text-sm text-text-secondary mt-1">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Open tasks - 15% */}
                  <div className="flex-1">
                    <p className="text-white">{project.openTasks} open</p>
                    <p className="text-sm text-text-secondary">{project.taskCount} total</p>
                  </div>

                  {/* Owner - 20% */}
                  <div className="flex-1">
                    <p className="text-white">{project.accountOwner}</p>
                    <p className="text-sm text-text-secondary">Owner</p>
                  </div>

                  {/* Manager - 20% */}
                  <div className="flex-1">
                    <p className="text-white">{project.manager}</p>
                    <p className="text-sm text-text-secondary">Manager</p>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0">
                    <ChevronRight className="h-5 w-5 text-text-secondary group-hover:text-cyan-accent transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Kanban Board View for Selected Project */
        <div className="space-y-6">
          {/* Selected Project Summary */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="border-border-subtle" style={{ backgroundColor: '#1A1A1A' }}>
              <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-text-secondary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-text-secondary" />
                </div>
                <div>
                  <p className="text-2xl text-white">{tasksByStatus.todo.length}</p>
                  <p className="text-sm text-text-secondary">To Do</p>
                </div>
              </div>
            </Card>
            
            <Card className="border-border-subtle" style={{ backgroundColor: '#1A1A1A' }}>
              <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl text-white">{tasksByStatus["in-progress"].length}</p>
                  <p className="text-sm text-text-secondary">In Progress</p>
                </div>
              </div>
            </Card>
            
            <Card className="border-border-subtle" style={{ backgroundColor: '#1A1A1A' }}>
              <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl text-white">{tasksByStatus.review.length}</p>
                  <p className="text-sm text-text-secondary">In Review</p>
                </div>
              </div>
            </Card>
            
            <Card className="border-border-subtle" style={{ backgroundColor: '#1A1A1A' }}>
              <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl text-white">{tasksByStatus.done.length}</p>
                  <p className="text-sm text-text-secondary">Completed</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Kanban Board */}
          <div className="flex gap-4 overflow-x-auto pb-4">
            {/* To Do Column */}
            <div className="flex-1 min-w-[280px]">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-4 w-4 text-text-secondary" />
                <h3 className="text-sm text-white">To Do</h3>
                <Badge variant="secondary" className="text-xs">
                  {tasksByStatus.todo.length}
                </Badge>
              </div>
              <div className="space-y-3">
                {tasksByStatus.todo.map((task) => (
                  <Card
                    key={task.id}
                    onClick={() => handleTaskClick(task)}
                    className="p-3 bg-card-bg border-border-subtle hover:border-cyan-accent/30 transition-all cursor-pointer group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-text-secondary">{task.id}</span>
                          </div>
                          <h4 className="text-sm text-white group-hover:text-cyan-accent transition-colors leading-tight">
                            {task.title}
                          </h4>
                        </div>
                        <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <User className="h-3 w-3" />
                        <span>{task.assignee}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="flex-1 min-w-[280px]">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                <h3 className="text-sm text-white">In Progress</h3>
                <Badge variant="secondary" className="text-xs">
                  {tasksByStatus["in-progress"].length}
                </Badge>
              </div>
              <div className="space-y-3">
                {tasksByStatus["in-progress"].map((task) => (
                  <Card
                    key={task.id}
                    onClick={() => handleTaskClick(task)}
                    className="p-3 bg-card-bg border-border-subtle hover:border-cyan-accent/30 transition-all cursor-pointer group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-text-secondary">{task.id}</span>
                          </div>
                          <h4 className="text-sm text-white group-hover:text-cyan-accent transition-colors leading-tight">
                            {task.title}
                          </h4>
                        </div>
                        <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <User className="h-3 w-3" />
                        <span>{task.assignee}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* In Review Column */}
            <div className="flex-1 min-w-[280px]">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-4 w-4 text-purple-400" />
                <h3 className="text-sm text-white">In Review</h3>
                <Badge variant="secondary" className="text-xs">
                  {tasksByStatus.review.length}
                </Badge>
              </div>
              <div className="space-y-3">
                {tasksByStatus.review.map((task) => (
                  <Card
                    key={task.id}
                    onClick={() => handleTaskClick(task)}
                    className="p-3 bg-card-bg border-border-subtle hover:border-cyan-accent/30 transition-all cursor-pointer group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-text-secondary">{task.id}</span>
                          </div>
                          <h4 className="text-sm text-white group-hover:text-cyan-accent transition-colors leading-tight">
                            {task.title}
                          </h4>
                        </div>
                        <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <User className="h-3 w-3" />
                        <span>{task.assignee}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Done Column */}
            <div className="flex-1 min-w-[280px]">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <h3 className="text-sm text-white">Done</h3>
                <Badge variant="secondary" className="text-xs">
                  {tasksByStatus.done.length}
                </Badge>
              </div>
              <div className="space-y-3">
                {tasksByStatus.done.map((task) => (
                  <Card
                    key={task.id}
                    onClick={() => handleTaskClick(task)}
                    className="p-3 bg-card-bg border-border-subtle hover:border-cyan-accent/30 transition-all cursor-pointer group opacity-60"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-text-secondary">{task.id}</span>
                          </div>
                          <h4 className="text-sm text-white group-hover:text-cyan-accent transition-colors leading-tight line-through">
                            {task.title}
                          </h4>
                        </div>
                        <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <User className="h-3 w-3" />
                        <span>{task.assignee}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Sheet */}
      {selectedTask && (
        <TaskDetailSheet
          task={selectedTask}
          open={isTaskDetailOpen}
          onOpenChange={setIsTaskDetailOpen}
          onUpdate={handleUpdateTask}
        />
      )}

      {/* Create Task Dialog */}
      <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
        <DialogContent className="bg-card-bg border-border-subtle max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Task</DialogTitle>
            <DialogDescription className="text-text-secondary">
              Add a new task to the selected project
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-white">Task Title</Label>
              <Input
                placeholder="Enter task title"
                className="mt-2 bg-dark-bg border-border-subtle text-white"
              />
            </div>
            <div>
              <Label className="text-white">Description</Label>
              <Textarea
                placeholder="Task description"
                className="mt-2 bg-dark-bg border-border-subtle text-white"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Priority</Label>
                <Select>
                  <SelectTrigger className="mt-2 bg-dark-bg border-border-subtle text-white">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-card-bg border-border-subtle">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white">Assignee</Label>
                <Select>
                  <SelectTrigger className="mt-2 bg-dark-bg border-border-subtle text-white">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent className="bg-card-bg border-border-subtle">
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="mike">Mike Chen</SelectItem>
                    <SelectItem value="emily">Emily Watson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateTaskOpen(false)}
                className="border-border-subtle text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast.success("Task created successfully");
                  setIsCreateTaskOpen(false);
                }}
                className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
              >
                Create Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
