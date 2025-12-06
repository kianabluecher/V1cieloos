import { Card } from "../ui/card";
import { useEffect, useState } from "react";
import { api } from "../../utils/supabase/client";
import { Loader2, Lock } from "lucide-react";
import { Badge } from "../ui/badge";

export function BrandWebPage() {
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    // Using a default client ID for now - in production this would come from auth context
    const clientId = "client-1";
    const result = await api.getClientPortalSettingsByClientId(clientId);
    if (result.success && result.data) {
      setUrl(result.data.brandWebUrl || "https://docs.google.com/spreadsheets/d/1MI7ynnujHwXN91pBVMdQuUmcvmVMI6Vgx4LxoMD9q6E/edit?usp=sharing");
      setIsLocked(result.data.brandWebLocked || false);
    } else {
      // Default URL if no settings found
      setUrl("https://docs.google.com/spreadsheets/d/1MI7ynnujHwXN91pBVMdQuUmcvmVMI6Vgx4LxoMD9q6E/edit?usp=sharing");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white">Brand & Web Assets</h3>
          <p className="text-text-secondary mt-1">
            Access brand guidelines, web assets, and documentation
          </p>
        </div>
        {isLocked && (
          <Badge variant="secondary" className="bg-cyan-accent/10 text-cyan-accent border-cyan-accent/20">
            <Lock className="h-3 w-3 mr-1" />
            Locked
          </Badge>
        )}
      </div>

      {/* Double Border Container */}
      <Card className="p-1 glass-card border-border-subtle bg-gradient-to-br from-cyan-accent/5 to-transparent">
        <Card className="p-0 border-cyan-accent/30 bg-dark-bg overflow-hidden">
          <div className="w-full" style={{ height: "calc(100vh - 200px)" }}>
            <iframe
              src={url}
              className="w-full h-full border-0"
              title="Brand & Web Assets"
              allow="fullscreen"
            />
          </div>
        </Card>
      </Card>

      {/* Info Footer */}
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <p>Spreadsheet updates in real-time</p>
        <p>Powered by Google Sheets</p>
      </div>
    </div>
  );
}
