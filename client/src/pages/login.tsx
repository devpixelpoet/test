import { useState } from "react";
import { Link } from "wouter";
import { useLogin } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Terminal, Lock, User } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      loginMutation.mutate({ username, password });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,128,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,128,0.03)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      <Card className="w-full max-w-md bg-card/80 backdrop-blur border-primary/20 shadow-[0_0_20px_rgba(0,255,128,0.1)] relative z-10">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 border border-primary/20">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold font-mono text-primary tracking-tighter">
            SYSTEM AUTHENTICATION
          </CardTitle>
          <p className="text-sm text-muted-foreground">Enter your credentials to access the mainframe</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="username" 
                  placeholder="usr_root" 
                  className="pl-10 font-mono bg-background/50 border-primary/20 focus-visible:ring-primary"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10 font-mono bg-background/50 border-primary/20 focus-visible:ring-primary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/50 font-mono"
              disabled={loginMutation.isPending}
              data-testid="button-login"
            >
              <Terminal className="w-4 h-4 mr-2" /> 
              {loginMutation.isPending ? "AUTHENTICATING..." : "AUTHENTICATE"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
          <p>Don't have an account?</p>
          <Link href="/register" className="text-primary hover:underline underline-offset-4">
            Request Access
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
