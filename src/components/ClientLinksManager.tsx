import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Link2,
  Plus,
  Trash2,
  ExternalLink,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { api } from "../utils/supabase/client";
import { toast } from "sonner@2.0.3";

export type ClientLink = {
  id: string;
  clientId: string;
  type: 'website' | 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'github' | 'custom';
  label: string;
  url: string;
  isPublic: boolean; // Show to client or internal only
  createdAt: string;
};

type ClientLinksManagerProps = {
  clientId: string;
  viewMode?: "admin" | "client";
};

const linkTypeConfig = {
  website: { icon: Globe, label: "Website", color: "text-blue-500", placeholder: "https://example.com" },
  facebook: { icon: Facebook, label: "Facebook", color: "text-blue-600", placeholder: "https://facebook.com/yourpage" },
  twitter: { icon: Twitter, label: "Twitter/X", color: "text-sky-500", placeholder: "https://twitter.com/yourusername" },
  instagram: { icon: Instagram, label: "Instagram", color: "text-pink-500", placeholder: "https://instagram.com/yourusername" },
  linkedin: { icon: Linkedin, label: "LinkedIn", color: "text-blue-700", placeholder: "https://linkedin.com/company/yourcompany" },
  youtube: { icon: Youtube, label: "YouTube", color: "text-red-600", placeholder: "https://youtube.com/@yourchannel" },
  github: { icon: Github, label: "GitHub", color: "text-gray-900 dark:text-gray-100", placeholder: "https://github.com/yourusername" },
  custom: { icon: Link2, label: "Custom Link", color: "text-cyan-accent", placeholder: "https://your-custom-link.com" },
};

