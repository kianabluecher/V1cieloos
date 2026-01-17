import { AlertCircle, Database, ExternalLink, Copy, CheckCircle2 } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useState } from "react";

interface SetupHelperProps {
  error?: string;
  onDismiss?: () => void;
}

export function SetupHelper({ error, onDismiss }: SetupHelperProps) {
  const [copiedSQL, setCopiedSQL] = useState(false);
  const [copiedGrant, setCopiedGrant] = useState(false);
  
  // Only show if error mentions missing table
  if (!error || !error.includes('kv_store_c3abf285') || !error.includes('does not exist')) {
    return null;
  }

  const createTableSQL = `CREATE TABLE IF NOT EXISTS public.kv_store_c3abf285 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);`;

  const grantSQL = `GRANT ALL ON public.kv_store_c3abf285 TO postgres;
GRANT ALL ON public.kv_store_c3abf285 TO service_role;
GRANT ALL ON public.kv_store_c3abf285 TO authenticated;
GRANT ALL ON public.kv_store_c3abf285 TO anon;`;

  const copyToClipboard = async (text: string, type: 'sql' | 'grant') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'sql') {
        setCopiedSQL(true);
        setTimeout(() => setCopiedSQL(false), 2000);
      } else {
        setCopiedGrant(true);
        setTimeout(() => setCopiedGrant(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-[#0D0D0E] border-[#1F1F23] p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <AlertCircle className="h-6 w-6 text-yellow-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white mb-1">
              Database Setup Required
            </h2>
            <p className="text-sm text-gray-400">
              The KV store table is missing. Follow these steps to create it:
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4 mt-6">
          {/* Step 1 */}
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#A6E0FF]/10 border border-[#A6E0FF]/20 flex items-center justify-center">
              <span className="text-sm font-semibold text-[#A6E0FF]">1</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium mb-2">Open Supabase SQL Editor</p>
              <Button
                variant="outline"
                size="sm"
                className="border-[#1F1F23] hover:bg-[#1F1F23] text-gray-300"
                onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Supabase Dashboard
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Then go to: SQL Editor → New query
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#A6E0FF]/10 border border-[#A6E0FF]/20 flex items-center justify-center">
              <span className="text-sm font-semibold text-[#A6E0FF]">2</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium mb-2">Create the table</p>
              <div className="relative">
                <pre className="bg-[#0A0A0B] border border-[#1F1F23] rounded-lg p-3 text-xs text-gray-300 overflow-x-auto">
                  {createTableSQL}
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-7 text-xs"
                  onClick={() => copyToClipboard(createTableSQL, 'sql')}
                >
                  {copiedSQL ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#A6E0FF]/10 border border-[#A6E0FF]/20 flex items-center justify-center">
              <span className="text-sm font-semibold text-[#A6E0FF]">3</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium mb-2">Grant permissions</p>
              <div className="relative">
                <pre className="bg-[#0A0A0B] border border-[#1F1F23] rounded-lg p-3 text-xs text-gray-300 overflow-x-auto">
                  {grantSQL}
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-7 text-xs"
                  onClick={() => copyToClipboard(grantSQL, 'grant')}
                >
                  {copiedGrant ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#A6E0FF]/10 border border-[#A6E0FF]/20 flex items-center justify-center">
              <span className="text-sm font-semibold text-[#A6E0FF]">4</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium mb-2">Refresh the dashboard</p>
              <p className="text-sm text-gray-400">
                Wait 10-15 seconds for the schema cache to update, then refresh this page.
              </p>
              <Button
                variant="default"
                size="sm"
                className="mt-2 bg-[#A6E0FF] text-black hover:bg-[#A6E0FF]/90"
                onClick={() => window.location.reload()}
              >
                <Database className="h-4 w-4 mr-2" />
                Refresh Page
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#1F1F23]">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Database className="h-4 w-4" />
            <span>This is a one-time setup. The table will persist across deployments.</span>
          </div>
        </div>

        {/* Dismiss button (optional) */}
        {onDismiss && (
          <div className="mt-4">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-gray-400 hover:text-white"
              onClick={onDismiss}
            >
              I'll set this up later
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
