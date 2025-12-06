import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import {
  X,
  Plus,
  User,
  Calendar,
  Clock,
  Tag,
  Link2,
  CheckSquare,
  MessageSquare,
  History,
  FileText,
  Settings,
  MoreVertical,
  Send,
  Zap,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

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

type TaskDetailSheetProps = {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (task: Task) => void;
  onAddComment: (taskId: string, comment: string) => void;
};

export function TaskDetailSheet({
  task,
  isOpen,
  onClose,
  onUpdate,
  onAddComment,
}: TaskDetailSheetProps) {
  const [editedTask, setEditedTask] = useState<Task | null>(task);
  const [commentText, setCommentText] = useState("");
  const [activeTab, setActiveTab] = useState("comments");

  if (!task || !editedTask) return null;

  const handleStatusChange = (status: Task["status"]) => {
    const updated = { ...editedTask, status };
    setEditedTask(updated);
    onUpdate(updated);
    toast.success("Status updated");
  };

  const handlePriorityChange = (priority: Task["priority"]) => {
    const updated = { ...editedTask, priority };
    setEditedTask(updated);
    onUpdate(updated);
    toast.success("Priority updated");
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    onAddComment(task.id, commentText);
    setCommentText("");
    toast.success("Comment added");
  };

  const handleAddSubtask = () => {
    const title = prompt("Enter subtask title:");
    if (!title) return;
    
    const updated = {
      ...editedTask,
      subtasks: [
        ...editedTask.subtasks,
        { id: Date.now().toString(), title, completed: false },
      ],
    };
    setEditedTask(updated);
    onUpdate(updated);
    toast.success("Subtask added");
  };

  const toggleSubtask = (subtaskId: string) => {
    const updated = {
      ...editedTask,
      subtasks: editedTask.subtasks.map((st) =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      ),
    };
    setEditedTask(updated);
    onUpdate(updated);
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "todo":
        return "text-text-secondary";
      case "in-progress":
        return "text-blue-400";
      case "review":
        return "text-orange-400";
      case "done":
        return "text-green-400";
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "low":
        return "bg-text-secondary/10 text-text-secondary border-text-secondary/20";
      case "medium":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "high":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "urgent":
        return "bg-red-500/10 text-red-400 border-red-500/20";
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
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="bg-dark-bg border-l border-border-subtle w-full sm:max-w-[900px] p-0 overflow-hidden"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-border-subtle bg-card-bg/50 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                <FileText className="h-4 w-4" />
                <span>{task.id}</span>
              </div>
              <SheetTitle className="text-white text-2xl pr-8">
                {editedTask.title}
              </SheetTitle>
            </div>
            <div className="flex items-center gap-2">
              <Select value={editedTask.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="bg-dark-bg border-border-subtle text-white w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card-bg border-border-subtle">
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                className="text-text-secondary hover:text-white"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-text-secondary hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        {/* Content Grid */}
        <div className="grid grid-cols-[1fr_320px] h-[calc(100vh-88px)]">
          {/* Left Column - Main Content */}
          <div className="overflow-y-auto p-6 space-y-6">
            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="text-white">Description</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-text-secondary hover:text-cyan-accent"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              {editedTask.description ? (
                <p className="text-text-secondary text-sm">
                  {editedTask.description}
                </p>
              ) : (
                <button className="text-sm text-text-secondary hover:text-cyan-accent transition-colors">
                  Add a description...
                </button>
              )}
            </div>

            <Separator className="bg-border-subtle" />

            {/* Subtasks */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-text-secondary" />
                  <h4 className="text-white">Subtasks</h4>
                  <Badge
                    variant="outline"
                    className="bg-card-bg text-text-secondary border-border-subtle"
                  >
                    {editedTask.subtasks.filter((st) => st.completed).length}/
                    {editedTask.subtasks.length}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddSubtask}
                  className="text-cyan-accent hover:text-cyan-accent hover:bg-cyan-accent/10 -mr-2"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
              
              {editedTask.subtasks.length > 0 ? (
                <div className="space-y-2">
                  {editedTask.subtasks.map((subtask) => (
                    <div
                      key={subtask.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-card-bg/50 transition-colors group"
                    >
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => toggleSubtask(subtask.id)}
                        className="w-4 h-4 rounded border-border-subtle bg-dark-bg checked:bg-cyan-accent checked:border-cyan-accent cursor-pointer"
                      />
                      <span
                        className={`text-sm flex-1 ${
                          subtask.completed
                            ? "text-text-secondary line-through"
                            : "text-white"
                        }`}
                      >
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <button
                  onClick={handleAddSubtask}
                  className="text-sm text-text-secondary hover:text-cyan-accent transition-colors"
                >
                  Add subtask
                </button>
              )}
            </div>

            <Separator className="bg-border-subtle" />

            {/* Linked Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-text-secondary" />
                  <h4 className="text-white">Linked work items</h4>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-cyan-accent hover:text-cyan-accent hover:bg-cyan-accent/10 -mr-2"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
              
              {editedTask.linkedItems.length > 0 ? (
                <div className="space-y-2">
                  {editedTask.linkedItems.map((item) => (
                    <Card
                      key={item.id}
                      className="p-3 bg-card-bg border-border-subtle hover:border-cyan-accent/30 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className="bg-cyan-accent/10 text-cyan-accent border-cyan-accent/20"
                        >
                          {item.type}
                        </Badge>
                        <span className="text-sm text-white">{item.title}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <button className="text-sm text-text-secondary hover:text-cyan-accent transition-colors">
                  Add linked work item
                </button>
              )}
            </div>

            <Separator className="bg-border-subtle" />

            {/* Activity Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-text-secondary" />
                <h4 className="text-white">Activity</h4>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-card-bg border border-border-subtle">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-cyan-accent/10 data-[state=active]:text-cyan-accent"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="comments"
                    className="data-[state=active]:bg-cyan-accent/10 data-[state=active]:text-cyan-accent"
                  >
                    Comments
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="data-[state=active]:bg-cyan-accent/10 data-[state=active]:text-cyan-accent"
                  >
                    History
                  </TabsTrigger>
                  <TabsTrigger
                    value="worklog"
                    className="data-[state=active]:bg-cyan-accent/10 data-[state=active]:text-cyan-accent"
                  >
                    Work log
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4 space-y-4">
                  {editedTask.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="w-8 h-8 border-2 border-cyan-accent/20">
                        <AvatarFallback className="bg-gradient-to-br from-cyan-accent/20 to-violet/20 text-cyan-accent text-xs">
                          {getInitials(comment.author)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white">{comment.author}</span>
                          <span className="text-xs text-text-secondary">
                            {new Date(comment.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="comments" className="mt-4 space-y-4">
                  {editedTask.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="w-8 h-8 border-2 border-cyan-accent/20">
                        <AvatarFallback className="bg-gradient-to-br from-cyan-accent/20 to-violet/20 text-cyan-accent text-xs">
                          {getInitials(comment.author)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white">{comment.author}</span>
                          <span className="text-xs text-text-secondary">
                            {new Date(comment.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="history" className="mt-4">
                  <p className="text-sm text-text-secondary">Task history will appear here</p>
                </TabsContent>

                <TabsContent value="worklog" className="mt-4">
                  <p className="text-sm text-text-secondary">Work logs will appear here</p>
                </TabsContent>
              </Tabs>

              {/* Comment Input */}
              <div className="flex gap-3 pt-2">
                <Avatar className="w-8 h-8 border-2 border-cyan-accent/20">
                  <AvatarFallback className="bg-gradient-to-br from-cyan-accent/20 to-violet/20 text-cyan-accent text-xs">
                    ME
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="bg-card-bg border-border-subtle text-white placeholder:text-text-secondary min-h-[80px] resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-text-secondary hover:text-cyan-accent text-xs px-2"
                      >
                        Who is working on this...?
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-text-secondary hover:text-cyan-accent text-xs px-2"
                      >
                        Can I get more info...?
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-text-secondary hover:text-cyan-accent text-xs px-2"
                      >
                        Status update...
                      </Button>
                    </div>
                    <Button
                      onClick={handleAddComment}
                      disabled={!commentText.trim()}
                      size="sm"
                      className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
                    >
                      <Send className="h-3 w-3 mr-1" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details Panel */}
          <div className="border-l border-border-subtle bg-card-bg/30 p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white">Details</h4>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-text-secondary hover:text-white"
              >
                <Settings className="h-3 w-3" />
              </Button>
            </div>

            {/* Assignee */}
            <div className="space-y-2">
              <Label className="text-text-secondary text-xs">Assignee</Label>
              {editedTask.assignee ? (
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6 border border-cyan-accent/20">
                    <AvatarFallback className="bg-gradient-to-br from-cyan-accent/20 to-violet/20 text-cyan-accent text-xs">
                      {getInitials(editedTask.assignee)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-white">{editedTask.assignee}</span>
                </div>
              ) : (
                <button className="text-sm text-text-secondary hover:text-cyan-accent transition-colors">
                  Unassigned - Assign to me
                </button>
              )}
            </div>

            {/* Reporter */}
            <div className="space-y-2">
              <Label className="text-text-secondary text-xs">Reporter</Label>
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6 border border-cyan-accent/20">
                  <AvatarFallback className="bg-gradient-to-br from-cyan-accent/20 to-violet/20 text-cyan-accent text-xs">
                    {getInitials(editedTask.reporter)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-white">{editedTask.reporter}</span>
              </div>
            </div>

            <Separator className="bg-border-subtle" />

            {/* Priority */}
            <div className="space-y-2">
              <Label className="text-text-secondary text-xs">Priority</Label>
              <Select value={editedTask.priority} onValueChange={handlePriorityChange}>
                <SelectTrigger className="bg-dark-bg border-border-subtle text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card-bg border-border-subtle">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Labels */}
            <div className="space-y-2">
              <Label className="text-text-secondary text-xs">Labels</Label>
              {editedTask.labels.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {editedTask.labels.map((label) => (
                    <Badge
                      key={label}
                      variant="outline"
                      className="bg-cyan-accent/10 text-cyan-accent border-cyan-accent/20"
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              ) : (
                <button className="text-sm text-text-secondary hover:text-cyan-accent transition-colors">
                  Add labels
                </button>
              )}
            </div>

            <Separator className="bg-border-subtle" />

            {/* Due Date */}
            <div className="space-y-2">
              <Label className="text-text-secondary text-xs">Due date</Label>
              {editedTask.dueDate ? (
                <div className="flex items-center gap-2 text-sm text-white">
                  <Calendar className="h-4 w-4 text-text-secondary" />
                  {new Date(editedTask.dueDate).toLocaleDateString()}
                </div>
              ) : (
                <button className="text-sm text-text-secondary hover:text-cyan-accent transition-colors">
                  Add due date
                </button>
              )}
            </div>

            {/* Time Tracking */}
            <div className="space-y-2">
              <Label className="text-text-secondary text-xs">Time tracking</Label>
              {editedTask.timeTracked ? (
                <div className="text-sm text-white">{editedTask.timeTracked}</div>
              ) : (
                <div className="text-sm text-text-secondary">No time logged</div>
              )}
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label className="text-text-secondary text-xs">Start date</Label>
              {editedTask.startDate ? (
                <div className="flex items-center gap-2 text-sm text-white">
                  <Calendar className="h-4 w-4 text-text-secondary" />
                  {new Date(editedTask.startDate).toLocaleDateString()}
                </div>
              ) : (
                <button className="text-sm text-text-secondary hover:text-cyan-accent transition-colors">
                  Add date
                </button>
              )}
            </div>

            <Separator className="bg-border-subtle" />

            {/* Created */}
            <div className="space-y-2">
              <Label className="text-text-secondary text-xs">Created</Label>
              <div className="text-sm text-text-secondary">
                {new Date(editedTask.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
