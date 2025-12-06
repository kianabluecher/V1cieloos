import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
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
  Building2,
  Users,
  FileText,
  Upload,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Link as LinkIcon,
  Trash2,
  Download,
  Mail,
  Save,
  UserPlus,
  MessageSquare,
  Eye,
} from "lucide-react";
import { ClientDetailView } from "../ClientDetailView";
import { api } from "../../utils/supabase/client";
import { toast } from "sonner@2.0.3";

type Client = {
  id: string;
  name: string;
  email: string;
  password?: string;
  companyName?: string;
  status: "active" | "pending" | "inactive";
  projectCount: number;
  lastActivity: string;
  createdAt?: string;
};

type StrategyDocument = {
  id: string;
  clientId: string;
  title: string;
  type: "pdf" | "link" | "document";
  url?: string;
  file?: File;
  uploadedBy: string;
  uploadedAt: string;
  category: "strategy" | "report" | "analysis" | "other";
  description: string;
};

type Task = {
  id: string;
  clientId: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "completed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
};

type AgencyDashboardPageProps = {
  activeSection: string;
  viewMode?: "team" | "management";
};

export function AgencyDashboardPage({ activeSection, viewMode = "team" }: AgencyDashboardPageProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [selectedClientForDetail, setSelectedClientForDetail] = useState<Client | null>(null);
  const [showClientDetail, setShowClientDetail] = useState(false);
  const [documents, setDocuments] = useState<StrategyDocument[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isEditClientDialogOpen, setIsEditClientDialogOpen] = useState(false);
  const [isCreateClientDialogOpen, setIsCreateClientDialogOpen] = useState(false);
  const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: "",
    type: "pdf" as "pdf" | "link" | "document",
    url: "",
    category: "strategy" as "strategy" | "report" | "analysis" | "other",
    description: "",
    file: null as File | null,
  });

  // New client form state
  const [newClientForm, setNewClientForm] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
  });

  // Edit client form state
  const [editClientForm, setEditClientForm] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    status: "active" as "active" | "pending" | "inactive",
  });

  // New task form state
  const [newTaskForm, setNewTaskForm] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    dueDate: "",
  });

  useEffect(() => {
    loadClients();
    loadDocuments();
    loadTasks();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      loadDocuments();
      loadTasks();
    }
  }, [selectedClient]);

  const loadClients = async () => {
    try {
      const response = await api.getClients();
      if (response.success && response.data) {
        setClients(response.data);
        if (response.data.length > 0 && !selectedClient) {
          setSelectedClient(response.data[0].id);
        }
      }
    } catch (error) {
      console.error("Error loading clients:", error);
    }
  };

  const loadDocuments = async () => {
    try {
      const response = await api.getStrategy();
      if (response.success && response.data?.documents) {
        setDocuments(response.data.documents.filter(
          (doc: StrategyDocument) => doc.clientId === selectedClient
        ));
      }
    } catch (error) {
      console.error("Error loading documents:", error);
    }
  };

  const loadTasks = async () => {
    try {
      const response = await api.getTasks();
      if (response.success && response.data) {
        setTasks(response.data.filter(
          (task: Task) => task.clientId === selectedClient
        ));
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const handleCreateClient = async () => {
    if (!newClientForm.name || !newClientForm.email || !newClientForm.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await api.createClient(newClientForm);
      if (response.success) {
        toast.success("Client created successfully");
        
        // Send invitation email
        const inviteResponse = await api.sendClientInvitation(response.data.id);
        if (inviteResponse.success) {
          toast.success("Invitation email sent");
        } else {
          toast.warning("Client created but invitation email failed to send");
        }

        await loadClients();
        setIsCreateClientDialogOpen(false);
        setNewClientForm({
          name: "",
          email: "",
          password: "",
          companyName: "",
        });
      } else {
        toast.error(response.error || "Failed to create client");
      }
    } catch (error) {
      console.error("Error creating client:", error);
      toast.error("Failed to create client");
    }
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setEditClientForm({
      name: client.name,
      email: client.email,
      password: "",
      companyName: client.companyName || "",
      status: client.status,
    });
    setIsEditClientDialogOpen(true);
  };

  const handleUpdateClient = async () => {
    if (!editingClient) return;

    if (!editClientForm.name || !editClientForm.email) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      const updateData: any = {
        name: editClientForm.name,
        email: editClientForm.email,
        companyName: editClientForm.companyName,
        status: editClientForm.status,
      };

      // Only include password if it was changed
      if (editClientForm.password) {
        updateData.password = editClientForm.password;
      }

      const response = await api.updateClient(editingClient.id, updateData);
      if (response.success) {
        toast.success("Client updated successfully");
        await loadClients();
        setIsEditClientDialogOpen(false);
        setEditingClient(null);
      } else {
        toast.error(response.error || "Failed to update client");
      }
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error("Failed to update client");
    }
  };

  const handleResendInvitation = async (clientId: string) => {
    try {
      const response = await api.sendClientInvitation(clientId);
      if (response.success) {
        toast.success("Invitation email sent successfully");
      } else {
        toast.error(response.error || "Failed to send invitation");
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Failed to send invitation");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadForm({ ...uploadForm, file: e.target.files[0] });
    }
  };

  const handleUploadDocument = async () => {
    if (!uploadForm.title) {
      toast.error("Please enter a document title");
      return;
    }

    if (uploadForm.type === "link" && !uploadForm.url) {
      toast.error("Please enter a URL");
      return;
    }

    if ((uploadForm.type === "pdf" || uploadForm.type === "document") && !uploadForm.file) {
      toast.error("Please select a file");
      return;
    }

    try {
      const newDocument: StrategyDocument = {
        id: Date.now().toString(),
        clientId: selectedClient,
        title: uploadForm.title,
        type: uploadForm.type,
        url: uploadForm.url || undefined,
        uploadedBy: "Agency Team",
        uploadedAt: new Date().toISOString(),
        category: uploadForm.category,
        description: uploadForm.description,
      };

      // If file upload, handle it
      if (uploadForm.file) {
        const uploadResponse = await api.uploadFile(uploadForm.file, "Agency Team");
        if (uploadResponse.success) {
          newDocument.url = uploadResponse.data.url;
          toast.success("File uploaded successfully");
        }
      }

      // Save document metadata
      const allDocs = [...documents, newDocument];
      await api.saveStrategy({
        documents: allDocs,
        lastUpdated: new Date().toISOString(),
      });

      setDocuments(allDocs);
      setIsUploadDialogOpen(false);
      setUploadForm({
        title: "",
        type: "pdf",
        url: "",
        category: "strategy",
        description: "",
        file: null,
      });
      toast.success("Document uploaded successfully");
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document");
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    try {
      const updatedDocs = documents.filter(doc => doc.id !== docId);
      await api.saveStrategy({
        documents: updatedDocs,
        lastUpdated: new Date().toISOString(),
      });
      setDocuments(updatedDocs);
      toast.success("Document deleted");
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const response = await api.updateTask(taskId, { status: newStatus });
      if (response.success) {
        toast.success("Task status updated");
        await loadTasks();
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskForm.title || !newTaskForm.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!selectedClient) {
      toast.error("Please select a client first");
      return;
    }

    try {
      const response = await api.createTask({
        ...newTaskForm,
        clientId: selectedClient,
      });

      if (response.success) {
        toast.success("Task created successfully");
        await loadTasks();
        setIsCreateTaskDialogOpen(false);
        setNewTaskForm({
          title: "",
          description: "",
          priority: "medium",
          dueDate: "",
        });
      } else {
        toast.error(response.error || "Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "medium":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "low":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-text-secondary/10 text-text-secondary border-text-secondary/20";
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "in-progress":
        return "bg-cyan-accent/10 text-cyan-accent border-cyan-accent/20";
      case "review":
        return "bg-violet/10 text-violet border-violet/20";
      case "todo":
        return "bg-text-secondary/10 text-text-secondary border-text-secondary/20";
      default:
        return "bg-text-secondary/10 text-text-secondary border-text-secondary/20";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "strategy":
        return <FileText className="h-4 w-4 text-cyan-accent" />;
      case "report":
        return <FileText className="h-4 w-4 text-teal" />;
      case "analysis":
        return <FileText className="h-4 w-4 text-violet" />;
      default:
        return <FileText className="h-4 w-4 text-text-secondary" />;
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render Clients Section
  if (activeSection === "clients") {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white">Client Management</h3>
            <p className="text-text-secondary mt-1">
              Manage client profiles, credentials, and send invitations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-cyan-accent/10 text-cyan-accent border-cyan-accent/20">
              {viewMode === "management" ? "Management View" : "Team View"}
            </Badge>
            {viewMode === "management" && (
              <Dialog open={isCreateClientDialogOpen} onOpenChange={setIsCreateClientDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create New Client
                  </Button>
                </DialogTrigger>
              <DialogContent className="max-w-2xl" style={{ backgroundColor: '#0F0F0F', borderColor: '#333333', border: '1px solid #333333' }}>
                <DialogHeader>
                  <DialogTitle className="text-white">Create New Client</DialogTitle>
                  <DialogDescription className="text-text-secondary">
                    Create a new client account and send them an invitation email
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Client Name *</Label>
                      <Input
                        value={newClientForm.name}
                        onChange={(e) => setNewClientForm({ ...newClientForm, name: e.target.value })}
                        placeholder="Sarah Johnson"
                        className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Company Name</Label>
                      <Input
                        value={newClientForm.companyName}
                        onChange={(e) => setNewClientForm({ ...newClientForm, companyName: e.target.value })}
                        placeholder="ACME Corporation"
                        className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Email Address *</Label>
                    <Input
                      type="email"
                      value={newClientForm.email}
                      onChange={(e) => setNewClientForm({ ...newClientForm, email: e.target.value })}
                      placeholder="sarah@example.com"
                      className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Password *</Label>
                    <Input
                      type="password"
                      value={newClientForm.password}
                      onChange={(e) => setNewClientForm({ ...newClientForm, password: e.target.value })}
                      placeholder="Create a secure password"
                      className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary"
                    />
                    <p className="text-text-secondary text-xs">
                      This password will be sent to the client via email invitation
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsCreateClientDialogOpen(false)}
                    className="text-text-secondary hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
                    onClick={handleCreateClient}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create & Send Invitation
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            )}
          </div>
        </div>

        {/* Client Overview */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-6 glass-card border-border-subtle">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl text-white">{clients.filter(c => c.status === "active").length}</p>
                  <p className="text-text-secondary text-sm">Active Clients</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 glass-card border-border-subtle">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl text-white">{clients.filter(c => c.status === "pending").length}</p>
                  <p className="text-text-secondary text-sm">Pending</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 glass-card border-border-subtle">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-cyan-accent/10 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-cyan-accent" />
                </div>
                <div>
                  <p className="text-2xl text-white">{clients.length}</p>
                  <p className="text-text-secondary text-sm">Total Clients</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="glass-card border-border-subtle">
            <Table>
              <TableHeader>
                <TableRow className="border-border-subtle hover:bg-transparent">
                  <TableHead className="text-text-secondary">Client Name</TableHead>
                  <TableHead className="text-text-secondary">Email</TableHead>
                  <TableHead className="text-text-secondary">Company</TableHead>
                  <TableHead className="text-text-secondary">Status</TableHead>
                  <TableHead className="text-text-secondary">Projects</TableHead>
                  <TableHead className="text-text-secondary">Last Activity</TableHead>
                  <TableHead className="text-text-secondary">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.length === 0 ? (
                  <TableRow className="border-border-subtle hover:bg-transparent">
                    <TableCell colSpan={7} className="text-center text-text-secondary py-8">
                      No clients yet. Create your first client to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  clients.map((client) => (
                    <TableRow 
                      key={client.id} 
                      className={`border-border-subtle hover:bg-cyan-accent/5 hover:border-cyan-accent/30 cursor-pointer transition-all ${
                        selectedClient === client.id ? 'bg-cyan-accent/5' : ''
                      }`}
                      onClick={() => {
                        setSelectedClientForDetail(client);
                        setIsClientDetailOpen(true);
                      }}
                    >
                      <TableCell className="text-white">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-cyan-accent" />
                          {client.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-text-secondary">{client.email}</TableCell>
                      <TableCell className="text-text-secondary">{client.companyName || "—"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(client.status)}>
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-text-secondary">{client.projectCount}</TableCell>
                      <TableCell className="text-text-secondary">{client.lastActivity}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-cyan-accent hover:text-cyan-accent hover:bg-cyan-accent/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedClientForDetail(client);
                              setIsClientDetailOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {viewMode === "management" && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-text-secondary hover:text-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditClient(client);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-text-secondary hover:text-cyan-accent"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleResendInvitation(client.id);
                                }}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </section>

        {/* Edit Client Dialog */}
        <Dialog open={isEditClientDialogOpen} onOpenChange={setIsEditClientDialogOpen}>
          <DialogContent className="max-w-2xl" style={{ backgroundColor: '#0F0F0F', borderColor: '#333333', border: '1px solid #333333' }}>
            <DialogHeader>
              <DialogTitle className="text-white">Edit Client Profile</DialogTitle>
              <DialogDescription className="text-text-secondary">
                Update client information and credentials
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Client Name *</Label>
                  <Input
                    value={editClientForm.name}
                    onChange={(e) => setEditClientForm({ ...editClientForm, name: e.target.value })}
                    placeholder="Sarah Johnson"
                    className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Company Name</Label>
                  <Input
                    value={editClientForm.companyName}
                    onChange={(e) => setEditClientForm({ ...editClientForm, companyName: e.target.value })}
                    placeholder="ACME Corporation"
                    className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Email Address *</Label>
                <Input
                  type="email"
                  value={editClientForm.email}
                  onChange={(e) => setEditClientForm({ ...editClientForm, email: e.target.value })}
                  placeholder="sarah@example.com"
                  className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">New Password (leave blank to keep current)</Label>
                <Input
                  type="password"
                  value={editClientForm.password}
                  onChange={(e) => setEditClientForm({ ...editClientForm, password: e.target.value })}
                  placeholder="Enter new password"
                  className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Status</Label>
                <Select 
                  value={editClientForm.status}
                  onValueChange={(value: "active" | "pending" | "inactive") => 
                    setEditClientForm({ ...editClientForm, status: value })
                  }
                >
                  <SelectTrigger className="bg-dark-bg border-border-subtle text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card-bg border-border-subtle">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button 
                variant="ghost" 
                onClick={() => setIsEditClientDialogOpen(false)}
                className="text-text-secondary hover:text-white"
              >
                Cancel
              </Button>
              <Button 
                className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
                onClick={handleUpdateClient}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Separator className="bg-border-subtle" />

        {/* Strategy Documents Upload */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h4 className="text-white">Strategy Documents & Assets</h4>
              <p className="text-text-secondary text-sm mt-1">
                Upload documents for {selectedClient ? clients.find(c => c.id === selectedClient)?.name : "selected client"}
              </p>
            </div>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
                  disabled={!selectedClient}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl" style={{ backgroundColor: '#0F0F0F', borderColor: '#333333', border: '1px solid #333333' }}>
                <DialogHeader>
                  <DialogTitle className="text-white">Upload Strategy Document</DialogTitle>
                  <DialogDescription className="text-text-secondary">
                    Upload files or add embedded links to appear in the client's Strategy page
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-white">Document Title</Label>
                    <Input
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                      placeholder="e.g., Q3 Strategy Report"
                      className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Type</Label>
                    <Select 
                      value={uploadForm.type}
                      onValueChange={(value: "pdf" | "link" | "document") => 
                        setUploadForm({ ...uploadForm, type: value })
                      }
                    >
                      <SelectTrigger className="bg-dark-bg border-border-subtle text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card-bg border-border-subtle">
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="link">Embedded Link</SelectItem>
                        <SelectItem value="document">Other Document</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {uploadForm.type === "link" ? (
                    <div className="space-y-2">
                      <Label className="text-white">URL</Label>
                      <Input
                        type="url"
                        value={uploadForm.url}
                        onChange={(e) => setUploadForm({ ...uploadForm, url: e.target.value })}
                        placeholder="https://..."
                        className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label className="text-white">File</Label>
                      <Input
                        type="file"
                        onChange={handleFileChange}
                        className="bg-dark-bg border-border-subtle text-white"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-white">Category</Label>
                    <Select 
                      value={uploadForm.category}
                      onValueChange={(value: "strategy" | "report" | "analysis" | "other") => 
                        setUploadForm({ ...uploadForm, category: value })
                      }
                    >
                      <SelectTrigger className="bg-dark-bg border-border-subtle text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card-bg border-border-subtle">
                        <SelectItem value="strategy">Strategy</SelectItem>
                        <SelectItem value="report">Report</SelectItem>
                        <SelectItem value="analysis">Analysis</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Description</Label>
                    <Textarea
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                      placeholder="Brief description of this document..."
                      className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsUploadDialogOpen(false)}
                    className="text-text-secondary hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
                    onClick={handleUploadDocument}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search documents..."
                className="pl-10 bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary"
              />
            </div>
          </div>

          {/* Documents List */}
          <div className="space-y-3">
            {!selectedClient ? (
              <Card className="p-8 glass-card border-border-subtle text-center">
                <FileText className="h-12 w-12 text-text-secondary mx-auto mb-3" />
                <p className="text-text-secondary">Select a client to view their documents</p>
              </Card>
            ) : filteredDocuments.length === 0 ? (
              <Card className="p-8 glass-card border-border-subtle text-center">
                <FileText className="h-12 w-12 text-text-secondary mx-auto mb-3" />
                <p className="text-text-secondary">No documents uploaded yet</p>
                <p className="text-text-secondary text-sm mt-1">
                  Upload documents to share with your client
                </p>
              </Card>
            ) : (
              filteredDocuments.map((doc) => (
                <Card key={doc.id} className="p-4 glass-card border-border-subtle">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 bg-cyan-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        {doc.type === "link" ? (
                          <LinkIcon className="h-5 w-5 text-cyan-accent" />
                        ) : (
                          getCategoryIcon(doc.category)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="text-white truncate">{doc.title}</h5>
                          <Badge variant="secondary" className="bg-border-subtle/20 text-text-secondary text-xs">
                            {doc.category}
                          </Badge>
                          <Badge variant="secondary" className="bg-border-subtle/20 text-text-secondary text-xs">
                            {doc.type}
                          </Badge>
                        </div>
                        <p className="text-text-secondary text-sm mb-2 line-clamp-2">
                          {doc.description}
                        </p>
                        <div className="flex items-center gap-3 text-text-secondary text-xs">
                          <span>By {doc.uploadedBy}</span>
                          <span>•</span>
                          <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(doc.url, "_blank")}
                          className="text-text-secondary hover:text-white"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="text-text-secondary hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* Client Detail View */}
        {showClientDetail && selectedClientForDetail && (
          <ClientDetailView
            client={selectedClientForDetail}
            onBack={() => {
              setShowClientDetail(false);
              setSelectedClientForDetail(null);
              loadClients(); // Reload in case changes were made
            }}
            viewMode={viewMode}
          />
        )}
      </div>
    );
  }

  // Render Tasks & Inquiries Section
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white">Design Requests</h3>
          <p className="text-text-secondary mt-1">
            Manage client design requests and tasks
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-cyan-accent/10 text-cyan-accent border-cyan-accent/20">
            Team View
          </Badge>
          <Dialog open={isCreateTaskDialogOpen} onOpenChange={setIsCreateTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
                disabled={!selectedClient}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Design Request
              </Button>
            </DialogTrigger>
            <DialogContent 
              className="max-w-2xl" 
              style={{ backgroundColor: '#0F0F0F', borderColor: '#333333', border: '1px solid #333333' }}
            >
              <DialogHeader>
                <DialogTitle className="text-white">Create Design Request</DialogTitle>
                <DialogDescription className="text-text-secondary">
                  Create a custom design request for {selectedClient ? clients.find(c => c.id === selectedClient)?.name : "selected client"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-white">Client</Label>
                  <Select 
                    value={selectedClient}
                    onValueChange={setSelectedClient}
                  >
                    <SelectTrigger className="bg-dark-bg border-border-subtle text-white">
                      <SelectValue placeholder="Choose a client" />
                    </SelectTrigger>
                    <SelectContent className="bg-card-bg border-border-subtle">
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} - {client.companyName || client.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Task Title *</Label>
                  <Input
                    value={newTaskForm.title}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                    placeholder="e.g., Review Q4 Strategy Document"
                    className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Description *</Label>
                  <Textarea
                    value={newTaskForm.description}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, description: e.target.value })}
                    placeholder="Provide details about this task..."
                    className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 bg-[rgba(79,79,79,0)]">
                    <Label className="text-white">Priority</Label>
                    <Select 
                      value={newTaskForm.priority}
                      onValueChange={(value: "low" | "medium" | "high") => 
                        setNewTaskForm({ ...newTaskForm, priority: value })
                      }
                    >
                      <SelectTrigger className="bg-dark-bg border-border-subtle text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card-bg border-border-subtle">
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Due Date</Label>
                    <Input
                      type="date"
                      value={newTaskForm.dueDate}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, dueDate: e.target.value })}
                      className="bg-dark-bg border-border-subtle text-white"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button 
                  variant="ghost" 
                  onClick={() => setIsCreateTaskDialogOpen(false)}
                  className="text-text-secondary hover:text-white"
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
                  onClick={handleCreateTask}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Client Selector */}
      <section>
        <div className="mb-6">
          <Label className="text-white mb-2 block">Select Client</Label>
          <Select 
            value={selectedClient}
            onValueChange={setSelectedClient}
          >
            <SelectTrigger className="bg-dark-bg border-border-subtle text-white max-w-md">
              <SelectValue placeholder="Choose a client" />
            </SelectTrigger>
            <SelectContent className="bg-card-bg border-border-subtle">
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name} - {client.companyName || client.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Task Overview */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-6 glass-card border-border-subtle">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-text-secondary/10 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-text-secondary" />
              </div>
              <div>
                <p className="text-2xl text-white">{tasks.filter(t => t.status === "todo").length}</p>
                <p className="text-text-secondary text-sm">To Do</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass-card border-border-subtle">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-cyan-accent/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-cyan-accent" />
              </div>
              <div>
                <p className="text-2xl text-white">{tasks.filter(t => t.status === "in-progress").length}</p>
                <p className="text-text-secondary text-sm">In Progress</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass-card border-border-subtle">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-violet/10 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-violet" />
              </div>
              <div>
                <p className="text-2xl text-white">{tasks.filter(t => t.status === "review").length}</p>
                <p className="text-text-secondary text-sm">In Review</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass-card border-border-subtle">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl text-white">{tasks.filter(t => t.status === "completed").length}</p>
                <p className="text-text-secondary text-sm">Completed</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks and inquiries..."
              className="pl-10 bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary"
            />
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <Card className="p-8 glass-card border-border-subtle text-center">
              <MessageSquare className="h-12 w-12 text-text-secondary mx-auto mb-3" />
              <p className="text-text-secondary">No tasks or inquiries found</p>
              <p className="text-text-secondary text-sm mt-1">
                Tasks from design requests will appear here
              </p>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card key={task.id} className="p-4 glass-card border-border-subtle">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="text-white">{task.title}</h5>
                      <Badge variant="secondary" className={getTaskStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                      <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-text-secondary text-sm mb-2">
                      {task.description}
                    </p>
                    <div className="flex items-center gap-3 text-text-secondary text-xs">
                      <span>Client: {clients.find(c => c.id === task.clientId)?.name || "Unknown"}</span>
                      <span>•</span>
                      <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
                      {task.dueDate && (
                        <>
                          <span>•</span>
                          <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <Select 
                      value={task.status}
                      onValueChange={(value) => handleUpdateTaskStatus(task.id, value)}
                    >
                      <SelectTrigger className="bg-dark-bg border-border-subtle text-white w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card-bg border-border-subtle">
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="review">In Review</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
