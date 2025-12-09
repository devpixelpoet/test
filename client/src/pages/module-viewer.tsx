import { useState } from "react";
import { useStore } from "@/lib/store";
import { Link, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, CheckCircle2, Circle, ChevronRight, Flag, Terminal, Image as ImageIcon, Play, HelpCircle, Box } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function ModuleViewer() {
  const [match, params] = useRoute("/modules/:id");
  const { modules, solveQuestion } = useStore(); 
  const { toast } = useToast();
  
  const module = modules.find(m => m.id === params?.id);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [flags, setFlags] = useState<Record<string, string>>({});

  if (!module) return <div className="p-8 text-center text-red-500 font-mono">MODULE_NOT_FOUND</div>;
  if (!module.unlocked) return <div className="p-8 text-center text-red-500 font-mono">ACCESS_DENIED_LOCKED</div>;

  const activePage = module.pages[activePageIndex];

  const handleFlagSubmit = (questionId: string, correctAnswer: string) => {
    const userFlag = flags[questionId];
    if (userFlag === correctAnswer) {
      const reward = solveQuestion(module.id, activePage.id, questionId);
      toast({
        title: "Correct Flag!",
        description: reward > 0 ? `System verified. +${reward} Cubes awarded.` : "System verified. Proceeding...",
        className: "border-green-500 bg-green-950/20 text-green-500",
      });
    } else {
      toast({
        title: "Incorrect Flag",
        description: "Verification failed. Try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-8">
      {/* Sidebar Navigation */}
      <div className="w-80 border-r border-border bg-card/20 flex flex-col">
        <div className="p-4 border-b border-border">
          <Link href="/modules">
            <Button variant="ghost" size="sm" className="mb-4 text-muted-foreground hover:text-primary pl-0">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Modules
            </Button>
          </Link>
          <h2 className="font-bold font-mono text-primary leading-tight line-clamp-2">{module.title}</h2>
          <div className="mt-4 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>PROGRESS</span>
              <span>{Math.round(((activePageIndex) / module.pages.length) * 100)}%</span>
            </div>
            <Progress value={(activePageIndex / module.pages.length) * 100} className="h-1 bg-muted" />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {module.pages.map((page, idx) => (
              <button
                key={page.id}
                onClick={() => setActivePageIndex(idx)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded text-sm text-left transition-colors font-mono",
                  activePageIndex === idx 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {idx < activePageIndex ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                ) : activePageIndex === idx ? (
                  <Play className="w-3 h-3 text-primary shrink-0 fill-current" />
                ) : (
                  <Circle className="w-3 h-3 opacity-20 shrink-0" />
                )}
                <span className="truncate">{page.title}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full bg-background/50 backdrop-blur-sm relative overflow-hidden">
        {/* CRT Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-50 bg-[length:100%_2px,3px_100%] opacity-20"></div>

        <ScrollArea className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="prose prose-invert prose-green max-w-none">
              <h1 className="font-mono border-b border-primary/20 pb-4 mb-6 text-3xl">{activePage.title}</h1>
              
              {/* Image Support */}
              {activePage.image && (
                <div className="my-6 border border-border rounded-lg overflow-hidden bg-black/20 shadow-lg">
                   <img src={activePage.image} alt="Module Content" className="w-full max-h-[400px] object-cover" />
                </div>
              )}

              {/* Dynamic Content Rendering */}
              {activePage.type === 'text' && (
                <div dangerouslySetInnerHTML={{ __html: activePage.content }} />
              )}
              
              {activePage.type === 'code' && (
                <div className="bg-black/50 border border-muted rounded-lg p-4 font-mono text-sm overflow-x-auto relative group">
                  <div className="absolute top-2 right-2 text-xs text-muted-foreground opacity-50 group-hover:opacity-100">BASH</div>
                  <pre>{activePage.content.replace(/<[^>]*>?/gm, '')}</pre>
                </div>
              )}
            </div>

            {/* Questions Section */}
            {(activePage.questions && activePage.questions.length > 0) && (
              <div className="mt-12 space-y-6 border-t border-border pt-8">
                <h3 className="text-xl font-bold font-mono flex items-center gap-2 text-primary">
                  <HelpCircle className="w-5 h-5" />
                  CHALLENGE QUESTIONS
                </h3>
                
                {activePage.questions.map((q) => (
                  <Card key={q.id} className={cn(
                    "bg-card/40 border-primary/10 overflow-hidden transition-all",
                    q.solved && "border-green-500/30 bg-green-500/5"
                  )}>
                    <CardContent className="p-6">
                      <div className="flex justify-between mb-4">
                        <p className="font-medium text-foreground/90">{q.text}</p>
                        {q.cubeReward && q.cubeReward > 0 && !q.solved && (
                            <span className="text-xs font-mono bg-secondary/20 text-secondary px-2 py-1 rounded border border-secondary/30 flex items-center gap-1 h-fit">
                                <Box className="w-3 h-3" /> +{q.cubeReward}
                            </span>
                        )}
                        {q.solved && (
                            <span className="text-xs font-mono bg-green-500/20 text-green-500 px-2 py-1 rounded border border-green-500/30 flex items-center gap-1 h-fit">
                                <CheckCircle2 className="w-3 h-3" /> SOLVED
                            </span>
                        )}
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="relative flex-1">
                          <Flag className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input 
                            placeholder={q.solved ? "FLAG CAPTURED" : "CTF{...}"}
                            className="pl-10 font-mono bg-background/50 border-primary/20 focus-visible:ring-primary disabled:opacity-80 disabled:cursor-not-allowed"
                            value={q.solved ? q.answer : (flags[q.id] || "")}
                            onChange={(e) => setFlags({...flags, [q.id]: e.target.value})}
                            disabled={q.solved}
                          />
                        </div>
                        <Button 
                          onClick={() => handleFlagSubmit(q.id, q.answer)}
                          className={cn(
                            "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20",
                            q.solved && "bg-green-500/10 text-green-500 border-green-500/30 hover:bg-green-500/20"
                          )}
                          disabled={q.solved}
                        >
                          {q.solved ? "COMPLETED" : "SUBMIT"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {/* Navigation Footer */}
            <div className="flex justify-between pt-12">
               <Button 
                 variant="outline" 
                 disabled={activePageIndex === 0}
                 onClick={() => setActivePageIndex(prev => prev - 1)}
               >
                 PREVIOUS
               </Button>
               
               <Button 
                 className="bg-primary text-primary-foreground hover:bg-primary/90"
                 disabled={activePageIndex === module.pages.length - 1}
                 onClick={() => setActivePageIndex(prev => prev + 1)}
               >
                 NEXT PAGE <ChevronRight className="w-4 h-4 ml-2" />
               </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
