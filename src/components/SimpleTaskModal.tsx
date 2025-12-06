import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { 
  Plus, 
  Calendar as CalendarIcon,
  FileText,
  Image,
  Monitor,
  Palette,
  Layers,
  Smartphone,
  Globe,
  Printer,
  Megaphone,
  X
} from "lucide-react";

interface SimpleTaskModalProps {
  onSubmit?: (task: any) => void;
}

interface TaskData {
  title: string;
  description: string;
  type: string;
  dueDate?: Date;
  humanInLoop: boolean;
}

const requestTypes = [
  { id: 'print', label: 'Print', icon: Printer },
  { id: 'ad-creative', label: 'Ad Creative', icon: Megaphone },
  { id: 'landing-page', label: 'Landing Page', icon: Globe },
  { id: 'static', label: 'Static', icon: Image },
  { id: 'ui-element', label: 'UI Element', icon: Layers },
  { id: 'mobile-app', label: 'Mobile App', icon: Smartphone },
  { id: 'website', label: 'Website', icon: Monitor },
  { id: 'branding', label: 'Branding', icon: Palette },
];

export function SimpleTaskModal({ onSubmit }: SimpleTaskModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [taskData, setTaskData] = useState<TaskData>({
    title: '',
    description: '',
    type: '',
    dueDate: undefined,
    humanInLoop: true
  });

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        ...taskData,
        id: Date.now().toString(),
        status: 'queued',
        createdAt: new Date().toISOString()
      });
    }
    setIsOpen(false);
    setTaskData({
      title: '',
      description: '',
      type: '',
      dueDate: undefined,
      humanInLoop: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const canSubmit = taskData.title.trim() && taskData.description.trim() && taskData.type;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 glow-blue transition-all duration-300">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="max-w-3xl max-h-[90vh] overflow-y-auto" 
        style={{ backgroundColor: '#0A0A0B', borderColor: '#1F1F1F', border: '1px solid #1F1F1F' }}
      >
        <DialogHeader className="border-b border-border-subtle pb-4">
          <DialogTitle className="flex items-center gap-3 text-white text-xl">
            <Layers className="h-6 w-6" />
            TASK
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-6">
          {/* Issue Title */}
          <div className="space-y-3">
            <Label htmlFor="title" className="text-white text-base">Issue title</Label>
            <Input
              id="title"
              placeholder="Issue title"
              value={taskData.title}
              onChange={(e) => setTaskData(prev => ({ ...prev, title: e.target.value }))}
              className="bg-transparent border-border-subtle text-white placeholder:text-text-secondary focus:border-cyan-accent focus:ring-1 focus:ring-cyan-accent/20 transition-all duration-300 h-12"
            />
          </div>

          {/* Description */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-white text-base">Description</Label>
            <Textarea
              id="description"
              placeholder="Add description..."
              value={taskData.description}
              onChange={(e) => setTaskData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="bg-transparent border-border-subtle text-white placeholder:text-text-secondary focus:border-cyan-accent focus:ring-1 focus:ring-cyan-accent/20 transition-all duration-300 resize-none"
            />
          </div>

          {/* Request Type Buttons */}
          <div className="space-y-3">
            <Label className="text-white text-base">Request Type</Label>
            <div className="grid grid-cols-4 gap-3">
              {requestTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setTaskData(prev => ({ ...prev, type: type.id }))}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                      taskData.type === type.id
                        ? 'bg-cyan-accent/5 border-cyan-accent text-cyan-accent shadow-lg shadow-cyan-accent/20'
                        : 'bg-transparent border-border-subtle text-white hover:border-border-subtle hover:bg-white/5'
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm whitespace-nowrap">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-3">
            <Label className="text-white text-base">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-transparent border-border-subtle text-text-secondary hover:border-cyan-accent hover:text-white hover:bg-white/5 transition-all duration-300 h-12"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {taskData.dueDate ? formatDate(taskData.dueDate) : "Select due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-auto p-0" 
                align="start"
                style={{ backgroundColor: '#0A0A0B', borderColor: '#1F1F1F', border: '1px solid #1F1F1F' }}
              >
                <Calendar
                  mode="single"
                  selected={taskData.dueDate}
                  onSelect={(date) => setTaskData(prev => ({ ...prev, dueDate: date }))}
                  initialFocus
                  className="text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Execution Mode */}
          <div className="space-y-3">
            <Label className="text-white text-base">Execution mode</Label>
            <div className="flex items-center justify-between p-5 rounded-xl bg-dark-card border border-border-subtle">
              <div className="flex-1">
                <h4 className="text-white text-base mb-1">Human-in-the-loop</h4>
                <p className="text-sm text-text-secondary">Review and approve each step</p>
              </div>
              <Switch
                checked={taskData.humanInLoop}
                onCheckedChange={(checked) => setTaskData(prev => ({ ...prev, humanInLoop: checked }))}
                className="data-[state=checked]:bg-cyan-accent"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-border-subtle">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-white hover:text-cyan-accent hover:bg-cyan-accent/10">
                <FileText className="h-4 w-4 mr-2" />
                Attach files
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:text-cyan-accent hover:bg-cyan-accent/10">
                <Plus className="h-4 w-4 mr-2" />
                Create more
              </Button>
            </div>
            <Button 
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg disabled:opacity-50 disabled:cursor-not-allowed px-6"
            >
              Create issue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
