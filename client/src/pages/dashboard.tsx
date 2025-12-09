import { useState } from "react";
import { useStore } from "@/lib/store";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Terminal, CheckCircle2, Circle, Lock, Play } from "lucide-react";

export default function Dashboard() {
  const { user, modules } = useStore();

  const activeModules = modules.filter(m => m.progress > 0 && m.progress < 100);
  const completedModules = modules.filter(m => m.progress === 100);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold font-mono text-primary mb-2">
            WELCOME BACK, {user?.username.toUpperCase()}
          </h2>
          <p className="text-muted-foreground">System ready. Continue your training.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground font-mono">GLOBAL RANK</p>
          <p className="text-2xl font-bold">#1337</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground font-mono">MODULES COMPLETED</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{completedModules.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground font-mono">OWNED CUBES</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-secondary">{user?.cubes}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground font-mono">SYSTEM STATUS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-500">ONLINE</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Modules */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" />
          ACTIVE MODULES
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeModules.length > 0 ? (
            activeModules.map((module) => (
              <Card key={module.id} className="border-primary/20 bg-card/40 hover:bg-card/60 transition-colors group">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{module.title}</h4>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    </div>
                    {module.isSpecial && (
                      <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded border border-purple-500/30">SPECIAL</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span>PROGRESS</span>
                      <span>{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="h-2 bg-secondary/20" />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Link href={`/modules/${module.id}`}>
                      <Button size="sm" variant="outline" className="border-primary/30 hover:bg-primary/10 hover:text-primary">
                        CONTINUE <Play className="w-3 h-3 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-2 p-8 border border-dashed border-border rounded-lg text-center text-muted-foreground">
              No active modules. Start a new module from the list.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
