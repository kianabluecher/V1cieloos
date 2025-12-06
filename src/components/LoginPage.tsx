import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Bot, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner@2.0.3";

type LoginPageProps = {
  onLogin: (email: string, password: string) => Promise<void>;
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      await onLogin(email, password);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid credentials");
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

            <Button
              type="submit"
              className="w-full bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
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
    </div>
  );
}
