import { useState, useEffect, useRef } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
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
  UserPlus,
  Users,
  Building2,
  Mail,
  Phone,
  Calendar,
  Trash2,
  Eye,
  Upload,
  FileText,
  Image as ImageIcon,
  Video,
  CheckCircle2,
  X,
  Download,
} from "lucide-react";
import { ClientDetailView } from "../ClientDetailView";
import { api } from "../../utils/supabase/client";
import { toast } from "sonner@2.0.3";

type Client = {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  status: "active" | "pending" | "inactive";
  joinedAt: string;
  plan: "starter" | "professional" | "enterprise";
};

type ClientAsset = {
  id: string;
  clientId: string;
  name: string;
  type: "image" | "video" | "document" | "other";
  size: number;
  url: string;
  uploadedAt: string;
};

export function ClientManagementPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [showClientDetail, setShowClientDetail] = useState(false);
  const [assets, setAssets] = useState<ClientAsset[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    plan: "professional" as "starter" | "professional" | "enterprise",
  });

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      loadClientAssets(selectedClient.id);
    }
  }, [selectedClient]);

  const loadClients = async () => {
    try {
      const response = await api.getClients();
      if (response.success && response.data) {
        setClients(response.data);
      }
    } catch (error) {
      console.error("Error loading clients:", error);
    }
  };

  const loadClientAssets = async (clientId: string) => {
    try {
      const response = await api.getClientAssets(clientId);
      if (response.success && response.data) {
        setAssets(response.data);
      }
    } catch (error) {
      console.error("Error loading client assets:", error);
    }
  };

  const handleInviteClient = async () => {
    if (!inviteForm.name || !inviteForm.email || !inviteForm.company) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await api.inviteClient(inviteForm);
      if (response.success) {
        toast.success("Client invitation sent successfully");
        await loadClients();
        setIsInviteDialogOpen(false);
        setInviteForm({
          name: "",
          email: "",
          company: "",
          phone: "",
          plan: "professional",
        });
      } else {
        toast.error(response.error || "Failed to invite client");
      }
    } catch (error) {
      console.error("Error inviting client:", error);
      toast.error("Failed to invite client");
    }
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setShowClientDetail(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (!selectedClient) {
      toast.error("Please select a client first");
      return;
    }

    const files = Array.from(e.dataTransfer.files);
    await uploadFiles(files);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedClient) {
      toast.error("Please select a client first");
      return;
    }

    const files = Array.from(e.target.files || []);
    await uploadFiles(files);
  };

  const uploadFiles = async (files: File[]) => {
    if (!selectedClient) return;

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("clientId", selectedClient.id);

        const response = await api.uploadClientAsset(selectedClient.id, formData);
        if (response.success) {
          toast.success(`${file.name} uploaded successfully`);
        } else {
          toast.error(`Failed to upload ${file.name}`);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    await loadClientAssets(selectedClient.id);
  };

  const handleDeleteAsset = async (assetId: string) => {
    if (!confirm("Are you sure you want to delete this asset?")) return;

    try {
      const response = await api.deleteClientAsset(assetId);
      if (response.success) {
        toast.success("Asset deleted");
        if (selectedClient) {
          await loadClientAssets(selectedClient.id);
        }
      } else {
        toast.error("Failed to delete asset");
      }
    } catch (error) {
      console.error("Error deleting asset:", error);
      toast.error("Failed to delete asset");
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

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "starter":
        return "bg-cyan-accent/10 text-cyan-accent border-cyan-accent/20";
      case "professional":
        return "bg-violet/10 text-violet border-violet/20";
      case "enterprise":
        return "bg-teal/10 text-teal border-teal/20";
      default:
        return "bg-text-secondary/10 text-text-secondary border-text-secondary/20";
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "image":
        return ImageIcon;
      case "video":
        return Video;
      default:
        return FileText;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // If showing client detail, render that instead
  if (showClientDetail && selectedClient) {
    return (
      <ClientDetailView
        client={selectedClient}
        onBack={() => {
          setShowClientDetail(false);
          setSelectedClient(null);
        }}
        viewMode="management"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-white mb-1">Client Management</h2>
          <p className="text-text-secondary">
            Invite clients, manage accounts, and upload assets
          </p>
        </div>

        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-xl" style={{ backgroundColor: '#0F0F0F', borderColor: '#1F1F1F' }}>
            <DialogHeader>
              <DialogTitle className="text-white">Invite New Client</DialogTitle>
              <DialogDescription className="text-gray-400">
                Send an invitation to onboard a new client to CIELO OS
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Client Name *</Label>
                  <Input
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                    placeholder="Sarah Johnson"
                    style={{ backgroundColor: '#0A0A0B', borderColor: '#1F1F1F' }}
                    className="text-white placeholder:text-text-secondary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Email *</Label>
                  <Input
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    placeholder="sarah@company.com"
                    style={{ backgroundColor: '#0A0A0B', borderColor: '#1F1F1F' }}
                    className="text-white placeholder:text-text-secondary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Company Name *</Label>
                  <Input
                    value={inviteForm.company}
                    onChange={(e) => setInviteForm({ ...inviteForm, company: e.target.value })}
                    placeholder="ACME Corporation"
                    style={{ backgroundColor: '#0A0A0B', borderColor: '#1F1F1F' }}
                    className="text-white placeholder:text-text-secondary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Phone</Label>
                  <Input
                    type="tel"
                    value={inviteForm.phone}
                    onChange={(e) => setInviteForm({ ...inviteForm, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    style={{ backgroundColor: '#0A0A0B', borderColor: '#1F1F1F' }}
                    className="text-white placeholder:text-text-secondary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Starting Plan</Label>
                <Select
                  value={inviteForm.plan}
                  onValueChange={(value: "starter" | "professional" | "enterprise") =>
                    setInviteForm({ ...inviteForm, plan: value })
                  }
                >
                  <SelectTrigger style={{ backgroundColor: '#0A0A0B', borderColor: '#1F1F1F' }} className="text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg" style={{ backgroundColor: '#0F0F0F', borderColor: '#1F1F1F' }}>
                    <SelectItem value="starter">Starter - $499/month</SelectItem>
                    <SelectItem value="professional">Professional - $999/month</SelectItem>
                    <SelectItem value="enterprise">Enterprise - Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setIsInviteDialogOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                className="bg-cyan-accent hover:bg-cyan-accent/80 text-white"
                onClick={handleInviteClient}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-cyan-accent/10 to-cyan-accent/5 border-cyan-accent/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-cyan-accent/10 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-cyan-accent" />
            </div>
            <div>
              <p className="text-2xl text-white">{clients.length}</p>
              <p className="text-sm text-text-secondary">Total Clients</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl text-white">
                {clients.filter((c) => c.status === "active").length}
              </p>
              <p className="text-sm text-text-secondary">Active</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl text-white">
                {clients.filter((c) => c.status === "pending").length}
              </p>
              <p className="text-sm text-text-secondary">Pending</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-violet/10 to-violet/5 border-violet/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-violet/10 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-violet" />
            </div>
            <div>
              <p className="text-2xl text-white">
                {new Set(clients.map((c) => c.company)).size}
              </p>
              <p className="text-sm text-text-secondary">Companies</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="clients" className="space-y-6">
        <TabsList className="bg-card-bg border border-border-subtle">
          <TabsTrigger
            value="clients"
            className="data-[state=active]:bg-cyan-accent/10 data-[state=active]:text-cyan-accent"
          >
            <Users className="h-4 w-4 mr-2" />
            All Clients
          </TabsTrigger>
          <TabsTrigger
            value="assets"
            className="data-[state=active]:bg-cyan-accent/10 data-[state=active]:text-cyan-accent"
          >
            <Upload className="h-4 w-4 mr-2" />
            Manage Assets
          </TabsTrigger>
        </TabsList>

        {/* Clients Tab */}
        <TabsContent value="clients">
          <div className="space-y-4">
            {clients.length === 0 ? (
              <Card className="glass-card border-border-subtle p-12">
                <div className="text-center text-text-secondary">
                  No clients yet. Invite your first client to get started.
                </div>
              </Card>
            ) : (
              clients.map((client) => (
                <Card 
                  key={client.id} 
                  className="glass-card border-border-subtle hover:border-cyan-accent/30 transition-all cursor-pointer"
                  onClick={() => handleViewClient(client)}
                >
                  <div className="p-6 space-y-6">
                    {/* Header with Company Name and View Details */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white text-2xl mb-2">{client.company}</h3>
                        <Button 
                          variant="ghost" 
                          className="text-text-secondary hover:text-cyan-accent p-0 h-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewClient(client);
                          }}
                        >
                          View details
                        </Button>
                      </div>
                      <Avatar className="w-16 h-16 border-2 border-cyan-accent/20">
                        <AvatarFallback className="bg-gradient-to-br from-cyan-accent/20 to-violet/20 text-cyan-accent text-xl">
                          {getInitials(client.company)}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <Separator className="bg-border-subtle" />

                    {/* Client Details Grid */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* Added Date */}
                      <div>
                        <div className="flex items-center gap-2 text-text-secondary mb-2">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">Added</span>
                        </div>
                        <p className="text-white">
                          {new Date(client.joinedAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>

                      {/* Account Manager */}
                      <div>
                        <div className="flex items-center gap-2 text-text-secondary mb-2">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">Account Manager</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6 border border-cyan-accent/20">
                            <AvatarFallback className="bg-gradient-to-br from-cyan-accent/20 to-violet/20 text-cyan-accent text-xs">
                              AC
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-white">{client.name}</span>
                        </div>
                      </div>

                      {/* Estimated Value */}
                      <div>
                        <div className="flex items-center gap-2 text-text-secondary mb-2">
                          <span className="text-sm"># Estimated Value</span>
                        </div>
                        <p className="text-white text-2xl">
                          {client.plan === 'starter' ? '$499.00' : client.plan === 'professional' ? '$999.00' : '$2,499.00'}
                        </p>
                      </div>

                      {/* Status */}
                      <div>
                        <div className="flex items-center gap-2 text-text-secondary mb-2">
                          <span className="text-sm">Status</span>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(client.status)} px-3 py-1`}
                        >
                          {client.status === 'active' ? '06 Active' : client.status === 'pending' ? '02 Pending' : '00 Inactive'}
                        </Badge>
                      </div>
                    </div>

                    <Separator className="bg-border-subtle" />

                    {/* Contact Information */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-text-secondary">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">Email</span>
                        </div>
                        <span className="text-white">{client.email}</span>
                      </div>

                      {client.phone && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-text-secondary">
                            <Phone className="h-4 w-4" />
                            <span className="text-sm">Phone</span>
                          </div>
                          <span className="text-white">{client.phone}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-text-secondary">
                          <Building2 className="h-4 w-4" />
                          <span className="text-sm">Plan</span>
                        </div>
                        <Badge variant="outline" className={getPlanColor(client.plan)}>
                          {client.plan}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Assets Tab */}
        <TabsContent value="assets" className="space-y-6">
          {/* Client Selector */}
          <Card className="p-4 glass-card border-border-subtle">
            <div className="flex items-center gap-4">
              <Label className="text-white">Select Client:</Label>
              <Select
                value={selectedClient?.id || ""}
                onValueChange={(value) => {
                  const client = clients.find((c) => c.id === value);
                  setSelectedClient(client || null);
                }}
              >
                <SelectTrigger style={{ backgroundColor: '#1A1A1A', borderColor: '#333333' }} className="text-white w-[300px]">
                  <SelectValue placeholder="Choose a client..." />
                </SelectTrigger>
                <SelectContent className="rounded-lg" style={{ backgroundColor: '#1A1A1B', borderColor: '#2A2A2B' }}>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} - {client.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          {selectedClient && (
            <>
              {/* Drag & Drop Upload Area */}
              <Card
                className={`p-12 glass-card border-2 border-dashed transition-all ${
                  isDragging
                    ? "border-cyan-accent bg-cyan-accent/5"
                    : "border-border-subtle hover:border-cyan-accent/30"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-cyan-accent/10 rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-cyan-accent" />
                  </div>
                  <div>
                    <h4 className="text-white mb-2">
                      Drag & Drop Assets for {selectedClient.name}
                    </h4>
                    <p className="text-text-secondary text-sm">
                      Drop files here or click to browse
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                </div>
              </Card>

              {/* Assets Grid */}
              {assets.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white">Uploaded Assets ({assets.length})</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {assets.map((asset) => {
                      const AssetIcon = getAssetIcon(asset.type);
                      return (
                        <Card
                          key={asset.id}
                          className="p-4 glass-card border-border-subtle hover:border-cyan-accent/30 transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-cyan-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <AssetIcon className="h-6 w-6 text-cyan-accent" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-white text-sm truncate">{asset.name}</h5>
                              <p className="text-text-secondary text-xs">
                                {formatFileSize(asset.size)} • {asset.type}
                              </p>
                              <p className="text-text-secondary text-xs mt-1">
                                {new Date(asset.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border-subtle">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex-1 text-text-secondary hover:text-cyan-accent"
                              onClick={() => window.open(asset.url, "_blank")}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAsset(asset.id)}
                              className="text-text-secondary hover:text-red-400"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

    </div>
  );
}
