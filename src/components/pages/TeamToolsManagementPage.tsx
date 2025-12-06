import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  FileText,
  Video,
  BookOpen,
} from "lucide-react";
import { api } from "../../utils/supabase/client";
import { toast } from "sonner@2.0.3";

type Tool = {
  id: string;
  name: string;
  description: string;
  type: "tool" | "tutorial";
  category: string;
  url: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
};

const iconOptions = [
  { value: "wrench", label: "Wrench" },
  { value: "palette", label: "Palette" },
  { value: "sparkles", label: "Sparkles" },
  { value: "image", label: "Image" },
  { value: "file-text", label: "File Text" },
  { value: "code", label: "Code" },
  { value: "link", label: "Link" },
  { value: "video", label: "Video" },
  { value: "book-open", label: "Book" },
];

export function TeamToolsManagementPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "tool" as "tool" | "tutorial",
    category: "",
    url: "",
    icon: "wrench",
  });

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      const response = await api.getTeamTools();
      if (response.success) {
        setTools(response.data || []);
      }
    } catch (error) {
      console.error("Error loading tools:", error);
    }
  };

  const handleOpenDialog = (tool?: Tool) => {
    if (tool) {
      setEditingTool(tool);
      setFormData({
        name: tool.name,
        description: tool.description,
        type: tool.type,
        category: tool.category,
        url: tool.url,
        icon: tool.icon,
      });
    } else {
      setEditingTool(null);
      setFormData({
        name: "",
        description: "",
        type: "tool",
        category: "",
        url: "",
        icon: "wrench",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTool(null);
    setFormData({
      name: "",
      description: "",
      type: "tool",
      category: "",
      url: "",
      icon: "wrench",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.url) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingTool) {
        const response = await api.updateTeamTool(editingTool.id, formData);
        if (response.success) {
          toast.success("Tool updated successfully");
          handleCloseDialog();
          await loadTools();
        } else {
          toast.error("Failed to update tool");
        }
      } else {
        const response = await api.createTeamTool(formData);
        if (response.success) {
          toast.success("Tool created successfully");
          handleCloseDialog();
          await loadTools();
        } else {
          toast.error("Failed to create tool");
        }
      }
    } catch (error) {
      console.error("Error saving tool:", error);
      toast.error("Failed to save tool");
    }
  };

  const handleDelete = async (toolId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await api.deleteTeamTool(toolId);
      if (response.success) {
        toast.success("Item deleted successfully");
        await loadTools();
      } else {
        toast.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "tutorial":
        return <BookOpen className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-white mb-1">Team Tools Management</h2>
          <p className="text-text-secondary">
            Manage tools and tutorials available to your team
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-cyan-accent hover:bg-cyan-accent/90 text-dark-bg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Tool / Tutorial
        </Button>
      </div>

      {/* Tools Table */}
      <Card
        className="border-border-subtle"
        style={{ backgroundColor: "#1A1A1A" }}
      >
        <Table>
          <TableHeader>
            <TableRow className="border-border-subtle hover:bg-transparent">
              <TableHead className="text-text-secondary">Name</TableHead>
              <TableHead className="text-text-secondary">Type</TableHead>
              <TableHead className="text-text-secondary">Category</TableHead>
              <TableHead className="text-text-secondary">Description</TableHead>
              <TableHead className="text-text-secondary">URL</TableHead>
              <TableHead className="text-text-secondary">Created</TableHead>
              <TableHead className="text-text-secondary text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tools.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-text-secondary"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-text-secondary/10 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-text-secondary" />
                    </div>
                    <p>No tools or tutorials added yet</p>
                    <Button
                      variant="outline"
                      onClick={() => handleOpenDialog()}
                      className="border-cyan-accent/30 text-cyan-accent hover:bg-cyan-accent hover:text-dark-bg"
                    >
                      Add Your First Tool
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              tools.map((tool) => (
                <TableRow
                  key={tool.id}
                  className="border-border-subtle hover:bg-white/5"
                >
                  <TableCell className="text-white">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(tool.type)}
                      {tool.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-white">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        tool.type === "tutorial"
                          ? "bg-violet/10 text-violet"
                          : "bg-cyan-accent/10 text-cyan-accent"
                      }`}
                    >
                      {tool.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-text-secondary">
                    {tool.category || "-"}
                  </TableCell>
                  <TableCell className="text-text-secondary max-w-xs truncate">
                    {tool.description}
                  </TableCell>
                  <TableCell className="text-text-secondary">
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-cyan-accent transition-colors"
                    >
                      <span className="max-w-[150px] truncate">
                        {tool.url}
                      </span>
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                  </TableCell>
                  <TableCell className="text-text-secondary text-xs">
                    {new Date(tool.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(tool)}
                        className="text-text-secondary hover:text-cyan-accent"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(tool.id)}
                        className="text-text-secondary hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="border-border-subtle max-w-2xl"
          style={{ backgroundColor: "#1A1A1A" }}
        >
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingTool ? "Edit Tool / Tutorial" : "Add New Tool / Tutorial"}
              </DialogTitle>
              <DialogDescription className="text-text-secondary">
                {editingTool
                  ? "Update the details of the tool or tutorial"
                  : "Add a new tool or tutorial for your team"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Color Palette Generator"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-card-bg border-border-subtle text-white"
                    style={{ backgroundColor: "#0A0A0B" }}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-white">
                    Type *
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "tool" | "tutorial") =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger
                      className="bg-card-bg border-border-subtle text-white"
                      style={{ backgroundColor: "#0A0A0B" }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      className="border-border-subtle"
                      style={{ backgroundColor: "#1A1A1A" }}
                    >
                      <SelectItem value="tool" className="text-white">
                        Tool
                      </SelectItem>
                      <SelectItem value="tutorial" className="text-white">
                        Tutorial
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-white">
                    Category
                  </Label>
                  <Input
                    id="category"
                    placeholder="e.g., Design, Marketing, Strategy"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="bg-card-bg border-border-subtle text-white"
                    style={{ backgroundColor: "#0A0A0B" }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon" className="text-white">
                    Icon
                  </Label>
                  <Select
                    value={formData.icon}
                    onValueChange={(value) =>
                      setFormData({ ...formData, icon: value })
                    }
                  >
                    <SelectTrigger
                      className="bg-card-bg border-border-subtle text-white"
                      style={{ backgroundColor: "#0A0A0B" }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      className="border-border-subtle"
                      style={{ backgroundColor: "#1A1A1A" }}
                    >
                      {iconOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="text-white"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="url" className="text-white">
                  URL *
                </Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/tool"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  className="bg-card-bg border-border-subtle text-white"
                  style={{ backgroundColor: "#0A0A0B" }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this tool or tutorial does..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="bg-card-bg border-border-subtle text-white min-h-[100px]"
                  style={{ backgroundColor: "#0A0A0B" }}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={handleCloseDialog}
                className="text-text-secondary hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-cyan-accent hover:bg-cyan-accent/90 text-dark-bg"
              >
                {editingTool ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
