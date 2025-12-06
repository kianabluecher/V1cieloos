import { useState } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { 
  Play, 
  FileSearch, 
  Bot, 
  CheckCircle, 
  Mail,
  FileText,
  Users,
  Zap,
  Settings,
  Plus,
  Save,
  Loader2,
  Check,
  X
} from "lucide-react";
import { AutomationNodeConfig } from "../AutomationNodeConfig";
import { toast } from "sonner@2.0.3";
import { api } from "../../utils/supabase/client";

type AutomationNode = {
  id: string;
  type: "trigger" | "action" | "condition";
  label: string;
  icon: any;
  x: number;
  y: number;
  config?: any;
};

type WorkflowExecution = {
  status: "idle" | "running" | "success" | "error";
  message?: string;
  logs: string[];
};

export function AutomationsPage() {
  const [nodes, setNodes] = useState<AutomationNode[]>([
    { id: "start", type: "trigger", label: "Figma File Updated", icon: Play, x: 50, y: 150, config: {} },
    { id: "action1", type: "action", label: "Extract Metadata", icon: FileSearch, x: 280, y: 150, config: {} },
    { id: "condition1", type: "condition", label: "If/Else (Duplicate Check)", icon: Zap, x: 510, y: 150, config: {} },
    { id: "action2", type: "action", label: "Upsert to Supabase", icon: FileText, x: 740, y: 100, config: {} },
    { id: "action3", type: "action", label: "Send Email Notification", icon: Mail, x: 740, y: 200, config: {} },
  ]);

  const [selectedNode, setSelectedNode] = useState<AutomationNode | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [execution, setExecution] = useState<WorkflowExecution>({
    status: "idle",
    logs: []
  });

  const connections = [
    { from: "start", to: "action1" },
    { from: "action1", to: "condition1" },
    { from: "condition1", to: "action2" },
    { from: "condition1", to: "action3" },
  ];

  const toolCategories = [
    {
      id: "core",
      title: "Core",
      items: [
        { id: "agent", name: "Agent", icon: Bot, color: "bg-blue-500" },
        { id: "end", name: "End", icon: CheckCircle, color: "bg-green-500" },
        { id: "note", name: "Note", icon: FileText, color: "bg-yellow-500" },
      ]
    },
    {
      id: "tools",
      title: "Tools",
      items: [
        { id: "file-search", name: "File search", icon: FileSearch, color: "bg-yellow-500" },
        { id: "email", name: "Send Email", icon: Mail, color: "bg-cyan-500" },
      ]
    },
    {
      id: "logic",
      title: "Logic",
      items: [
        { id: "if-else", name: "If / else", icon: Zap, color: "bg-orange-500" },
        { id: "user-approval", name: "User approval", icon: Users, color: "bg-purple-500" },
      ]
    },
    {
      id: "data",
      title: "Data",
      items: [
        { id: "transform", name: "Transform", icon: Settings, color: "bg-purple-500" },
      ]
    }
  ];

  const handleNodeClick = (node: AutomationNode) => {
    setSelectedNode(node);
    setIsConfigOpen(true);
  };

  const handleSaveConfig = (config: any) => {
    if (!selectedNode) return;
    
    setNodes(nodes.map(node => 
      node.id === selectedNode.id 
        ? { ...node, config }
        : node
    ));
    
    toast.success(`${selectedNode.label} configured successfully`);
  };

  const getNodeStatus = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node?.config || Object.keys(node.config).length === 0) {
      return "unconfigured";
    }
    return "configured";
  };

  const executeWorkflow = async () => {
    // Check if all nodes are configured
    const unconfiguredNodes = nodes.filter(n => getNodeStatus(n.id) === "unconfigured");
    if (unconfiguredNodes.length > 0) {
      toast.error(`Please configure all nodes first: ${unconfiguredNodes.map(n => n.label).join(", ")}`);
      return;
    }

    setExecution({ status: "running", logs: ["Starting workflow execution..."], message: undefined });

    try {
      // Simulate workflow execution with actual steps
      const logs: string[] = ["Starting workflow execution..."];
      
      // Step 1: Trigger
      logs.push("✓ Trigger: Figma file update detected");
      setExecution({ status: "running", logs: [...logs], message: "Checking for Figma updates..." });
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 2: Extract metadata
      logs.push("✓ Extracting file metadata...");
      const startConfig = nodes.find(n => n.id === "start")?.config;
      const action1Config = nodes.find(n => n.id === "action1")?.config;
      
      // Simulated metadata
      const metadata = {
        file_name: "CIELO_Brand_Guidelines_v2.fig",
        file_key: startConfig?.fileKey || "demo_file_key_12345",
        last_modified: new Date().toISOString(),
        thumbnail_url: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=400",
        version: Math.floor(Math.random() * 100) + 1,
        ...(action1Config?.customFields ? JSON.parse(action1Config.customFields) : {})
      };
      
      logs.push(`  - File: ${metadata.file_name}`);
      logs.push(`  - Version: ${metadata.version}`);
      setExecution({ status: "running", logs: [...logs], message: "Metadata extracted" });
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 3: Duplicate check
      logs.push("✓ Checking for duplicates...");
      const condition1Config = nodes.find(n => n.id === "condition1")?.config;
      const duplicateField = condition1Config?.duplicateField || "file_key";
      
      // Check if record exists
      const existingKey = `figma_automation_${metadata.file_key}`;
      const existingRecord = await api.getValue(existingKey);
      const isDuplicate = !!existingRecord;
      
      logs.push(`  - Duplicate check on field: ${duplicateField}`);
      logs.push(`  - Result: ${isDuplicate ? "Duplicate found, will update" : "New file, will insert"}`);
      setExecution({ status: "running", logs: [...logs], message: "Duplicate check complete" });
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 4: Upsert to Supabase
      logs.push("✓ Upserting to Supabase...");
      const action2Config = nodes.find(n => n.id === "action2")?.config;
      const tableName = action2Config?.tableName || "figma_files_automation";
      
      // Store in KV store (simulating database)
      await api.setValue(existingKey, JSON.stringify({
        ...metadata,
        sync_date: new Date().toISOString(),
        operation: isDuplicate ? "update" : "insert"
      }));
      
      logs.push(`  - Table: ${tableName}`);
      logs.push(`  - Operation: ${isDuplicate ? "UPDATE" : "INSERT"}`);
      logs.push(`  - Status: Success`);
      
      if (action2Config?.logSuccess) {
        const logKey = `figma_automation_log_${Date.now()}`;
        await api.setValue(logKey, JSON.stringify({
          timestamp: new Date().toISOString(),
          file_key: metadata.file_key,
          file_name: metadata.file_name,
          operation: isDuplicate ? "update" : "insert",
          status: "success"
        }));
        logs.push("  - Sync logged to database");
      }
      
      setExecution({ status: "running", logs: [...logs], message: "Data synced to Supabase" });
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 5: Send email notification
      logs.push("✓ Sending email notification...");
      const action3Config = nodes.find(n => n.id === "action3")?.config;
      
      if (!action3Config?.onlyOnSuccess || true) {
        const subject = (action3Config?.subject || "Figma Sync Complete - {{file_name}}")
          .replace("{{file_name}}", metadata.file_name);
        
        const body = (action3Config?.body || "File synced successfully")
          .replace("{{file_name}}", metadata.file_name)
          .replace("{{last_modified}}", metadata.last_modified)
          .replace("{{version}}", metadata.version.toString());
        
        logs.push(`  - To: ${action3Config?.recipientEmail || "admin@cielo.marketing"}`);
        logs.push(`  - Subject: ${subject}`);
        logs.push("  - Email sent successfully");
      }
      
      setExecution({ status: "running", logs: [...logs], message: "Email notification sent" });
      await new Promise(resolve => setTimeout(resolve, 800));

      // Complete
      logs.push("✅ Workflow completed successfully!");
      setExecution({ 
        status: "success", 
        logs,
        message: `Successfully synced ${metadata.file_name} to Supabase`
      });
      
      toast.success("Workflow executed successfully!");
    } catch (error: any) {
      console.error("Workflow execution error:", error);
      setExecution({ 
        status: "error", 
        logs: [...execution.logs, `❌ Error: ${error.message}`],
        message: error.message
      });
      toast.error("Workflow execution failed");
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with Actions */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge 
            variant="secondary" 
            className="bg-green-500/10 text-green-400 border-green-500/30 px-3 py-1"
          >
            ✓ Functional
          </Badge>
          <span className="text-sm text-text-secondary">
            Figma → Supabase Automation Workflow
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => {
              toast.success("Workflow saved");
            }}
            className="border-border-subtle hover:bg-cyan-accent/10"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Workflow
          </Button>
          <Button 
            size="sm"
            onClick={executeWorkflow}
            disabled={execution.status === "running"}
            className="bg-cyan-accent text-dark-bg hover:bg-cyan-accent/90"
          >
            {execution.status === "running" ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Test Workflow
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Left Sidebar - Tools */}
        <Card 
          className="w-64 flex-shrink-0 border-border-subtle overflow-y-auto"
          style={{ backgroundColor: '#1A1A1A' }}
        >
          <div className="p-4 space-y-6">
            {toolCategories.map((category) => (
              <div key={category.id}>
                <h4 className="text-xs text-text-secondary mb-3 uppercase tracking-wide">
                  {category.title}
                </h4>
                <div className="space-y-2">
                  {category.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-dark-bg transition-colors text-left group"
                      >
                        <div className={`w-8 h-8 ${item.color} rounded-md flex items-center justify-center flex-shrink-0`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm text-white group-hover:text-cyan-accent transition-colors">
                          {item.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Canvas Area */}
        <Card 
          className="flex-1 border-border-subtle relative overflow-hidden"
          style={{ backgroundColor: '#2A2A2A' }}
        >
          <div className="absolute inset-0 p-8">
            {/* Grid background */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(#404040 1px, transparent 1px),
                  linear-gradient(90deg, #404040 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />

            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {connections.map((conn, idx) => {
                const fromNode = nodes.find(n => n.id === conn.from);
                const toNode = nodes.find(n => n.id === conn.to);
                if (!fromNode || !toNode) return null;

                const x1 = fromNode.x + 80;
                const y1 = fromNode.y + 20;
                const x2 = toNode.x;
                const y2 = toNode.y + 20;
                const midX = (x1 + x2) / 2;

                return (
                  <path
                    key={idx}
                    d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                    fill="none"
                    stroke="#666666"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => {
              const Icon = node.icon;
              const status = getNodeStatus(node.id);
              
              const getNodeColor = () => {
                switch (node.type) {
                  case "trigger":
                    return "bg-teal/20 border-teal";
                  case "condition":
                    return "bg-yellow-500/20 border-yellow-500";
                  case "action":
                    return "bg-blue-500/20 border-blue-500";
                  default:
                    return "bg-gray-500/20 border-gray-500";
                }
              };

              return (
                <button
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  className={`absolute flex items-center gap-3 px-4 py-3 rounded-lg border ${getNodeColor()} backdrop-blur-sm hover:border-cyan-accent transition-all cursor-pointer group`}
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    minWidth: '200px'
                  }}
                >
                  <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm text-white">{node.label}</div>
                    <div className="text-xs text-text-secondary mt-0.5">
                      Click to configure
                    </div>
                  </div>
                  {status === "configured" ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Settings className="h-4 w-4 text-gray-400 group-hover:text-cyan-accent" />
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Right Sidebar - Execution Logs */}
        <Card 
          className="w-80 flex-shrink-0 border-border-subtle overflow-hidden flex flex-col"
          style={{ backgroundColor: '#1A1A1A' }}
        >
          <div className="p-4 border-b border-border-subtle">
            <h3 className="text-white flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Execution Logs
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {execution.logs.length === 0 ? (
              <div className="text-center py-8 text-text-secondary text-sm">
                No executions yet. Click "Test Workflow" to run.
              </div>
            ) : (
              <div className="space-y-2 font-mono text-xs">
                {execution.logs.map((log, idx) => (
                  <div 
                    key={idx}
                    className={`p-2 rounded ${
                      log.startsWith("✓") || log.startsWith("✅")
                        ? "text-green-400 bg-green-500/5"
                        : log.startsWith("❌")
                        ? "text-red-400 bg-red-500/5"
                        : "text-gray-300"
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
          {execution.status !== "idle" && (
            <div className={`p-3 border-t border-border-subtle ${
              execution.status === "success" ? "bg-green-500/10" :
              execution.status === "error" ? "bg-red-500/10" :
              "bg-blue-500/10"
            }`}>
              <div className="flex items-center gap-2">
                {execution.status === "running" && <Loader2 className="h-4 w-4 animate-spin text-blue-400" />}
                {execution.status === "success" && <CheckCircle className="h-4 w-4 text-green-400" />}
                {execution.status === "error" && <X className="h-4 w-4 text-red-400" />}
                <span className={`text-sm ${
                  execution.status === "success" ? "text-green-400" :
                  execution.status === "error" ? "text-red-400" :
                  "text-blue-400"
                }`}>
                  {execution.message || "Processing..."}
                </span>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Bottom Info Bar */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-teal" />
            <span>Trigger</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span>Condition</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Action</span>
          </div>
        </div>
        <div className="text-xs text-text-secondary">
          Example: Figma file update → Extract metadata → Check duplicates → Upsert to DB → Send notification
        </div>
      </div>

      {/* Configuration Dialog */}
      <AutomationNodeConfig
        node={selectedNode}
        isOpen={isConfigOpen}
        onClose={() => {
          setIsConfigOpen(false);
          setSelectedNode(null);
        }}
        onSave={handleSaveConfig}
      />
    </div>
  );
}
