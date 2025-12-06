import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import {
  Search,
  MoreVertical,
  Plus,
  FolderPlus,
  Upload,
  Folder as FolderIcon,
  Link as LinkIcon,
  FileText,
  Image as ImageIcon,
  Video,
  FileAudio,
  File,
  Download,
  Trash2,
  Eye,
  Hash,
  ExternalLink,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { api } from "../../utils/supabase/client";
import { toast } from "sonner@2.0.3";
import { AttachmentPreviewDialog } from "../AttachmentPreviewDialog";

type FileItem = {
  id: string;
  name: string;
  type: string;
  size?: string;
  url: string;
  uploadedAt: string;
  uploadedBy?: string;
  channelId?: string;
  isExternalLink?: boolean;
};

type FileChannel = {
  id: string;
  name: string;
  fileCount: number;
  createdAt: string;
};

type Client = {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  status: string;
};

export function FilesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [channels, setChannels] = useState<FileChannel[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentChannel, setCurrentChannel] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Dialogs
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkName, setNewLinkName] = useState("");

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      loadChannels(selectedClient.id);
      loadFiles(selectedClient.id);
    }
  }, [selectedClient]);

  const loadClients = async () => {
    try {
      const response = await api.getClients();
      if (response.success) {
        setClients(response.data || []);
        // Auto-select first client if available
        if (response.data && response.data.length > 0 && !selectedClient) {
          setSelectedClient(response.data[0]);
        }
      }
    } catch (error) {
      console.error("Error loading clients:", error);
    }
  };

  const loadChannels = async (clientId: string) => {
    try {
      const response = await api.getClientFileChannels(clientId);
      if (response.success) {
        setChannels(response.data || []);
        // Auto-select general channel
        if (!currentChannel && response.data && response.data.length > 0) {
          setCurrentChannel(response.data[0].id);
        }
      }
    } catch (error) {
      console.error("Error loading channels:", error);
    }
  };

  const loadFiles = async (clientId: string) => {
    try {
      const response = await api.getClientFiles(clientId);
      if (response.success) {
        setFiles(response.data || []);
      }
    } catch (error) {
      console.error("Error loading files:", error);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !selectedClient) return;

    try {
      const response = await api.createClientFileChannel(
        selectedClient.id,
        newFolderName
      );
      if (response.success) {
        toast.success("Channel created successfully");
        setNewFolderName("");
        setIsCreateFolderOpen(false);
        await loadChannels(selectedClient.id);
      } else {
        toast.error("Failed to create channel");
      }
    } catch (error) {
      console.error("Error creating channel:", error);
      toast.error("Failed to create channel");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedClient) return;

    // Support multiple file uploads
    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        const response = await api.uploadClientFile(
          selectedClient.id,
          file,
          currentChannel || "general",
          "Current User"
        );
        return response;
      } catch (error) {
        console.error("Error uploading file:", error);
        return { success: false };
      }
    });

    const results = await Promise.all(uploadPromises);
    const successCount = results.filter((r) => r.success).length;

    if (successCount > 0) {
      toast.success(
        `${successCount} file${successCount > 1 ? "s" : ""} uploaded successfully`
      );
      await loadFiles(selectedClient.id);
      await loadChannels(selectedClient.id);
    } else {
      toast.error("Failed to upload files");
    }

    // Reset input
    e.target.value = "";
  };

  const handleAddLink = async () => {
    if (!newLinkUrl.trim() || !selectedClient) return;

    try {
      const response = await api.addClientLink(
        selectedClient.id,
        newLinkUrl,
        newLinkName || newLinkUrl,
        currentChannel || "general",
        "Current User"
      );
      if (response.success) {
        toast.success("Link added successfully");
        setNewLinkUrl("");
        setNewLinkName("");
        setIsAddLinkOpen(false);
        await loadFiles(selectedClient.id);
        await loadChannels(selectedClient.id);
      } else {
        toast.error("Failed to add link");
      }
    } catch (error) {
      console.error("Error adding link:", error);
      toast.error("Failed to add link");
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm("Are you sure you want to delete this item?") || !selectedClient)
      return;

    try {
      const response = await api.deleteClientFile(selectedClient.id, fileId);
      if (response.success) {
        toast.success("Item deleted");
        await loadFiles(selectedClient.id);
        await loadChannels(selectedClient.id);
      } else {
        toast.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  };

  const handlePreview = (file: FileItem) => {
    if (file.isExternalLink) {
      window.open(file.url, "_blank");
    } else {
      setPreviewFile(file);
      setIsPreviewOpen(true);
    }
  };

  const getFileIcon = (type: string, isLink?: boolean) => {
    if (isLink) return ExternalLink;
    if (type?.startsWith("image/")) return ImageIcon;
    if (type?.startsWith("video/")) return Video;
    if (type?.startsWith("audio/")) return FileAudio;
    if (type === "application/pdf") return FileText;
    return File;
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
      client.companyName?.toLowerCase().includes(clientSearchQuery.toLowerCase())
  );

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesChannel = currentChannel
      ? file.channelId === currentChannel
      : true;
    return matchesSearch && matchesChannel;
  });

  const currentChannelObj = channels.find((ch) => ch.id === currentChannel);

  return (
    <div className="h-full flex">
      {/* Left Panel - Client List */}
      <div
        className="w-80 border-r border-border-subtle flex flex-col"
        style={{ backgroundColor: "#0F0F0F" }}
      >
        <div className="p-4 border-b border-border-subtle">
          <h3 className="text-white mb-3">Clients</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <Input
              placeholder="Search clients..."
              value={clientSearchQuery}
              onChange={(e) => setClientSearchQuery(e.target.value)}
              className="pl-10 bg-card-bg border-border-subtle text-white"
              style={{ backgroundColor: "#0A0A0B" }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filteredClients.length === 0 ? (
            <div className="text-center py-8 text-text-secondary text-sm">
              No clients found
            </div>
          ) : (
            filteredClients.map((client) => {
              const isActive = selectedClient?.id === client.id;
              return (
                <button
                  key={client.id}
                  onClick={() => {
                    setSelectedClient(client);
                    setCurrentChannel(null);
                  }}
                  className={`w-full text-left px-3 py-3 rounded-lg mb-1 transition-all ${
                    isActive
                      ? "bg-cyan-accent/10 border border-cyan-accent/30"
                      : "hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isActive
                          ? "bg-cyan-accent text-dark-bg"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      <span className="text-sm">
                        {client.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm truncate ${
                          isActive ? "text-cyan-accent" : "text-white"
                        }`}
                      >
                        {client.name}
                      </p>
                      <p className="text-xs text-text-secondary truncate">
                        {client.companyName || client.email}
                      </p>
                      <Badge
                        variant="secondary"
                        className="mt-1 text-xs"
                        style={{
                          backgroundColor:
                            client.status === "active"
                              ? "rgba(166, 224, 255, 0.1)"
                              : "rgba(255, 255, 255, 0.1)",
                          color:
                            client.status === "active" ? "#A6E0FF" : "#999",
                        }}
                      >
                        {client.status}
                      </Badge>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Middle Panel - File Channels */}
      {selectedClient && (
        <div
          className="w-72 border-r border-border-subtle flex flex-col"
          style={{ backgroundColor: "#0F0F0F" }}
        >
          <div className="p-4 border-b border-border-subtle">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white">Channels</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCreateFolderOpen(true)}
                className="h-8 w-8 text-text-secondary hover:text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-text-secondary">
              {selectedClient.name}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {channels.map((channel) => {
              const isActive = currentChannel === channel.id;
              const channelFiles = files.filter(
                (f) => f.channelId === channel.id
              );

              return (
                <button
                  key={channel.id}
                  onClick={() => setCurrentChannel(channel.id)}
                  className={`w-full flex items-start gap-3 px-3 py-2 rounded-lg mb-1 transition-all ${
                    isActive
                      ? "bg-cyan-accent/10 text-cyan-accent"
                      : "text-white hover:bg-white/5"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${
                      isActive
                        ? "bg-cyan-accent text-dark-bg"
                        : "bg-violet/20 text-violet"
                    }`}
                  >
                    <Hash className="h-4 w-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm">{channel.name}</p>
                    <p className="text-xs text-text-secondary">
                      {channelFiles.length > 0
                        ? `${channelFiles.length} item${channelFiles.length !== 1 ? "s" : ""}`
                        : "Empty"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Right Panel - File Display */}
      <div className="flex-1 flex flex-col">
        {!selectedClient ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-text-secondary/10 flex items-center justify-center mx-auto mb-4">
                <FolderIcon className="h-8 w-8 text-text-secondary" />
              </div>
              <h3 className="text-white text-xl mb-2">Select a client</h3>
              <p className="text-text-secondary max-w-md">
                Choose a client from the left panel to view and manage their
                files.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="border-b border-border-subtle p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white text-xl">
                    {currentChannelObj?.name || "All Files"}
                  </h2>
                  {currentChannelObj && (
                    <div className="flex items-center gap-2 text-sm text-text-secondary mt-1">
                      <span>{selectedClient.name}</span>
                      <span>›</span>
                      <span>{currentChannelObj.name}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                    <Input
                      placeholder="Search files..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64 bg-card-bg border-border-subtle text-white"
                      style={{ backgroundColor: "#0A0A0B" }}
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="bg-white hover:bg-gray-200 text-dark-bg">
                        <Plus className="h-4 w-4 mr-2" />
                        New
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="border-border-subtle w-48"
                      style={{ backgroundColor: "#1A1A1A" }}
                    >
                      <DropdownMenuItem
                        className="text-white hover:bg-cyan-accent/10"
                        onClick={() => setIsCreateFolderOpen(true)}
                      >
                        <FolderPlus className="h-4 w-4 mr-2" />
                        Create channel
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-white hover:bg-cyan-accent/10"
                        onClick={() => document.getElementById("file-upload")?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload file
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-white hover:bg-cyan-accent/10"
                        onClick={() =>
                          document.getElementById("folder-upload")?.click()
                        }
                      >
                        <FolderIcon className="h-4 w-4 mr-2" />
                        Upload folder
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-white hover:bg-cyan-accent/10"
                        onClick={() => setIsAddLinkOpen(true)}
                      >
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Add a link
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    multiple
                  />
                  <input
                    id="folder-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    multiple
                    // @ts-ignore - webkitdirectory is not in the type definitions
                    webkitdirectory=""
                  />
                </div>
              </div>
            </div>

            {/* Files List */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="w-16 h-16 rounded-lg bg-text-secondary/10 flex items-center justify-center mb-4">
                    <FolderIcon className="h-8 w-8 text-text-secondary" />
                  </div>
                  <h3 className="text-white text-xl mb-2">
                    No files have been added yet
                  </h3>
                  <p className="text-text-secondary mb-6 max-w-md">
                    Files will be shown here when they are uploaded for this
                    client.
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="bg-white hover:bg-gray-200 text-dark-bg">
                        <Plus className="h-4 w-4 mr-2" />
                        New
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="border-border-subtle w-48"
                      style={{ backgroundColor: "#1A1A1A" }}
                    >
                      <DropdownMenuItem
                        className="text-white hover:bg-cyan-accent/10"
                        onClick={() => setIsCreateFolderOpen(true)}
                      >
                        <FolderPlus className="h-4 w-4 mr-2" />
                        Create channel
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-white hover:bg-cyan-accent/10"
                        onClick={() =>
                          document.getElementById("file-upload-2")?.click()
                        }
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload file
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-white hover:bg-cyan-accent/10"
                        onClick={() =>
                          document.getElementById("folder-upload-2")?.click()
                        }
                      >
                        <FolderIcon className="h-4 w-4 mr-2" />
                        Upload folder
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-white hover:bg-cyan-accent/10"
                        onClick={() => setIsAddLinkOpen(true)}
                      >
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Add a link
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <input
                    id="file-upload-2"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    multiple
                  />
                  <input
                    id="folder-upload-2"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    multiple
                    // @ts-ignore
                    webkitdirectory=""
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFiles.map((file) => {
                    const Icon = getFileIcon(file.type, file.isExternalLink);

                    return (
                      <Card
                        key={file.id}
                        className="p-4 border-border-subtle hover:border-cyan-accent/30 transition-all cursor-pointer"
                        style={{ backgroundColor: "#1A1A1A" }}
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className="flex items-center gap-3 flex-1"
                            onClick={() => handlePreview(file)}
                          >
                            <div
                              className={`w-10 h-10 rounded ${
                                file.isExternalLink
                                  ? "bg-blue-500/10"
                                  : "bg-cyan-accent/10"
                              } flex items-center justify-center`}
                            >
                              <Icon
                                className={`h-5 w-5 ${
                                  file.isExternalLink
                                    ? "text-blue-400"
                                    : "text-cyan-accent"
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white truncate">{file.name}</p>
                              <div className="flex items-center gap-2 text-xs text-text-secondary mt-1">
                                {file.size && (
                                  <>
                                    <span>{file.size}</span>
                                    <span>•</span>
                                  </>
                                )}
                                <span>
                                  {new Date(file.uploadedAt).toLocaleDateString()}
                                </span>
                                {file.uploadedBy && (
                                  <>
                                    <span>•</span>
                                    <span>{file.uploadedBy}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePreview(file)}
                              className="text-text-secondary hover:text-cyan-accent"
                            >
                              {file.isExternalLink ? (
                                <ExternalLink className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            {!file.isExternalLink && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(file.url, "_blank")}
                                className="text-text-secondary hover:text-white"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteFile(file.id)}
                              className="text-text-secondary hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Create Folder Dialog */}
      <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
        <DialogContent
          className="border-border-subtle"
          style={{ backgroundColor: "#1A1A1A" }}
        >
          <DialogHeader>
            <DialogTitle className="text-white">Create New Channel</DialogTitle>
            <DialogDescription className="text-text-secondary">
              Create a new file channel to organize files for this client.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="folder-name" className="text-white">
                Channel Name
              </Label>
              <Input
                id="folder-name"
                placeholder="e.g., Brand Assets, Deliverables"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="bg-card-bg border-border-subtle text-white"
                style={{ backgroundColor: "#0A0A0B" }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setIsCreateFolderOpen(false);
                setNewFolderName("");
              }}
              className="text-text-secondary hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim()}
              className="bg-cyan-accent hover:bg-cyan-accent/90 text-dark-bg"
            >
              Create Channel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Link Dialog */}
      <Dialog open={isAddLinkOpen} onOpenChange={setIsAddLinkOpen}>
        <DialogContent
          className="border-border-subtle"
          style={{ backgroundColor: "#1A1A1A" }}
        >
          <DialogHeader>
            <DialogTitle className="text-white">Add External Link</DialogTitle>
            <DialogDescription className="text-text-secondary">
              Add a link to an external resource or document.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="link-url" className="text-white">
                URL *
              </Label>
              <Input
                id="link-url"
                placeholder="https://example.com/document"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                className="bg-card-bg border-border-subtle text-white"
                style={{ backgroundColor: "#0A0A0B" }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-name" className="text-white">
                Display Name (optional)
              </Label>
              <Input
                id="link-name"
                placeholder="e.g., Design Mockups"
                value={newLinkName}
                onChange={(e) => setNewLinkName(e.target.value)}
                className="bg-card-bg border-border-subtle text-white"
                style={{ backgroundColor: "#0A0A0B" }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setIsAddLinkOpen(false);
                setNewLinkUrl("");
                setNewLinkName("");
              }}
              className="text-text-secondary hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddLink}
              disabled={!newLinkUrl.trim()}
              className="bg-cyan-accent hover:bg-cyan-accent/90 text-dark-bg"
            >
              Add Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <AttachmentPreviewDialog
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        attachment={previewFile}
      />
    </div>
  );
}
