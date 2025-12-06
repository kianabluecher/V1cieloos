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
        className="max-w-4xl max-h-[90vh] overflow-y-auto p-0"
        style={{ backgroundColor: '#111111', borderColor: '#333333', border: '1px solid #333333' }}
      >
        <DialogTitle className="sr-only">
          Design Request: {task.title}
        </DialogTitle>
        <DialogDescription className="sr-only">
          View design request details, leave comments, and approve the request. Request ID: {task.id}, Status: {getStatusText(task.status)}.
        </DialogDescription>
        
        {/* Header with Close Button */}
        <div className="sticky top-0 z-10 bg-[#111111] border-b border-border-subtle px-8 py-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className={getStatusColor(task.status)}>
                  {getStatusText(task.status)}
                </Badge>
                <span className="text-text-secondary text-sm">
                  #{task.id} • Created {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h2 className="text-white text-2xl">{task.title}</h2>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="h-9 w-9 p-0 text-text-secondary hover:text-white hover:bg-card-bg/50"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-8 py-6 space-y-6">
          {/* Request Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project Manager Card */}
            <Card className="border-border-subtle p-6" style={{ backgroundColor: '#1A1A1A' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-cyan-accent/10 rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-cyan-accent" />
                </div>
                <div>
                  <p className="text-text-secondary text-sm">Project Manager</p>
                  <p className="text-white">{projectManager.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={projectManager.avatar} alt={projectManager.name} />
                  <AvatarFallback className="bg-cyan-accent/10 text-cyan-accent text-xs">
                    {projectManager.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-text-secondary text-sm">{projectManager.email}</span>
              </div>
            </Card>

            {/* Due Date Card */}
            <Card className="border-border-subtle p-6" style={{ backgroundColor: '#1A1A1A' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-violet/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-violet" />
                </div>
                <div>
                  <p className="text-text-secondary text-sm">Due Date</p>
                  <p className="text-white">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    }) : 'Not set'}
                  </p>
                </div>
              </div>
              {task.dueDate && (
                <div className="flex items-center gap-2 mt-4 text-text-secondary text-sm">
                  <Clock className="h-4 w-4" />
                  <span>
                    {Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining
                  </span>
                </div>
              )}
            </Card>
          </div>

          {/* Description Section */}
          <Card className="border-border-subtle p-6" style={{ backgroundColor: '#1A1A1A' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-teal" />
              </div>
              <h3 className="text-white text-lg">Description</h3>
            </div>
            <div className="text-text-secondary leading-relaxed whitespace-pre-wrap">
              {task.description || 'No description provided.'}
            </div>
          </Card>

          <Separator className="bg-border-subtle" />

          {/* Comments Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-cyan-accent/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-cyan-accent" />
              </div>
              <h3 className="text-white text-lg">Comments & Feedback</h3>
            </div>

            {/* Existing Comments */}
            {comments.length > 0 && (
              <div className="space-y-4 mb-6">
                {comments.map((comment) => (
                  <Card key={comment.id} className="border-border-subtle p-4" style={{ backgroundColor: '#1A1A1A' }}>
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-cyan-accent/10 text-cyan-accent text-xs">
                          {comment.author[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white text-sm">{comment.author}</span>
                          <span className="text-text-secondary text-xs">
                            {comment.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-text-secondary text-sm">{comment.text}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Add Comment */}
            <Card className="border-border-subtle p-4" style={{ backgroundColor: '#1A1A1A' }}>
              <Textarea
                placeholder="Leave a comment or provide feedback..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px] bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary mb-3 resize-none"
                aria-label="Add a comment"
              />
              <div className="flex justify-end">
                <Button 
                  size="sm" 
                  className="bg-cyan-accent hover:bg-cyan-accent/90 text-dark-bg"
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Comment
                </Button>
              </div>
            </Card>
          </div>

          {/* Approval Actions */}
          {(task.status === 'waiting' || task.status === 'completed') && (
            <div className="pt-4">
              <Card className="border-green-500/20 p-6" style={{ backgroundColor: 'rgba(34, 197, 94, 0.05)' }}>
                <div className="flex items-center gap-4 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <div>
                    <h4 className="text-white">Ready for Approval</h4>
                    <p className="text-text-secondary text-sm">
                      Review the work and approve or request changes
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleApprove}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Request
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-border-subtle hover:bg-card-bg text-white hover:border-cyan-accent"
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
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Footer Padding */}
        <div className="h-6" />
      </DialogContent>
    </Dialog>
  );
}
