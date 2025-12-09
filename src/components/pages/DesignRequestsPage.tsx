import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { 
  Search, 
  Filter, 
  ArrowUpDown,
  Plus,
  Clock,
  Play,
  AlertCircle,
  CheckCircle,
  Palette,
  Globe,
  Monitor,
  Smartphone,
  Printer,
  Megaphone,
  Image,
  Layers,
  FileText,
  Calendar,
  User,
  Loader2,
  HelpCircle
} from "lucide-react";
import { SimpleTaskModal } from "../SimpleTaskModal";
import { TaskDetailModal } from "../TaskDetailModal";
import { api } from "../../utils/supabase/client";
import { toast } from "sonner@2.0.3";

interface Task {
  id: string;
  title: string;
  description: string;
  type: string;
  status: 'queued' | 'running' | 'waiting' | 'completed';
  dueDate?: Date;
  humanInLoop: boolean;
  createdAt: string;
}

export function DesignRequestsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      // Load both design requests and manual tasks
      const [requestsResponse, tasksResponse] = await Promise.all([
        api.getRequests(),
        api.getTasks()
      ]);
      
      let allTasks: Task[] = [];
      
      // Transform design requests to tasks format
      if (requestsResponse.success && requestsResponse.data) {
        const transformedRequests = requestsResponse.data.map((request: any) => ({
          id: request.id,
          title: request.title,
          description: request.description,
          type: request.additionalDetails?.designType || request.type || 'branding',
          status: request.status || 'queued',
          humanInLoop: request.type === 'design',
          createdAt: request.createdAt,
          dueDate: request.deadline ? new Date(request.deadline) : undefined
        }));
        allTasks = [...allTasks, ...transformedRequests];
      }
      
      // Transform manual tasks to tasks format
      if (tasksResponse.success && tasksResponse.data) {
        const transformedTasks = tasksResponse.data.map((task: any) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          type: 'task', // Mark as manual task
          status: task.status === 'todo' ? 'queued' : 
                  task.status === 'in-progress' ? 'running' : 
                  task.status === 'review' ? 'waiting' : 'completed',
          humanInLoop: true,
          createdAt: task.createdAt,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined
        }));
        allTasks = [...allTasks, ...transformedTasks];
      }
      
      // Sort by creation date, newest first
      allTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setTasks(allTasks);
      
      if (allTasks.length === 0) {
        // Load default demo tasks if no requests found
        setTasks([
          {
            id: '1',
            title: 'Marketing Strategy Proposal',
            description: 'Create comprehensive marketing strategy for Q3 campaign including competitive analysis, target audience research, and campaign recommendations.',
            type: 'ad-creative',
            status: 'completed',
            humanInLoop: true,
            createdAt: '2024-07-15T10:00:00Z',
            dueDate: new Date('2024-07-20')
          },
          {
            id: '2',
            title: 'Landing Page Redesign',
            description: 'Redesign main product landing page with improved conversion flow and modern UI components.',
            type: 'landing-page',
            status: 'running',
            humanInLoop: true,
            createdAt: '2024-07-16T11:00:00Z',
            dueDate: new Date('2024-07-25')
          },
          {
            id: '3',
            title: 'Brand Guidelines Update',
            description: 'Update brand guidelines document with new color palette, typography, and logo usage rules.',
            type: 'branding',
            status: 'waiting',
            humanInLoop: true,
            createdAt: '2024-07-16T12:00:00Z',
            dueDate: new Date('2024-07-22')
          },
          {
            id: '4',
            title: 'Mobile App UI Kit',
            description: 'Design comprehensive UI component library for mobile application with iOS and Android variants.',
            type: 'mobile-app',
            status: 'completed',
            humanInLoop: true,
            createdAt: '2024-07-15T13:00:00Z',
            dueDate: new Date('2024-07-18')
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewTask = async (taskData: any) => {
    try {
      // Convert to request format
      const requestData = {
        type: taskData.type || 'design',
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority || 'medium',
        deadline: taskData.dueDate,
        assignedAgent: 'design-team',
        additionalDetails: {
          designType: taskData.type,
          ...taskData
        }
      };

      const response = await api.createRequest(requestData);
      if (response.success) {
        // Add the new task to local state
        const newTask = {
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          type: response.data.additionalDetails?.designType || response.data.type,
          status: response.data.status || 'queued',
          humanInLoop: response.data.type === 'design',
          createdAt: response.data.createdAt,
          dueDate: response.data.deadline ? new Date(response.data.deadline) : undefined
        };
        setTasks(prev => [newTask, ...prev]);
        toast.success('Request created successfully');
      } else {
        toast.error('Failed to create request');
      }
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error('Failed to create request');
    }
  };

  const handleTaskClick = (task: Task) => {
    // Only show detail modal for in-progress or completed tasks
    if (task.status === 'running' || task.status === 'waiting' || task.status === 'completed') {
      setSelectedTask(task);
      setIsTaskDetailOpen(true);
    }
  };

  const handleApproveTask = async (taskId: string) => {
    try {
      const response = await api.updateRequest(taskId, { status: 'completed' });
      if (response.success) {
        setTasks(prev => prev.map(task => 
          task.id === taskId 
            ? { ...task, status: 'completed' as const }
            : task
        ));
        toast.success('Task approved successfully');
      } else {
        toast.error('Failed to approve task');
      }
    } catch (error) {
      console.error('Error approving task:', error);
      toast.error('Failed to approve task');
    }
  };

  const handleRequestChanges = async (taskId: string, feedback: string) => {
    try {
      const response = await api.updateRequest(taskId, { 
        status: 'running',
        feedback: feedback
      });
      if (response.success) {
        setTasks(prev => prev.map(task => 
          task.id === taskId 
            ? { ...task, status: 'running' as const }
            : task
        ));
        toast.success('Changes requested successfully');
      } else {
        toast.error('Failed to request changes');
      }
    } catch (error) {
      console.error('Error requesting changes:', error);
      toast.error('Failed to request changes');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'print': return <Printer className="h-3 w-3" />;
      case 'ad-creative': return <Megaphone className="h-3 w-3" />;
      case 'landing-page': return <Globe className="h-3 w-3" />;
      case 'static': return <Image className="h-3 w-3" />;
      case 'ui-element': return <Layers className="h-3 w-3" />;
      case 'mobile-app': return <Smartphone className="h-3 w-3" />;
      case 'website': return <Monitor className="h-3 w-3" />;
      case 'branding': return <Palette className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  const getStatusCounts = () => {
    return {
      queued: tasks.filter(t => t.status === 'queued').length,
      running: tasks.filter(t => t.status === 'running').length,
      waiting: tasks.filter(t => t.status === 'waiting').length,
      completed: tasks.filter(t => t.status === 'completed').length
    };
  };

  const statusCounts = getStatusCounts();

  const renderColumn = (status: 'queued' | 'running' | 'waiting' | 'completed', title: string, icon: React.ReactNode, count: number) => {
    const columnTasks = tasks.filter(t => t.status === status);
    const isEmpty = columnTasks.length === 0;

    return (
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h3 className="text-sm text-white">{title}</h3>
          <Badge variant="secondary" className="text-xs bg-cyan-accent/10 text-cyan-accent border-cyan-accent/20">
            {count}
          </Badge>
          <Button variant="ghost" size="sm" className="ml-auto text-cyan-accent hover:text-cyan-accent/80 hover:bg-cyan-accent/10">
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <div className="space-y-3">
          {status === 'queued' && isEmpty && (
            <Card className="p-4 border-2 border-dashed border-cyan-accent/30 hover:border-cyan-accent/50 transition-colors cursor-pointer bg-transparent">
              <div className="flex items-center justify-center">
                <SimpleTaskModal onSubmit={handleNewTask} />
              </div>
            </Card>
          )}

          {isEmpty && status !== 'queued' && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 bg-card-bg rounded-lg flex items-center justify-center mb-3">
                <Layers className="h-6 w-6 text-text-secondary" />
              </div>
              <p className="text-sm text-text-secondary">
                No tasks {status === 'running' ? 'running' : status === 'waiting' ? 'for review' : 'completed'}
              </p>
            </div>
          )}

          {columnTasks.map((task) => (
            <Card 
              key={task.id} 
              className={`p-3 transition-all duration-200 group border-border-subtle bg-card-bg ${
                task.status === 'running' || task.status === 'waiting' || task.status === 'completed'
                  ? 'hover:bg-cyan-accent/5 cursor-pointer hover:border-cyan-accent/30'
                  : 'hover:bg-card-bg/80'
              }`}
              onClick={() => handleTaskClick(task)}
            >
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center mt-0.5 ${
                    task.status === 'completed' 
                      ? 'bg-[#20C997]' 
                      : task.status === 'running'
                      ? 'bg-cyan-accent'
                      : task.status === 'waiting'
                      ? 'bg-orange-500'
                      : 'bg-text-secondary'
                  }`}>
                    {task.status === 'completed' ? (
                      <CheckCircle className="h-2.5 w-2.5 text-white" />
                    ) : task.status === 'running' ? (
                      <Play className="h-2.5 w-2.5 text-dark-bg" />
                    ) : task.status === 'waiting' ? (
                      <AlertCircle className="h-2.5 w-2.5 text-white" />
                    ) : (
                      <Clock className="h-2.5 w-2.5 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-text-secondary">TASK-{task.id}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        task.status === 'completed' ? 'bg-[#20C997]' :
                        task.status === 'running' ? 'bg-cyan-accent' :
                        task.status === 'waiting' ? 'bg-orange-500' :
                        'bg-text-secondary'
                      }`} />
                    </div>
                    <h4 className="text-sm leading-tight group-hover:text-cyan-accent transition-colors text-white">
                      {task.title}
                    </h4>
                  </div>
                </div>

                {task.type && (
                  <div className="flex items-center gap-1 text-xs text-text-secondary ml-6">
                    {getTypeIcon(task.type)}
                    <span className="capitalize">{task.type.replace('-', ' ')}</span>
                  </div>
                )}

                {task.dueDate && (
                  <div className="flex items-center gap-1 text-xs text-text-secondary ml-6">
                    <Calendar className="h-3 w-3" />
                    <span>{task.dueDate.toLocaleDateString()}</span>
                  </div>
                )}

                {task.status === 'completed' && (
                  <div className="flex items-center gap-1 text-xs text-text-secondary ml-6">
                    <span>24/24 steps</span>
                    <Clock className="h-3 w-3" />
                    <span>43m</span>
                  </div>
                )}

                {task.status === 'waiting' && (
                  <div className="flex items-center gap-1 text-xs text-orange-500 ml-6">
                    <AlertCircle className="h-3 w-3" />
                    <span>Ready for review</span>
                  </div>
                )}

                {task.humanInLoop && (
                  <div className="flex items-center gap-1 text-xs text-cyan-accent ml-6">
                    <User className="h-3 w-3" />
                    <span>Expert in loop</span>
                  </div>
                )}

                <div className="flex items-center justify-between ml-6 mt-2">
                  {(task.status === 'running' || task.status === 'waiting' || task.status === 'completed') && (
                    <div className="text-xs text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to view details and chat
                    </div>
                  )}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-dashed border-cyan-accent/50 hover:border-cyan-accent hover:bg-cyan-accent/10 transition-all ml-auto"
                        >
                          <div className="flex gap-0.5">
                            <span className="w-1 h-1 rounded-full bg-cyan-accent"></span>
                            <span className="w-1 h-1 rounded-full bg-cyan-accent"></span>
                            <span className="w-1 h-1 rounded-full bg-cyan-accent"></span>
                          </div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Explain this task</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-accent" />
        <span className="ml-2 text-white">Loading tasks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-white">Design Requests</h3>
            <Badge variant="secondary" className="bg-cyan-accent/10 text-cyan-accent border-cyan-accent/20">
              Beta
            </Badge>
          </div>
          <p className="text-sm text-text-secondary mt-1">Track and manage your design requests across different stages of completion.</p>
        </div>
        <SimpleTaskModal onSubmit={handleNewTask} />
      </div>

      {/* Search and Filters */}\n      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
          <Input placeholder="Search requests..." className="pl-9 bg-card-bg border-border-subtle text-white" />
        </div>
        <Button variant="outline" className="border-border-subtle text-white hover:bg-cyan-accent/10 hover:text-cyan-accent">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline" className="border-border-subtle text-white hover:bg-cyan-accent/10 hover:text-cyan-accent">
          <ArrowUpDown className="h-4 w-4 mr-2" />
          Sort
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden">
        <div className="flex gap-6 h-full">
          {renderColumn('queued', 'Queued', <Clock className="h-4 w-4 text-text-secondary" />, statusCounts.queued)}
          {renderColumn('running', 'In Progress', <Play className="h-4 w-4 text-cyan-accent" />, statusCounts.running)}
          {renderColumn('waiting', 'Ready for Review', <AlertCircle className="h-4 w-4 text-orange-500" />, statusCounts.waiting)}
          {renderColumn('completed', 'Completed', <CheckCircle className="h-4 w-4 text-[#20C997]" />, statusCounts.completed)}
        </div>
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={isTaskDetailOpen}
        onClose={() => {
          setIsTaskDetailOpen(false);
          setSelectedTask(null);
        }}
        onApprove={handleApproveTask}
        onRequestChanges={handleRequestChanges}
      />
    </div>
  );
}
