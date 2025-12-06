import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import {
  Palette,
  FileText,
  Image,
  Link2,
  Code,
  Sparkles,
  Wrench,
  BookOpen,
  Video,
  ExternalLink,
  PlayCircle,
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
};

const iconMap: Record<string, any> = {
  wrench: Wrench,
  palette: Palette,
  sparkles: Sparkles,
  image: Image,
  "file-text": FileText,
  code: Code,
  link: Link2,
  video: Video,
  "book-open": BookOpen,
};

export function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "tool" | "tutorial">("all");

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

  const handleToolClick = (tool: Tool) => {
    window.open(tool.url, "_blank");
    toast.success(`Opening ${tool.name}...`);
  };

  const filteredTools = tools.filter((tool) =>
    activeFilter === "all" ? true : tool.type === activeFilter
  );

  const getIcon = (iconName: string) => {
    return iconMap[iconName] || Wrench;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl text-white mb-1">Tools & Tutorials</h2>
        <p className="text-text-secondary">
          Access tools and learning resources to accelerate your work
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeFilter === "all" ? "default" : "outline"}
          onClick={() => setActiveFilter("all")}
          className={
            activeFilter === "all"
              ? "bg-cyan-accent hover:bg-cyan-accent/90 text-dark-bg"
              : "border-border-subtle text-white hover:bg-cyan-accent/10 hover:border-cyan-accent/30"
          }
        >
          All
        </Button>
        <Button
          variant={activeFilter === "tool" ? "default" : "outline"}
          onClick={() => setActiveFilter("tool")}
          className={
            activeFilter === "tool"
              ? "bg-cyan-accent hover:bg-cyan-accent/90 text-dark-bg"
              : "border-border-subtle text-white hover:bg-cyan-accent/10 hover:border-cyan-accent/30"
          }
        >
          <Wrench className="h-4 w-4 mr-2" />
          Tools
        </Button>
        <Button
          variant={activeFilter === "tutorial" ? "default" : "outline"}
          onClick={() => setActiveFilter("tutorial")}
          className={
            activeFilter === "tutorial"
              ? "bg-cyan-accent hover:bg-cyan-accent/90 text-dark-bg"
              : "border-border-subtle text-white hover:bg-cyan-accent/10 hover:border-cyan-accent/30"
          }
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Tutorials
        </Button>
      </div>

      {/* Tools Grid */}
      {filteredTools.length === 0 ? (
        <Card
          className="p-12 border-border-subtle text-center"
          style={{ backgroundColor: "#1A1A1A" }}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-text-secondary/10 flex items-center justify-center">
              {activeFilter === "tutorial" ? (
                <BookOpen className="h-8 w-8 text-text-secondary" />
              ) : (
                <Wrench className="h-8 w-8 text-text-secondary" />
              )}
            </div>
            <div>
              <h3 className="text-white text-xl mb-2">
                No {activeFilter === "all" ? "items" : activeFilter + "s"} available yet
              </h3>
              <p className="text-text-secondary">
                Tools and tutorials will appear here when added by management
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => {
            const Icon = getIcon(tool.icon);
            const isTutorial = tool.type === "tutorial";

            return (
              <Card
                key={tool.id}
                className="p-6 bg-card-bg border-border-subtle hover:border-cyan-accent/30 transition-all group cursor-pointer"
                onClick={() => handleToolClick(tool)}
                style={{ backgroundColor: "#1A1A1A" }}
              >
                <div className="space-y-4">
                  {/* Icon & Type Badge */}
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
                        isTutorial
                          ? "bg-violet/10 group-hover:bg-violet/20"
                          : "bg-cyan-accent/10 group-hover:bg-cyan-accent/20"
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${
                          isTutorial ? "text-violet" : "text-cyan-accent"
                        }`}
                      />
                    </div>
                    {isTutorial && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-violet/10 border border-violet/20">
                        <PlayCircle className="h-3 w-3 text-violet" />
                        <span className="text-xs text-violet">Tutorial</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <h3 className="text-white group-hover:text-cyan-accent transition-colors">
                        {tool.name}
                      </h3>
                      <ExternalLink className="h-4 w-4 text-text-secondary group-hover:text-cyan-accent transition-colors flex-shrink-0" />
                    </div>
                    <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                      {tool.description}
                    </p>
                    {tool.category && (
                      <span
                        className={`inline-block text-xs px-2 py-1 rounded-full ${
                          isTutorial
                            ? "bg-violet/10 text-violet border border-violet/20"
                            : "bg-cyan-accent/10 text-cyan-accent border border-cyan-accent/20"
                        }`}
                      >
                        {tool.category}
                      </span>
                    )}
                  </div>

                  {/* Action Button */}
                  <Button
                    className={`w-full ${
                      isTutorial
                        ? "bg-violet/5 hover:bg-violet hover:text-white text-violet border border-violet/20"
                        : "bg-cyan-accent/5 hover:bg-cyan-accent hover:text-dark-bg text-cyan-accent border border-cyan-accent/20"
                    } transition-all`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToolClick(tool);
                    }}
                  >
                    {isTutorial ? "Watch Tutorial" : "Launch Tool"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Info Card */}
      {filteredTools.length > 0 && (
        <Card
          className="p-6 bg-gradient-to-br from-cyan-accent/5 to-violet/5 border-border-subtle"
          style={{ backgroundColor: "transparent" }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-accent/20 to-violet/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-6 w-6 text-cyan-accent" />
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">Need something else?</h3>
              <p className="text-text-secondary text-sm">
                If you need a specific tool or tutorial that's not listed here,
                contact your team administrator to have it added.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
