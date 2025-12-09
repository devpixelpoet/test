import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Terminal, Activity } from "lucide-react";

export default function ProfilePage() {
  const { user, modules } = useStore();

  const completedModules = modules.filter(m => m.progress === 100);
  const inProgressModules = modules.filter(m => m.progress > 0 && m.progress < 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-32 h-32 rounded-full border-4 border-primary/20 bg-card flex items-center justify-center overflow-hidden">
             <User className="w-16 h-16 text-muted-foreground" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-4">
             <h1 className="text-4xl font-bold font-mono text-primary">{user?.username}</h1>
             <span className="bg-primary/10 text-primary px-3 py-1 rounded text-xs font-bold border border-primary/20">USER</span>
          </div>
          <p className="text-muted-foreground">Cyber Security Enthusiast • Level 4</p>
          <div className="flex gap-4 mt-4 text-sm font-mono">
             <div className="bg-card px-4 py-2 rounded border border-border">
                <span className="text-muted-foreground">CUBES:</span> <span className="text-secondary font-bold">{user?.cubes}</span>
             </div>
             <div className="bg-card px-4 py-2 rounded border border-border">
                <span className="text-muted-foreground">RANK:</span> <span className="text-foreground font-bold">#1337</span>
             </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="bg-card/50 border border-border w-full justify-start h-12">
          <TabsTrigger value="activity" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary h-full px-6">Activity</TabsTrigger>
          <TabsTrigger value="modules" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary h-full px-6">Modules</TabsTrigger>
          <TabsTrigger value="badges" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary h-full px-6">Badges</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="mt-6 space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-primary" /> RECENT ACTIVITY
            </h3>
            {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-4 p-4 bg-card/30 border border-border/50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div className="flex-1">
                        <p className="font-bold">Completed "Linux Fundamentals" Page {i}</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                    <span className="text-xs font-mono text-primary">+10 PTS</span>
                </div>
            ))}
        </TabsContent>

        <TabsContent value="modules" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {inProgressModules.map(m => (
                     <Card key={m.id} className="bg-card/30 border-border">
                         <CardHeader className="pb-2">
                             <CardTitle className="text-base">{m.title}</CardTitle>
                         </CardHeader>
                         <CardContent>
                             <div className="flex justify-between text-xs mb-2">
                                 <span>Progress</span>
                                 <span>{m.progress}%</span>
                             </div>
                             <Progress value={m.progress} />
                         </CardContent>
                     </Card>
                 ))}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
