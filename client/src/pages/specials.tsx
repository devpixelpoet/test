import { useStore } from "@/lib/store";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, Play, Box, ShieldAlert } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function SpecialsPage() {
  const { modules, unlockModule, user } = useStore();
  const { toast } = useToast();

  const handleUnlock = (moduleId: string, cost: number) => {
    if (!user) return;
    if (user.cubes < cost) {
      toast({
        title: "Insufficient Cubes",
        description: `You need ${cost} cubes to unlock this special module.`,
        variant: "destructive",
      });
      return;
    }
    
    if (unlockModule(moduleId)) {
      toast({
        title: "Special Module Unlocked",
        description: "Access granted. Prepare yourself.",
      });
    }
  };

  const specialModules = modules.filter(m => m.isSpecial);

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-6">
        <h2 className="text-3xl font-bold font-mono tracking-tight text-purple-500">SPECIAL OPERATIONS</h2>
        <p className="text-muted-foreground mt-2">Advanced challenges and classified simulations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {specialModules.map((module) => (
          <Card key={module.id} className="bg-gradient-to-br from-card/40 to-purple-900/10 border-purple-500/20 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-600" />
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                 <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <ShieldAlert className="w-8 h-8 text-purple-500" />
                 </div>
                 {module.unlocked ? <Unlock className="text-purple-500" /> : <Lock className="text-muted-foreground" />}
              </div>
              
              <h3 className="text-2xl font-bold mb-3">{module.title}</h3>
              <p className="text-muted-foreground mb-6">{module.description}</p>
              
              <div className="flex items-center justify-between text-sm font-mono text-purple-300 bg-purple-950/30 p-2 rounded border border-purple-500/10 mb-6">
                <span>SECURITY LEVEL</span>
                <span>CLASSIFIED</span>
              </div>

              {module.unlocked ? (
                <Link href={`/modules/${module.id}`}>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    INITIATE OPERATION
                  </Button>
                </Link>
              ) : (
                 <Button 
                  className="w-full bg-transparent border border-purple-500/50 text-purple-400 hover:bg-purple-500/10" 
                  onClick={() => handleUnlock(module.id, module.cubeCost)}
                >
                  UNLOCK ACCESS ({module.cubeCost} CUBES)
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
        
        {specialModules.length === 0 && (
           <div className="col-span-2 text-center p-12 border border-dashed border-border rounded-lg">
             <ShieldAlert className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
             <h3 className="text-xl font-bold text-muted-foreground">NO SPECIAL OPS AVAILABLE</h3>
             <p className="text-sm text-muted-foreground/60">Check back later for new contracts.</p>
           </div>
        )}
      </div>
    </div>
  );
}
