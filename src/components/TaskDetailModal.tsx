import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  X,
  Calendar,
  User,
  CheckCircle,
  MessageSquare,
  Send,
  Clock,
  FileText
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  type: string;
  status: 'queued' | 'running' | 'waiting' | 'completed';
  dueDate?: Date;
  humanInLoop: boolean;
  createdAt: string;
  projectManager?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (taskId: string) => void;
  onRequestChanges?: (taskId: string, feedback: string) => void;
}

export function TaskDetailModal({ task, isOpen, onClose, onApprove, onRequestChanges }: TaskDetailModalProps) {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Array<{ id: string; text: string; author: string; timestamp: Date }>>([]);

  if (!task) return null;

  // Default project manager if not specified
  const projectManager = task.projectManager || {
    name: "Sarah Johnson",
    email: "sarah.johnson@cielo.com",
    avatar: undefined
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'queued': return 'To Do';
      case 'running': return 'In Progress';
      case 'waiting': return 'In Review';
      case 'completed': return 'Completed';
      default: return 'To Do';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'queued': return 'bg-text-secondary/10 text-text-secondary border-text-secondary/20';
      case 'running': return 'bg-cyan-accent/10 text-cyan-accent border-cyan-accent/20';
      case 'waiting': return 'bg-orange-400/10 text-orange-400 border-orange-400/20';
      case 'completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-text-secondary/10 text-text-secondary border-text-secondary/20';
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now().toString(),
      text: newComment,
      author: 'You',
      timestamp: new Date()
    };
    
    setComments([...comments, comment]);
    setNewComment('');
  };

  const handleApprove = () => {
    if (onApprove) {
      onApprove(task.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl max-h-[85vh] overflow-hidden p-0 bg-background border border-border-subtle flex flex-col"
      >
        <DialogTitle className="sr-only">
          Design Request: {task.title}
        </DialogTitle>
        <DialogDescription className="sr-only">
          View design request details, leave comments, and approve the request. Request ID: {task.id}, Status: {getStatusText(task.status)}.
        </DialogDescription>
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-border-subtle">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={getStatusColor(task.status)}>
                {getStatusText(task.status)}
              </Badge>
              <span className="text-text-secondary text-sm">
                #{task.id}
              </span>
            </div>
            <div className="h-4 w-px bg-border-subtle" />
            <h2 className="text-foreground text-lg font-medium">{task.title}</h2>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose} 
            className="h-8 w-8 p-0 text-text-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content - Two Column Layout */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="grid grid-cols-3 gap-8">
            {/* Main Content - 2/3 width */}
            <div className="col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-foreground text-sm font-medium mb-3">Description</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {task.description || 'No description provided.'}
                </p>
              </div>

              {/* Comments */}
              <div>
                <h3 className="text-foreground text-sm font-medium mb-3">Comments</h3>
                
                {comments.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="border-l-2 border-border-subtle pl-4 py-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-foreground text-sm font-medium">{comment.author}</span>
                          <span className="text-text-secondary text-xs">
                            {comment.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-text-secondary text-sm">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px] bg-background border-border-subtle text-foreground placeholder:text-text-secondary resize-none mb-3"
                  aria-label="Add a comment"
                />
                <Button 
                  size="sm" 
                  className="bg-cyan-accent hover:bg-cyan-accent/90 text-dark-bg h-8 text-sm"
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  <Send className="h-3 w-3 mr-2" />
                  Send
                </Button>
              </div>
            </div>

            {/* Sidebar - 1/3 width */}
            <div className="space-y-6">
              {/* Metadata */}
              <div className="space-y-4">
                <div>
                  <p className="text-text-secondary text-xs mb-1">Project Manager</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={projectManager.avatar} alt={projectManager.name} />
                      <AvatarFallback className="bg-cyan-accent/10 text-cyan-accent text-xs">
                        {projectManager.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-foreground text-sm">{projectManager.name}</span>
                  </div>
                </div>

                <div className="h-px bg-border-subtle" />

                <div>
                  <p className="text-text-secondary text-xs mb-1">Due Date</p>
                  <p className="text-foreground text-sm">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    }) : 'Not set'}
                  </p>
                  {task.dueDate && (
                    <p className="text-text-secondary text-xs mt-1">
                      {Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining
                    </p>
                  )}
                </div>

                <div className="h-px bg-border-subtle" />

                <div>
                  <p className="text-text-secondary text-xs mb-1">Created</p>
                  <p className="text-foreground text-sm">
                    {new Date(task.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        {(task.status === 'waiting' || task.status === 'completed') && (
          <div className="border-t border-border-subtle px-8 py-4 bg-background">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Ready for approval</span>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border-subtle text-foreground hover:bg-muted h-8"
                  onClick={() => {
                    if (newComment.trim()) {
                      onRequestChanges && onRequestChanges(task.id, newComment);
                      setNewComment('');
                    } else {
                      alert('Please add a comment with your requested changes');
                    }
                  }}
                >
                  Request Changes
                </Button>
                <Button
                  size="sm"
                  onClick={handleApprove}
                  className="bg-green-500 hover:bg-green-600 text-white h-8"
                >
                  <CheckCircle className="h-3 w-3 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}