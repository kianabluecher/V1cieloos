import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { X, ExternalLink, CheckCircle2 } from "lucide-react";

type GoogleOAuthSetupDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function GoogleOAuthSetupDialog({ isOpen, onClose }: GoogleOAuthSetupDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="bg-card-bg border-border-subtle p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl text-white mb-2">Google Sign-In Setup Required</h2>
            <p className="text-text-secondary">
              Follow these steps to enable Google authentication for CIELO OS
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-text-secondary hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-accent/10 border border-cyan-accent/30 flex items-center justify-center text-cyan-accent font-semibold">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">Open Supabase Dashboard</h3>
              <p className="text-text-secondary text-sm mb-3">
                Go to your Supabase project dashboard and navigate to the Authentication section.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-border-subtle text-white hover:bg-cyan-accent/10"
                onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
              >
                Open Supabase Dashboard
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-accent/10 border border-cyan-accent/30 flex items-center justify-center text-cyan-accent font-semibold">
              2
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">Navigate to Providers</h3>
              <p className="text-text-secondary text-sm">
                Click on <strong className="text-white">Authentication</strong> → <strong className="text-white">Providers</strong> in the sidebar.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-accent/10 border border-cyan-accent/30 flex items-center justify-center text-cyan-accent font-semibold">
              3
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">Enable Google Provider</h3>
              <p className="text-text-secondary text-sm mb-3">
                Find "Google" in the list of providers and click to enable it.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-accent/10 border border-cyan-accent/30 flex items-center justify-center text-cyan-accent font-semibold">
              4
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">Create Google OAuth Credentials</h3>
              <p className="text-text-secondary text-sm mb-3">
                You'll need to create OAuth 2.0 credentials in Google Cloud Console:
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Go to Google Cloud Console → APIs & Services → Credentials</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Create OAuth 2.0 Client ID (Web application type)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Add authorized redirect URI from Supabase</span>
                </li>
              </ul>
              <Button
                variant="outline"
                size="sm"
                className="border-border-subtle text-white hover:bg-cyan-accent/10 mt-3"
                onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}
              >
                Open Google Cloud Console
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-accent/10 border border-cyan-accent/30 flex items-center justify-center text-cyan-accent font-semibold">
              5
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">Add Credentials to Supabase</h3>
              <p className="text-text-secondary text-sm">
                Copy the Client ID and Client Secret from Google Cloud Console and paste them into the Supabase Google provider settings.
              </p>
            </div>
          </div>

          {/* Step 6 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-accent/10 border border-cyan-accent/30 flex items-center justify-center text-cyan-accent font-semibold">
              6
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">Save and Test</h3>
              <p className="text-text-secondary text-sm">
                Save your settings in Supabase and try signing in with Google again!
              </p>
            </div>
          </div>

          {/* Documentation Link */}
          <div className="pt-4 border-t border-border-subtle">
            <p className="text-text-secondary text-sm mb-3">
              For detailed instructions with screenshots, check out the official documentation:
            </p>
            <Button
              variant="outline"
              className="w-full border-border-subtle text-white hover:bg-cyan-accent/10"
              onClick={() => window.open('https://supabase.com/docs/guides/auth/social-login/auth-google', '_blank')}
            >
              View Complete Setup Guide
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Close Button */}
          <div className="pt-4">
            <Button
              className="w-full bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
              onClick={onClose}
            >
              Got it, I'll set this up
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
