import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { LoginCredentials } from "../types/auth";
import { getDemoAccounts } from "../data/mockAuth";
import { Building2, AlertCircle, Eye, EyeOff } from "lucide-react";

interface LoginProps {
  onLogin: (credentials: LoginCredentials) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function Login({ onLogin, isLoading, error }: LoginProps) {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const demoAccounts = getDemoAccounts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(credentials);
  };

  const handleDemoLogin = (accountType: keyof typeof demoAccounts) => {
    const account = demoAccounts[accountType];
    setCredentials({
      email: account.email,
      password: account.password
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-primary text-primary-foreground p-3 rounded-lg">
              <Building2 className="size-8" />
            </div>
          </div>
          <h1>ICT Asset Inventory</h1>
          <p className="text-muted-foreground">
            Sign in to access your asset management system
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4 text-muted-foreground" />
                    ) : (
                      <Eye className="size-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t space-y-3">
              <p className="text-sm text-muted-foreground text-center">Demo Accounts</p>
              <div className="grid gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => handleDemoLogin('admin')}
                  disabled={isLoading}
                >
                  <div className="flex flex-col">
                    <div className="font-medium">Admin Access</div>
                    <div className="text-xs text-muted-foreground">robert.brown@company.com</div>
                  </div>
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => handleDemoLogin('manager')}
                  disabled={isLoading}
                >
                  <div className="flex flex-col">
                    <div className="font-medium">Manager Access</div>
                    <div className="text-xs text-muted-foreground">jane.smith@company.com</div>
                  </div>
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => handleDemoLogin('user')}
                  disabled={isLoading}
                >
                  <div className="flex flex-col">
                    <div className="font-medium">User Access</div>
                    <div className="text-xs text-muted-foreground">john.doe@company.com</div>
                  </div>
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => handleDemoLogin('viewer')}
                  disabled={isLoading}
                >
                  <div className="flex flex-col">
                    <div className="font-medium">Viewer Access</div>
                    <div className="text-xs text-muted-foreground">alice.johnson@company.com</div>
                  </div>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Click any demo account to auto-fill credentials
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}