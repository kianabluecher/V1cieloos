import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
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
  User,
  Building2,
  Mail,
  Key,
  CreditCard,
  Calendar,
  FileText,
  Upload,
  Download,
  Trash2,
  Video,
  FileAudio,
  X,
  Edit,
  Save,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lock,
  Unlock,
  Package,
  Activity,
  Send,
  ArrowLeft,
  Reply,
  Image,
  Eye,
  StickyNote,
  Share2,
  Globe,
  ExternalLink,
} from "lucide-react";
import { api } from "../utils/supabase/client";
import { toast } from "sonner@2.0.3";
import { AttachmentPreviewDialog } from "./AttachmentPreviewDialog";

type Client = {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  status: "active" | "pending" | "inactive";
  createdAt: string;
  password?: string;
};

type ClientPlan = {
  clientId: string;
  plan: "starter" | "professional" | "enterprise";
  billingCycle: "monthly" | "annual";
  amount: number;
  status: "active" | "trial" | "cancelled";
  nextBillingDate: string;
  startDate: string;
};

type Recording = {
  id: string;
  title: string;
  date: string;
  duration: string;
  type: "video" | "audio";
  url?: string;
  transcript?: string;
};

type RecordingNote = {
  id: string;
  content: string;
  author: string;
  createdAt: string;
};

type Asset = {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
  uploadedAt: string;
};

type Service = {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "completed";
  startDate: string;
  addOns?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
};

type Contract = {
  id: string;
  title: string;
  value: number;
  status: "active" | "pending" | "expired";
  startDate: string;
  endDate: string;
  terms: string;
};

type Comment = {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  attachments?: Asset[];
  replies?: Comment[];
};

type Task = {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string;
  assignee?: string;
};

type ActivityLog = {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user: string;
};

type ClientDetailViewProps = {
  client: Client | null;
  onBack: () => void;
  viewMode: "team" | "management";
};

