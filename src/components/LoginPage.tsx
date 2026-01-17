import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Bot, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { api } from "../utils/supabase/client";
import { GoogleOAuthSetupDialog } from "./GoogleOAuthSetupDialog";

type LoginPageProps = {
  onLogin: (email: string, password: string) => Promise<void>;
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showSetupDialog, setShowSetupDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    if (mode === "signup" && !name) {
      toast.error("Please enter your name");
      return;
    }

    setIsLoading(true);
    try {
      if (mode === "signup") {
        const result = await api.signup(email, password, name);
        if (result.success) {
          toast.success("Account created! Please sign in.");
          setMode("signin");
          setPassword("");
        } else {
          toast.error(result.error || "Failed to create account");
        }
      } else {
        await onLogin(email, password);
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(mode === "signup" ? "Failed to create account" : "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await api.googleSignIn();
      if (result.success) {
        // The OAuth flow will redirect to Google and back
        toast.info("Redirecting to Google...");
      } else {
        // Check if it's a provider not enabled error
        if (result.error && (result.error.includes('provider') || result.error.includes('not enabled') || result.error.includes('disabled'))) {
          toast.error("Google Sign-In is not configured yet", {
            description: "Please set up Google OAuth in your Supabase dashboard first",
            duration: 8000,
          });
          console.error('═══════════════════════════════════════════════════════════');
          console.error('⚠️  GOOGLE OAUTH SETUP REQUIRED');
          console.error('═══════════════════════════════════════════════════════════');
          console.error('');
          console.error('To enable Google Sign-In:');
          console.error('');
          console.error('1. Go to: https://supabase.com/dashboard');
          console.error('2. Select your project → Authentication → Providers');
          console.error('3. Find "Google" and click to enable it');
          console.error('4. Follow the setup wizard to:');
          console.error('   - Create OAuth credentials in Google Cloud Console');
          console.error('   - Add authorized redirect URIs');
          console.error('   - Copy Client ID and Client Secret to Supabase');
          console.error('');
          console.error('Full guide: https://supabase.com/docs/guides/auth/social-login/auth-google');
          console.error('═══════════════════════════════════════════════════════════');
          setShowSetupDialog(true);
        } else {
          toast.error(result.error || "Failed to initiate Google sign in");
        }
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      toast.error("Failed to sign in with Google", {
        description: "Google OAuth may not be configured. Check console for setup instructions.",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg dark flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6">
            <img 
              src="figma:asset/d5babf80624045a113c0ea671439c81af2a64dd5.png" 
              alt="Logo" 
              className="h-20 w-20"
            />
          </div>
          <p className="text-text-secondary">
            Sign in to your account
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-card-bg border-border-subtle p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary pl-10 pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="bg-dark-bg border-border-subtle text-white placeholder:text-text-secondary"
                  disabled={isLoading}
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : mode === "signin" ? "Sign In" : "Sign Up"}
            </Button>

            <Button
              type="button"
              className="w-full bg-gray-700 hover:bg-gray-800 text-white"
              disabled={isLoading}
              onClick={handleGoogleSignIn}
            >
              {isLoading ? "Signing in..." : "Sign in with Google"}
            </Button>

            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-sm text-gray-500 hover:text-gray-700"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              >
                {mode === "signin" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-dark-bg rounded-lg border border-border-subtle">
            <p className="text-xs text-text-secondary mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs">
              <p className="text-text-secondary">
                <span className="text-cyan-accent">Client:</span> sarah@client.com / client123
              </p>
              <p className="text-text-secondary">
                <span className="text-teal">Team:</span> john@cielo.marketing / team123
              </p>
              <p className="text-text-secondary">
                <span className="text-violet">Admin:</span> admin@cielo.marketing / admincielo765598
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-border-subtle">
              <p className="text-xs text-text-secondary">
                💡 Your session will be saved. No need to re-login!
              </p>
            </div>
          </div>
        </Card>
      </div>
      <GoogleOAuthSetupDialog isOpen={showSetupDialog} onClose={() => setShowSetupDialog(false)} />
    </div>
  );
}