import { useStore } from "@/lib/store";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, Play, Box } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function ModulesPage() {
  const { modules, unlockModule, user } = useStore();
  const { toast } = useToast();

  const handleUnlock = (moduleId: string, cost: number) => {
    if (!user) return;
    if (user.cubes < cost) {
      toast({
        title: "Insufficient Cubes",
        description: `You need ${cost} cubes to unlock this module.`,
        variant: "destructive",
      });
      return;
    }
    
    if (unlockModule(moduleId)) {
      toast({
        title: "Module Unlocked",
        description: "Access granted. Good luck.",
      });
    }
  };

  const standardModules = modules.filter(m => !m.isSpecial);

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-6">
        <h2 className="text-3xl font-bold font-mono tracking-tight text-primary">TRAINING MODULES</h2>
        <p className="text-muted-foreground mt-2">Core competency training curriculum.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {standardModules.map((module) => (
          <Card key={module.id} className={`bg-card/40 border-primary/10 transition-all hover:border-primary/40 ${!module.unlocked ? 'opacity-75' : ''}`}>
            <CardContent className="p-6 h-[180px] flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <Badge variant={module.type === 'free' ? 'secondary' : 'outline'} className={module.type === 'cube' ? 'border-secondary text-secondary' : ''}>
                  {module.type.toUpperCase()}
                </Badge>
                {module.unlocked ? (
                  <Unlock className="w-5 h-5 text-primary" />
                ) : (
                  <Lock className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <h3 className="text-xl font-bold mb-2 line-clamp-1">{module.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3">{module.description}</p>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              {module.unlocked ? (
                <Link href={`/modules/${module.id}`} className="w-full">
                  <Button className="w-full bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 border">
                    ENTER MODULE <Play className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Button 
                  className="w-full" 
                  variant="secondary"
                  onClick={() => handleUnlock(module.id, module.cubeCost)}
                >
                  {module.cubeCost === 0 ? "UNLOCK FOR FREE" : (
                    <span className="flex items-center">
                      UNLOCK FOR {module.cubeCost} <Box className="w-4 h-4 ml-2" />
                    </span>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
