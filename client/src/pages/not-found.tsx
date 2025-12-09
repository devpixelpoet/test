import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Terminal } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-destructive/50 bg-destructive/5 shadow-[0_0_30px_rgba(255,0,0,0.1)]">
        <CardContent className="pt-6 pb-6 text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center border border-destructive/20 animate-pulse">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-mono font-bold text-destructive tracking-tighter">
              ERROR 404
            </h1>
            <p className="text-xl font-mono text-muted-foreground">
              PAGE_NOT_FOUND
            </p>
          </div>

          <div className="font-mono text-sm text-muted-foreground bg-black/40 p-4 rounded border border-border text-left">
            <p className="text-green-500">$ trace-route {window.location.pathname}</p>
            <p className="text-red-500">Error: Destination unreachable.</p>
            <p className="text-red-500">Status: Connection reset by peer.</p>
            <p className="animate-pulse">_</p>
          </div>

          <Link href="/">
            <Button variant="outline" className="w-full border-destructive/30 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50">
              <Terminal className="w-4 h-4 mr-2" />
              RETURN TO SAFETY
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