export function ClientLinksManager({ clientId, viewMode = "admin" }: ClientLinksManagerProps) {
  const [links, setLinks] = useState<ClientLink[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<ClientLink | null>(null);
  const [newLink, setNewLink] = useState({
    type: 'website' as ClientLink['type'],
    label: '',
    url: '',
    isPublic: true,
  });

  useEffect(() => {
    loadLinks();
  }, [clientId]);

  const loadLinks = async () => {
    try {
      const data = await api.getClientLinks(clientId);
      // Filter public links for client view
      if (viewMode === "client") {
        setLinks(data.filter((link: ClientLink) => link.isPublic));
      } else {
        setLinks(data);
      }
    } catch (error) {
      console.error("Error loading client links:", error);
    }
  };

  const handleAddLink = async () => {
    if (!newLink.url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    try {
      const linkData: Omit<ClientLink, 'id' | 'createdAt'> = {
        clientId,
        type: newLink.type,
        label: newLink.label || linkTypeConfig[newLink.type].label,
        url: newLink.url,
        isPublic: newLink.isPublic,
      };

      await api.addClientLink(linkData);
      toast.success("Link added successfully");
      
      setNewLink({
        type: 'website',
        label: '',
        url: '',
        isPublic: true,
      });
      setIsAddDialogOpen(false);
      loadLinks();
    } catch (error) {
      console.error("Error adding link:", error);
      toast.error("Failed to add link");
    }
  };

  const handleUpdateLink = async (linkId: string, updates: Partial<ClientLink>) => {
    try {
      await api.updateClientLink(linkId, updates);
      toast.success("Link updated");
      setEditingLink(null);
      loadLinks();
    } catch (error) {
      console.error("Error updating link:", error);
      toast.error("Failed to update link");
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;

    try {
      await api.deleteClientLink(linkId);
      toast.success("Link deleted");
      loadLinks();
    } catch (error) {
      console.error("Error deleting link:", error);
      toast.error("Failed to delete link");
    }
  };

  const renderLinkCard = (link: ClientLink) => {
    const config = linkTypeConfig[link.type];
    const Icon = config.icon;

    if (viewMode === "client") {
      // Client view - clean, minimal display
      return (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <Card className="p-4 hover:border-cyan-accent/50 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted group-hover:bg-cyan-accent/10 transition-colors ${config.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground group-hover:text-cyan-accent transition-colors">
                    {link.label}
                  </p>
                  <ExternalLink className="h-3 w-3 text-text-secondary group-hover:text-cyan-accent transition-colors opacity-0 group-hover:opacity-100" />
                </div>
                <p className="text-xs text-text-secondary truncate mt-0.5">
                  {link.url}
                </p>
              </div>
            </div>
          </Card>
        </a>
      );
    }

    // Admin view - with edit/delete controls
    return (
      <Card key={link.id} className="p-4 hover:border-border transition-colors">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg bg-muted ${config.color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-medium text-foreground">{link.label}</p>
              {!link.isPublic && (
                <Badge variant="outline" className="text-xs">
                  Internal Only
                </Badge>
              )}
            </div>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-cyan-accent hover:underline truncate block"
            >
              {link.url}
            </a>
            <p className="text-xs text-text-secondary mt-1">
              Type: {config.label}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setEditingLink(link)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
              onClick={() => handleDeleteLink(link.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  if (viewMode === "client" && links.length === 0) {
    return null; // Don't show anything if no public links
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-foreground">
            {viewMode === "client" ? "Quick Links" : "Client Links & Social Media"}
          </h4>
          {viewMode === "admin" && (
            <p className="text-sm text-text-secondary mt-1">
              Manage client website, social media, and custom links
            </p>
          )}
        </div>
        {viewMode === "admin" && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-cyan-accent hover:bg-cyan-accent/90 text-dark-bg">
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background border-border-subtle">
              <DialogHeader>
                <DialogTitle className="text-foreground">Add Client Link</DialogTitle>
                <DialogDescription className="text-text-secondary">
                  Add a website, social media, or custom link for this client
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Link Type</Label>
                  <Select
                    value={newLink.type}
                    onValueChange={(value: ClientLink['type']) =>
                      setNewLink({ ...newLink, type: value })
                    }
                  >
                    <SelectTrigger className="bg-background border-border-subtle">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border-subtle">
                      {Object.entries(linkTypeConfig).map(([key, config]) => {
                        const Icon = config.icon;
                        return (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <Icon className={`h-4 w-4 ${config.color}`} />
                              <span>{config.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Label (Optional)</Label>
                  <Input
                    placeholder={`e.g., ${linkTypeConfig[newLink.type].label}`}
                    value={newLink.label}
                    onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                    className="bg-background border-border-subtle"
                  />
                  <p className="text-xs text-text-secondary">
                    Leave empty to use default: "{linkTypeConfig[newLink.type].label}"
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>URL</Label>
                  <Input
                    type="url"
                    placeholder={linkTypeConfig[newLink.type].placeholder}
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    className="bg-background border-border-subtle"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={newLink.isPublic}
                    onChange={(e) => setNewLink({ ...newLink, isPublic: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isPublic" className="cursor-pointer">
                    Show to client (uncheck for internal only)
                  </Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddLink}
                    className="flex-1 bg-cyan-accent hover:bg-cyan-accent/90 text-dark-bg"
                  >
                    Add Link
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Links Grid */}
      {links.length > 0 ? (
        <div className={`grid grid-cols-1 ${viewMode === "client" ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"} gap-3`}>
          {links.map(renderLinkCard)}
        </div>
      ) : (
        viewMode === "admin" && (
          <Card className="p-8 text-center border-dashed">
            <Link2 className="h-12 w-12 text-text-secondary mx-auto mb-3 opacity-50" />
            <p className="text-text-secondary mb-2">No links added yet</p>
            <p className="text-sm text-text-secondary">
              Add client websites, social media profiles, and custom links
            </p>
          </Card>
        )
      )}

      {/* Edit Dialog */}
      {editingLink && (
        <Dialog open={!!editingLink} onOpenChange={() => setEditingLink(null)}>
          <DialogContent className="bg-background border-border-subtle">
            <DialogHeader>
              <DialogTitle className="text-foreground">Edit Link</DialogTitle>
              <DialogDescription className="text-text-secondary">
                Update link details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Label</Label>
                <Input
                  value={editingLink.label}
                  onChange={(e) =>
                    setEditingLink({ ...editingLink, label: e.target.value })
                  }
                  className="bg-background border-border-subtle"
                />
              </div>

              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  type="url"
                  value={editingLink.url}
                  onChange={(e) =>
                    setEditingLink({ ...editingLink, url: e.target.value })
                  }
                  className="bg-background border-border-subtle"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="editIsPublic"
                  checked={editingLink.isPublic}
                  onChange={(e) =>
                    setEditingLink({ ...editingLink, isPublic: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                <Label htmlFor="editIsPublic" className="cursor-pointer">
                  Show to client
                </Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setEditingLink(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleUpdateLink(editingLink.id, editingLink)}
                  className="flex-1 bg-cyan-accent hover:bg-cyan-accent/90 text-dark-bg"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
