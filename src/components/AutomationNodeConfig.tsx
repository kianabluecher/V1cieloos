import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { CheckCircle } from "lucide-react";

interface AutomationNodeConfigProps {
  node: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
}

export function AutomationNodeConfig({ node, isOpen, onClose, onSave }: AutomationNodeConfigProps) {
  const [config, setConfig] = useState(node?.config || {});

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  if (!node) return null;

  const renderConfigFields = () => {
    switch (node.id) {
      case "start":
        return (
          <div className="space-y-4">
            <div>
              <Label>Trigger Type</Label>
              <Select 
                value={config.triggerType || "figma_update"}
                onValueChange={(value) => setConfig({ ...config, triggerType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="figma_update">Figma File Updated</SelectItem>
                  <SelectItem value="figma_create">Figma File Created</SelectItem>
                  <SelectItem value="manual">Manual Trigger</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Figma File Key (Optional)</Label>
              <Input 
                placeholder="Leave empty to monitor all files"
                value={config.fileKey || ""}
                onChange={(e) => setConfig({ ...config, fileKey: e.target.value })}
              />
              <p className="text-xs text-text-secondary mt-1">
                Enter specific file key or leave empty to monitor all files
              </p>
            </div>
            <div>
              <Label>Polling Interval (minutes)</Label>
              <Input 
                type="number"
                min="1"
                placeholder="5"
                value={config.pollingInterval || "5"}
                onChange={(e) => setConfig({ ...config, pollingInterval: e.target.value })}
              />
            </div>
          </div>
        );

      case "action1":
        return (
          <div className="space-y-4">
            <div>
              <Label>Metadata Fields to Extract</Label>
              <div className="space-y-2 mt-2">
                {["file_name", "file_key", "last_modified", "thumbnail_url", "version"].map((field) => (
                  <div key={field} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={config.fields?.includes(field) ?? true}
                      onChange={(e) => {
                        const fields = config.fields || ["file_name", "file_key", "last_modified", "thumbnail_url", "version"];
                        setConfig({
                          ...config,
                          fields: e.target.checked
                            ? [...fields, field]
                            : fields.filter((f: string) => f !== field)
                        });
                      }}
                      className="rounded"
                    />
                    <Label className="text-sm cursor-pointer">{field}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>Additional Custom Fields (JSON)</Label>
              <Textarea 
                placeholder='{"custom_field": "value"}'
                value={config.customFields || ""}
                onChange={(e) => setConfig({ ...config, customFields: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        );

      case "condition1":
        return (
          <div className="space-y-4">
            <div>
              <Label>Condition Type</Label>
              <Select 
                value={config.conditionType || "duplicate_check"}
                onValueChange={(value) => setConfig({ ...config, conditionType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="duplicate_check">Check for Duplicates</SelectItem>
                  <SelectItem value="custom">Custom Condition</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Duplicate Detection Field</Label>
              <Select 
                value={config.duplicateField || "file_key"}
                onValueChange={(value) => setConfig({ ...config, duplicateField: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="file_key">File Key</SelectItem>
                  <SelectItem value="file_name">File Name</SelectItem>
                  <SelectItem value="id">ID</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pt-2">
              <Label className="text-sm text-text-secondary">Behavior</Label>
              <p className="text-xs text-text-secondary mt-1">
                If duplicate found: Update existing record (UPSERT)
              </p>
              <p className="text-xs text-text-secondary">
                If no duplicate: Insert new record
              </p>
            </div>
          </div>
        );

      case "action2":
        return (
          <div className="space-y-4">
            <div>
              <Label>Table Name</Label>
              <Input 
                value={config.tableName || "figma_files_automation"}
                onChange={(e) => setConfig({ ...config, tableName: e.target.value })}
              />
            </div>
            <div>
              <Label>Operation Type</Label>
              <Select 
                value={config.operation || "upsert"}
                onValueChange={(value) => setConfig({ ...config, operation: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upsert">Upsert (Insert or Update)</SelectItem>
                  <SelectItem value="insert">Insert Only</SelectItem>
                  <SelectItem value="update">Update Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Conflict Column</Label>
              <Input 
                placeholder="file_key"
                value={config.conflictColumn || "file_key"}
                onChange={(e) => setConfig({ ...config, conflictColumn: e.target.value })}
              />
              <p className="text-xs text-text-secondary mt-1">
                Column to check for conflicts during upsert
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                checked={config.logSuccess ?? true}
                onChange={(e) => setConfig({ ...config, logSuccess: e.target.checked })}
                className="rounded"
              />
              <Label className="text-sm cursor-pointer">Log successful syncs to database</Label>
            </div>
          </div>
        );

      case "action3":
        return (
          <div className="space-y-4">
            <div>
              <Label>Recipient Email</Label>
              <Input 
                type="email"
                placeholder="admin@cielo.marketing"
                value={config.recipientEmail || "admin@cielo.marketing"}
                onChange={(e) => setConfig({ ...config, recipientEmail: e.target.value })}
              />
            </div>
            <div>
              <Label>Subject Template</Label>
              <Input 
                placeholder="Figma Sync Complete - {{file_name}}"
                value={config.subject || "Figma Sync Complete - {{file_name}}"}
                onChange={(e) => setConfig({ ...config, subject: e.target.value })}
              />
            </div>
            <div>
              <Label>Email Body Template</Label>
              <Textarea 
                placeholder="File {{file_name}} has been successfully synced to Supabase.&#10;Last Modified: {{last_modified}}&#10;Version: {{version}}"
                value={config.body || "File {{file_name}} has been successfully synced to Supabase.\nLast Modified: {{last_modified}}\nVersion: {{version}}"}
                onChange={(e) => setConfig({ ...config, body: e.target.value })}
                rows={5}
              />
              <p className="text-xs text-text-secondary mt-1">
                Use {`{{field_name}}`} for dynamic values
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.onlyOnSuccess ?? true}
                onChange={(e) => setConfig({ ...config, onlyOnSuccess: e.target.checked })}
                className="rounded"
              />
              <Label className="text-sm cursor-pointer">Only send on successful sync</Label>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-4 text-text-secondary">
            No configuration needed for this node
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card-bg border-border-subtle">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {node.icon && <node.icon className="h-5 w-5" />}
            Configure: {node.label}
          </DialogTitle>
          <DialogDescription>
            {node.type === "trigger" && "Set up when this workflow should run"}
            {node.type === "action" && "Configure the action parameters"}
            {node.type === "condition" && "Define the condition logic"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {renderConfigFields()}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-cyan-accent text-dark-bg hover:bg-cyan-accent/90">
            <CheckCircle className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