export function ClientDetailView({ client, onBack, viewMode }: ClientDetailViewProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [clientPlan, setClientPlan] = useState<ClientPlan | null>(null);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [recordingNotes, setRecordingNotes] = useState<Record<string, RecordingNote[]>>({});
  const [newRecordingNote, setNewRecordingNote] = useState<Record<string, string>>({});
  const [assets, setAssets] = useState<Asset[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    status: "active" as "active" | "pending" | "inactive",
  });

  const [portalSettings, setPortalSettings] = useState({
    socialMediaUrl: "https://share.plannthat.com/b/6f35260f05f20f99c0a9a88dff06ad11/2042127/grid",
    socialMediaLocked: false,
    brandWebUrl: "https://docs.google.com/spreadsheets/d/1MI7ynnujHwXN91pBVMdQuUmcvmVMI6Vgx4LxoMD9q6E/edit?usp=sharing",
    brandWebLocked: false,
  });

  const [planForm, setPlanForm] = useState({
    plan: "starter" as "starter" | "professional" | "enterprise",
    billingCycle: "monthly" as "monthly" | "annual",
    amount: 0,
    status: "active" as "active" | "trial" | "cancelled",
  });

  const canEdit = viewMode === "management";

  useEffect(() => {
    if (client) {
      setEditForm({
        name: client.name,
        email: client.email,
        password: client.password || "",
        companyName: client.companyName || "",
        status: client.status,
      });
      loadClientData();
    }
  }, [client]);

  const loadClientData = async () => {
    if (!client) return;
    
    try {
      // Load client plan
      const plansResponse = await api.getClientPlans();
      if (plansResponse.success) {
        const plan = plansResponse.data.find((p: any) => p.clientId === client.id);
        if (plan) {
          setClientPlan(plan);
          setPlanForm({
            plan: plan.plan,
            billingCycle: plan.billingCycle,
            amount: plan.amount,
            status: plan.status,
          });
        }
      }

      // Load recordings
      const recordingsResponse = await api.getRecordings();
      if (recordingsResponse.success) {
        const clientRecordings = recordingsResponse.data.filter(
          (r: any) => r.clientId === client.id
        );
        setRecordings(clientRecordings);
        
        // Load notes for each recording
        for (const recording of clientRecordings) {
          const notesResponse = await api.getRecordingNotes(recording.id);
          if (notesResponse.success) {
            setRecordingNotes(prev => ({
              ...prev,
              [recording.id]: notesResponse.data || []
            }));
          }
        }
      }

      // Load assets
      const assetsResponse = await api.getClientAssets(client.id);
      if (assetsResponse.success) {
        setAssets(assetsResponse.data || []);
      }

      // Load services
      const servicesResponse = await api.getClientServices(client.id);
      if (servicesResponse.success) {
        setServices(servicesResponse.data || []);
      }

      // Load contracts
      const contractsResponse = await api.getClientContracts(client.id);
      if (contractsResponse.success) {
        setContracts(contractsResponse.data || []);
      }

      // Load comments
      const commentsResponse = await api.getComments(client.id);
      if (commentsResponse.success) {
        setComments(commentsResponse.data || []);
      }

      // Load tasks
      const tasksResponse = await api.getTasks(client.id);
      if (tasksResponse.success) {
        setTasks(tasksResponse.data || []);
      }

      // Load activity log
      const activityResponse = await api.getClientActivity(client.id);
      if (activityResponse.success) {
        setActivityLog(activityResponse.data || []);
      }

      // Load portal settings
      const portalResponse = await api.getClientPortalSettingsByClientId(client.id);
      if (portalResponse.success && portalResponse.data) {
        setPortalSettings(portalResponse.data);
      }
    } catch (error) {
      console.error("Error loading client data:", error);
    }
  };

  const handleSaveClientInfo = async () => {
    if (!client) return;

    try {
      const response = await api.updateClient(client.id, editForm);
      if (response.success) {
        toast.success("Client updated successfully");
        setIsEditing(false);
      } else {
        toast.error("Failed to update client");
      }
    } catch (error) {
      toast.error("Failed to update client");
    }
  };

  const handleSavePortalSettings = async () => {
    if (!client) return;

    try {
      const response = await api.updateClientPortalSettings(client.id, portalSettings);
      if (response.success) {
        toast.success("Portal settings updated successfully");
      } else {
        toast.error("Failed to update portal settings");
      }
    } catch (error) {
      toast.error("Failed to update portal settings");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !client) return;

    try {
      const response = await api.uploadClientAsset(client.id, file, "Admin User");
      if (response.success) {
        toast.success("File uploaded successfully");
        await loadClientData();
      } else {
        toast.error("Failed to upload file");
      }
    } catch (error) {
      toast.error("Failed to upload file");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0 || !client) return;

    for (const file of files) {
      try {
        const response = await api.uploadClientAsset(client.id, file, "Admin User");
        if (response.success) {
          toast.success(`${file.name} uploaded successfully`);
        }
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    await loadClientData();
  };

  const handleAddRecordingNote = async (recordingId: string) => {
    const content = newRecordingNote[recordingId];
    if (!content?.trim()) return;

    try {
      const response = await api.addRecordingNote(recordingId, content, "Admin User");
      if (response.success) {
        toast.success("Note added");
        setNewRecordingNote(prev => ({ ...prev, [recordingId]: "" }));
        
        // Reload notes for this recording
        const notesResponse = await api.getRecordingNotes(recordingId);
        if (notesResponse.success) {
          setRecordingNotes(prev => ({
            ...prev,
            [recordingId]: notesResponse.data || []
          }));
        }
      } else {
        toast.error("Failed to add note");
      }
    } catch (error) {
      toast.error("Failed to add note");
    }
  };

  const handleDeleteRecordingNote = async (recordingId: string, noteId: string) => {
    if (!confirm("Delete this note?")) return;

    try {
      const response = await api.deleteRecordingNote(noteId);
      if (response.success) {
        toast.success("Note deleted");
        setRecordingNotes(prev => ({
          ...prev,
          [recordingId]: prev[recordingId]?.filter(n => n.id !== noteId) || []
        }));
      } else {
        toast.error("Failed to delete note");
      }
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !client) return;

    try {
      const response = await api.addComment(client.id, newComment, "Admin User");
      if (response.success) {
        toast.success("Comment added");
        setNewComment("");
        await loadClientData();
      }
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;

    try {
      const response = await api.deleteComment(commentId);
      if (response.success) {
        toast.success("Comment deleted");
        await loadClientData();
      }
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editingCommentContent.trim()) return;

    try {
      const response = await api.updateComment(commentId, editingCommentContent);
      if (response.success) {
        toast.success("Comment updated");
        setEditingCommentId(null);
        setEditingCommentContent("");
        await loadClientData();
      }
    } catch (error) {
      toast.error("Failed to update comment");
    }
  };

  const handleAddReply = async (parentId: string) => {
    if (!replyContent.trim() || !client) return;

    try {
      const response = await api.addComment(
        client.id,
        replyContent,
        "Admin User",
        [],
        parentId
      );
      if (response.success) {
        toast.success("Reply added");
        setReplyContent("");
        setReplyingToId(null);
        await loadClientData();
      }
    } catch (error) {
      toast.error("Failed to add reply");
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    if (!confirm("Delete this file?")) return;

    try {
      const response = await api.deleteClientAsset(assetId);
      if (response.success) {
        toast.success("File deleted");
        await loadClientData();
      }
    } catch (error) {
      toast.error("Failed to delete file");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/30";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/30";
      case "inactive":
      case "cancelled":
      case "expired":
        return "bg-red-500/10 text-red-500 border-red-500/30";
      case "trial":
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      case "completed":
        return "bg-cyan-accent/10 text-cyan-accent border-cyan-accent/30";
      default:
        return "bg-text-secondary/10 text-text-secondary border-text-secondary/30";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/30";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/30";
      case "low":
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      default:
        return "bg-text-secondary/10 text-text-secondary border-text-secondary/30";
    }
  };

  if (!client) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-text-secondary hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Button>
          <Separator orientation="vertical" className="h-6 bg-border-subtle" />
          <div>
            <h2 className="text-white text-xl">{editForm.companyName || client.name}</h2>
            <p className="text-text-secondary text-sm">{client.email}</p>
          </div>
          <Badge variant="secondary" className={getStatusColor(client.status)}>
            {client.status}
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-card-bg border border-border-subtle">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-cyan-accent/10 data-[state=active]:text-cyan-accent"
          >
            <User className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="data-[state=active]:bg-cyan-accent/10 data-[state=active]:text-cyan-accent"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger
            value="comments"
            className="data-[state=active]:bg-cyan-accent/10 data-[state=active]:text-cyan-accent"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Comments ({comments.length})
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="data-[state=active]:bg-cyan-accent/10 data-[state=active]:text-cyan-accent"
          >
            <Activity className="h-4 w-4 mr-2" />
            Activity
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Client Information */}
              <Card className="border-border-subtle p-4" style={{ backgroundColor: '#1A1A1A' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-cyan-accent" />
                    <h3 className="text-white">Client Information</h3>
                  </div>
                  {canEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-text-secondary hover:text-cyan-accent"
                    >
                      {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
                <Separator className="mb-3 bg-border-subtle" />

                <div className="space-y-3 text-sm">
                  {isEditing ? (
                    <>
                      <div>
                        <Label className="text-text-secondary">Name</Label>
                        <Input
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="mt-1 bg-dark-bg border-border-subtle text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-text-secondary">Email</Label>
                        <Input
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="mt-1 bg-dark-bg border-border-subtle text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-text-secondary">Company</Label>
                        <Input
                          value={editForm.companyName}
                          onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                          className="mt-1 bg-dark-bg border-border-subtle text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-text-secondary">Password</Label>
                        <Input
                          type="password"
                          value={editForm.password}
                          onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                          className="mt-1 bg-dark-bg border-border-subtle text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-text-secondary">Status</Label>
                        <Select
                          value={editForm.status}
                          onValueChange={(value: any) => setEditForm({ ...editForm, status: value })}
                        >
                          <SelectTrigger className="mt-1 bg-dark-bg border-border-subtle text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="border-border-subtle" style={{ backgroundColor: '#1A1A1A' }}>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={handleSaveClientInfo}
                        className="w-full bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-text-secondary mb-1">Name</p>
                        <p className="text-white">{client.name}</p>
                      </div>
                      <div>
                        <p className="text-text-secondary mb-1">Email</p>
                        <p className="text-white">{client.email}</p>
                      </div>
                      <div>
                        <p className="text-text-secondary mb-1">Company</p>
                        <p className="text-white">{editForm.companyName || "N/A"}</p>
                      </div>
                      {canEdit && (
                        <div>
                          <p className="text-text-secondary mb-1">Password</p>
                          <p className="text-white">••••••••</p>
                        </div>
                      )}
                      <div>
                        <p className="text-text-secondary mb-1">Joined</p>
                        <p className="text-white">
                          {new Date(client.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </Card>

              {/* Services */}
              <Card className="border-border-subtle p-4" style={{ backgroundColor: '#1A1A1A' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-4 w-4 text-cyan-accent" />
                  <h3 className="text-white">Services</h3>
                </div>
                <Separator className="mb-3 bg-border-subtle" />

                {services.length === 0 ? (
                  <div className="text-center py-6 text-text-secondary text-sm">
                    No active services
                  </div>
                ) : (
                  <div className="space-y-2">
                    {services.map((service) => (
                      <div key={service.id} className="p-2 bg-dark-bg rounded border border-border-subtle">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-white text-sm">{service.name}</p>
                          <Badge variant="secondary" className={getStatusColor(service.status)}>
                            {service.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-text-secondary">{service.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Tasks */}
              <Card className="border-border-subtle p-4" style={{ backgroundColor: '#1A1A1A' }}>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-4 w-4 text-cyan-accent" />
                  <h3 className="text-white">Tasks</h3>
                </div>
                <Separator className="mb-3 bg-border-subtle" />

                {tasks.length === 0 ? (
                  <div className="text-center py-6 text-text-secondary text-sm">
                    No tasks assigned
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <div key={task.id} className="p-2 bg-dark-bg rounded border border-border-subtle">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-white text-sm">{task.title}</p>
                          <div className="flex items-center gap-1">
                            <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                            <Badge variant="secondary" className={getStatusColor(task.status)}>
                              {task.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-text-secondary">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Portal Settings - Management Only */}
              {canEdit && (
                <Card className="border-border-subtle p-4" style={{ backgroundColor: '#1A1A1A' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="h-4 w-4 text-cyan-accent" />
                    <h3 className="text-white">Client Portal Settings</h3>
                  </div>
                  <Separator className="mb-3 bg-border-subtle" />

                  <div className="space-y-4">
                    {/* Social Media Settings */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-white flex items-center gap-2">
                          <Share2 className="h-3 w-3" />
                          Social Media URL
                        </Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPortalSettings(prev => ({ ...prev, socialMediaLocked: !prev.socialMediaLocked }))}
                          className="text-text-secondary hover:text-cyan-accent"
                        >
                          {portalSettings.socialMediaLocked ? (
                            <Lock className="h-4 w-4" />
                          ) : (
                            <Unlock className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <Input
                        value={portalSettings.socialMediaUrl}
                        onChange={(e) => setPortalSettings(prev => ({ ...prev, socialMediaUrl: e.target.value }))}
                        className="bg-dark-bg border-border-subtle text-white text-xs"
                        placeholder="https://..."
                      />
                      <p className="text-xs text-text-secondary flex items-center gap-1">
                        {portalSettings.socialMediaLocked ? (
                          <><Lock className="h-3 w-3" /> Locked for client</>
                        ) : (
                          <><Unlock className="h-3 w-3" /> Accessible by client</>
                        )}
                      </p>
                    </div>

                    {/* Brand & Web Settings */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-white flex items-center gap-2">
                          <Globe className="h-3 w-3" />
                          Brand & Web URL
                        </Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPortalSettings(prev => ({ ...prev, brandWebLocked: !prev.brandWebLocked }))}
                          className="text-text-secondary hover:text-cyan-accent"
                        >
                          {portalSettings.brandWebLocked ? (
                            <Lock className="h-4 w-4" />
                          ) : (
                            <Unlock className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <Input
                        value={portalSettings.brandWebUrl}
                        onChange={(e) => setPortalSettings(prev => ({ ...prev, brandWebUrl: e.target.value }))}
                        className="bg-dark-bg border-border-subtle text-white text-xs"
                        placeholder="https://..."
                      />
                      <p className="text-xs text-text-secondary flex items-center gap-1">
                        {portalSettings.brandWebLocked ? (
                          <><Lock className="h-3 w-3" /> Locked for client</>
                        ) : (
                          <><Unlock className="h-3 w-3" /> Accessible by client</>
                        )}
                      </p>
                    </div>

                    <Button
                      onClick={handleSavePortalSettings}
                      className="w-full bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
                      size="sm"
                    >
                      <Save className="h-3 w-3 mr-2" />
                      Save Portal Settings
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Recordings */}
              <Card className="border-border-subtle p-4" style={{ backgroundColor: '#1A1A1A' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Video className="h-4 w-4 text-cyan-accent" />
                  <h3 className="text-white">Recordings</h3>
                </div>
                <Separator className="mb-3 bg-border-subtle" />
                
                {recordings.length === 0 ? (
                  <div className="text-center py-6 text-text-secondary text-sm">
                    No recordings available
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recordings.map((recording) => (
                      <div key={recording.id} className="p-3 bg-dark-bg rounded border border-border-subtle">
                        <div className="flex items-start gap-2 mb-2">
                          <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${
                            recording.type === "video" ? "bg-violet/10" : "bg-cyan-accent/10"
                          }`}>
                            {recording.type === "video" ? (
                              <Video className="h-4 w-4 text-violet" />
                            ) : (
                              <FileAudio className="h-4 w-4 text-cyan-accent" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm mb-1">{recording.title}</p>
                            <div className="flex items-center gap-2 text-xs text-text-secondary">
                              <span>{new Date(recording.date).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>{recording.duration}</span>
                            </div>
                          </div>
                          {recording.url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(recording.url, "_blank")}
                              className="text-cyan-accent hover:text-cyan-accent/80"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          )}
                        </div>

                        {/* Notes Section for Management */}
                        {canEdit && (
                          <>
                            <Separator className="my-2 bg-border-subtle" />
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <StickyNote className="h-3 w-3 text-text-secondary" />
                                <p className="text-xs text-text-secondary">Notes</p>
                              </div>
                              
                              {/* Existing notes */}
                              {recordingNotes[recording.id]?.map((note) => (
                                <div key={note.id} className="p-2 bg-card-bg rounded text-xs">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className="text-white flex-1">{note.content}</p>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteRecordingNote(recording.id, note.id)}
                                      className="h-5 w-5 p-0 text-text-secondary hover:text-red-400"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <p className="text-text-secondary mt-1">
                                    {note.author} • {new Date(note.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              ))}

                              {/* Add note */}
                              <div className="flex gap-1">
                                <Textarea
                                  placeholder="Add a note..."
                                  value={newRecordingNote[recording.id] || ""}
                                  onChange={(e) => setNewRecordingNote(prev => ({
                                    ...prev,
                                    [recording.id]: e.target.value
                                  }))}
                                  className="text-xs bg-card-bg border-border-subtle text-white min-h-[60px]"
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleAddRecordingNote(recording.id)}
                                  className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Attachments */}
              <Card className="border-border-subtle p-4" style={{ backgroundColor: '#1A1A1A' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Upload className="h-4 w-4 text-cyan-accent" />
                  <h3 className="text-white">Attachments</h3>
                </div>
                <Separator className="mb-3 bg-border-subtle" />

                {/* Upload Area */}
                {canEdit && (
                  <div
                    className={`border-2 border-dashed rounded p-4 text-center mb-3 transition-all cursor-pointer ${
                      isDragging
                        ? "border-cyan-accent bg-cyan-accent/5"
                        : "border-border-subtle hover:border-cyan-accent/50"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    <Upload className={`h-8 w-8 mx-auto mb-2 ${
                      isDragging ? "text-cyan-accent" : "text-text-secondary"
                    }`} />
                    <p className="text-xs text-text-secondary">
                      Drop files here or click to upload
                    </p>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                )}

                {/* File List */}
                {assets.length === 0 ? (
                  <div className="text-center py-6 text-text-secondary text-sm">
                    No attachments
                  </div>
                ) : (
                  <div className="space-y-2">
                    {assets.map((asset) => (
                      <div
                        key={asset.id}
                        className="flex items-center gap-2 p-2 bg-dark-bg rounded border border-border-subtle hover:border-cyan-accent/30 transition-all cursor-pointer"
                        onClick={() => {
                          setPreviewAsset(asset);
                          setIsPreviewOpen(true);
                        }}
                      >
                        <div className="w-8 h-8 bg-cyan-accent/10 rounded flex items-center justify-center flex-shrink-0">
                          {asset.type?.startsWith("image/") ? (
                            <Image className="h-4 w-4 text-cyan-accent" />
                          ) : asset.type?.startsWith("video/") ? (
                            <Video className="h-4 w-4 text-cyan-accent" />
                          ) : (
                            <FileText className="h-4 w-4 text-cyan-accent" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs truncate">{asset.name}</p>
                          <p className="text-text-secondary text-xs">{asset.size}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewAsset(asset);
                              setIsPreviewOpen(true);
                            }}
                            className="h-6 w-6 p-0 text-text-secondary hover:text-cyan-accent"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          {canEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAsset(asset.id);
                              }}
                              className="h-6 w-6 p-0 text-text-secondary hover:text-red-400"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Current Plan */}
            <Card className="border-border-subtle p-4" style={{ backgroundColor: '#1A1A1A' }}>
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="h-4 w-4 text-cyan-accent" />
                <h3 className="text-white">Current Plan</h3>
              </div>
              <Separator className="mb-3 bg-border-subtle" />

              {clientPlan ? (
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-text-secondary mb-1">Plan</p>
                    <p className="text-white capitalize">{clientPlan.plan}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary mb-1">Billing Cycle</p>
                    <p className="text-white capitalize">{clientPlan.billingCycle}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary mb-1">Amount</p>
                    <p className="text-white">${clientPlan.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary mb-1">Status</p>
                    <Badge variant="secondary" className={getStatusColor(clientPlan.status)}>
                      {clientPlan.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-text-secondary mb-1">Next Billing Date</p>
                    <p className="text-white">
                      {new Date(clientPlan.nextBillingDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-text-secondary text-sm">
                  No billing plan configured
                </div>
              )}
            </Card>

            {/* Contracts */}
            <Card className="border-border-subtle p-4" style={{ backgroundColor: '#1A1A1A' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-cyan-accent" />
                  <h3 className="text-white">Contracts</h3>
                </div>
                {canEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-cyan-accent hover:text-cyan-accent/80"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <Separator className="mb-3 bg-border-subtle" />

              {contracts.length === 0 ? (
                <div className="text-center py-6 text-text-secondary text-sm">
                  No contracts on file
                </div>
              ) : (
                <div className="space-y-2">
                  {contracts.map((contract) => (
                    <div key={contract.id} className="p-2 bg-dark-bg rounded border border-border-subtle">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-white text-sm">{contract.title}</p>
                        <Badge variant="secondary" className={getStatusColor(contract.status)}>
                          {contract.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-text-secondary">
                        ${contract.value.toLocaleString()} • {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Comments Tab */}
        <TabsContent value="comments" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Add Comment */}
            {canEdit && (
              <Card className="border-border-subtle p-4" style={{ backgroundColor: '#1A1A1A' }}>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="h-4 w-4 text-cyan-accent" />
                  <h3 className="text-white">Add Comment</h3>
                </div>
                <Separator className="mb-3 bg-border-subtle" />

                <div className="space-y-3">
                  <Textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[100px] bg-dark-bg border-border-subtle text-white"
                  />
                  <Button
                    onClick={handleAddComment}
                    className="w-full bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
              </Card>
            )}

            {/* Comments List */}
            <Card className="border-border-subtle p-4 col-span-2" style={{ backgroundColor: '#1A1A1A' }}>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="h-4 w-4 text-cyan-accent" />
                <h3 className="text-white">All Comments</h3>
              </div>
              <Separator className="mb-3 bg-border-subtle" />

              {comments.length === 0 ? (
                <div className="text-center py-8 text-text-secondary text-sm">
                  No comments yet
                </div>
              ) : (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id}>
                      <div className="p-3 bg-dark-bg rounded border border-border-subtle">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-white text-sm">{comment.author}</p>
                              <span className="text-xs text-text-secondary">
                                {new Date(comment.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            {editingCommentId === comment.id ? (
                              <div className="space-y-2">
                                <Textarea
                                  value={editingCommentContent}
                                  onChange={(e) => setEditingCommentContent(e.target.value)}
                                  className="text-sm bg-card-bg border-border-subtle text-white"
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleEditComment(comment.id)}
                                    className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingCommentId(null)}
                                    className="text-text-secondary"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-text-secondary text-sm">{comment.content}</p>
                            )}
                          </div>
                          {canEdit && editingCommentId !== comment.id && (
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingCommentId(comment.id);
                                  setEditingCommentContent(comment.content);
                                }}
                                className="h-6 w-6 p-0 text-text-secondary hover:text-cyan-accent"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteComment(comment.id)}
                                className="h-6 w-6 p-0 text-text-secondary hover:text-red-400"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setReplyingToId(comment.id)}
                                className="h-6 w-6 p-0 text-text-secondary hover:text-cyan-accent"
                              >
                                <Reply className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Attachments */}
                        {comment.attachments && comment.attachments.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {comment.attachments.map((att) => (
                              <Button
                                key={att.id}
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setPreviewAsset(att);
                                  setIsPreviewOpen(true);
                                }}
                                className="text-xs border-border-subtle"
                              >
                                <Image className="h-3 w-3 mr-1" />
                                {att.name}
                              </Button>
                            ))}
                          </div>
                        )}

                        {/* Reply form */}
                        {replyingToId === comment.id && (
                          <div className="mt-3 pl-4 border-l-2 border-cyan-accent/30">
                            <Textarea
                              placeholder="Write a reply..."
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              className="text-sm bg-card-bg border-border-subtle text-white mb-2"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleAddReply(comment.id)}
                                className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
                              >
                                Reply
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setReplyingToId(null)}
                                className="text-text-secondary"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-3 pl-4 border-l-2 border-border-subtle space-y-2">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="p-2 bg-card-bg rounded">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-white text-xs">{reply.author}</p>
                                  <span className="text-xs text-text-secondary">
                                    {new Date(reply.timestamp).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-text-secondary text-xs">{reply.content}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card className="border-border-subtle p-4" style={{ backgroundColor: '#1A1A1A' }}>
            <div className="flex items-center gap-2 mb-3">
              <Activity className="h-4 w-4 text-cyan-accent" />
              <h3 className="text-white">Activity Log</h3>
            </div>
            <Separator className="mb-3 bg-border-subtle" />

            {activityLog.length === 0 ? (
              <div className="text-center py-8 text-text-secondary text-sm">
                No activity recorded
              </div>
            ) : (
              <div className="space-y-2">
                {activityLog.map((activity) => (
                  <div key={activity.id} className="p-3 bg-dark-bg rounded border border-border-subtle">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white text-sm">{activity.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <span>{activity.user}</span>
                      <span>•</span>
                      <span>{new Date(activity.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Attachment Preview Dialog */}
      <AttachmentPreviewDialog
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        attachment={previewAsset}
      />
    </div>
  );
}
