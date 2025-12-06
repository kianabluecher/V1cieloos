import { Card } from "../ui/card";
import { useEffect, useState } from "react";
import { api } from "../../utils/supabase/client";
import { Loader2, Lock } from "lucide-react";
import { Badge } from "../ui/badge";

export function SocialMediaPage() {
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
      setUrl(result.data.socialMediaUrl || "https://share.plannthat.com/b/6f35260f05f20f99c0a9a88dff06ad11/2042127/grid");
      setIsLocked(result.data.socialMediaLocked || false);
    } else {
      // Default URL if no settings found
      setUrl("https://share.plannthat.com/b/6f35260f05f20f99c0a9a88dff06ad11/2042127/grid");
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
          <h3 className="text-white">Social Media Management</h3>
          <p className="text-text-secondary mt-1">
            View and manage your social media content calendar
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
              title="Social Media Management"
              allow="fullscreen"
            />
          </div>
        </Card>
      </Card>

      {/* Info Footer */}
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <p>Content updates in real-time</p>
        <p>Powered by Plann That</p>
      </div>
    </div>
  );
}
