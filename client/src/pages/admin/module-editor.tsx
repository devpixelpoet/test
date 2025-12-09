import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useStore, Module, Page } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Trash, Save, ArrowLeft, FileText, Code, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminModuleEditor() {
  const [, params] = useRoute("/admin/modules/:id");
  const [, setLocation] = useLocation();
  const { modules, updateModule } = useStore();
  const { toast } = useToast();

  const [module, setModule] = useState<Module | null>(null);

  useEffect(() => {
    if (params?.id) {
      const found = modules.find(m => m.id === params.id);
      if (found) {
        setModule(JSON.parse(JSON.stringify(found))); // Deep copy
      }
    }
  }, [params?.id, modules]);

  if (!module) return <div>Loading...</div>;

  const handleSave = () => {
    updateModule(module);
    toast({ title: "Saved", description: "Module updated successfully." });
  };

  const addPage = () => {
    const newPage: Page = {
      id: `p${Date.now()}`,
      title: "New Page",
      content: "<p>Enter content here...</p>",
      type: "text",
      questions: [
        { id: `q${Date.now()}_1`, text: "Question 1", answer: "" },
        { id: `q${Date.now()}_2`, text: "Question 2", answer: "" }
      ]
    };
    setModule({ ...module, pages: [...module.pages, newPage] });
  };

  const updatePage = (index: number, updatedPage: Page) => {
    const newPages = [...module.pages];
    newPages[index] = updatedPage;
    setModule({ ...module, pages: newPages });
  };

  const removePage = (index: number) => {
    const newPages = module.pages.filter((_, i) => i !== index);
    setModule({ ...module, pages: newPages });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => setLocation("/admin/modules")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold font-mono text-red-500">EDITING: {module.title}</h2>
        </div>
        <div className="ml-auto flex gap-2">
          <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
            <Save className="w-4 h-4 mr-2" /> SAVE CHANGES
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module Settings */}
        <Card className="bg-card/50 border-red-500/20 h-fit">
          <CardHeader>
            <CardTitle className="text-red-400 font-mono text-sm">MODULE SETTINGS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                value={module.title} 
                onChange={(e) => setModule({...module, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={module.description} 
                onChange={(e) => setModule({...module, description: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Cube Cost</Label>
              <Input 
                type="number"
                value={module.cubeCost} 
                onChange={(e) => setModule({...module, cubeCost: parseInt(e.target.value)})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pages Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-mono font-bold text-red-400">PAGES ({module.pages.length})</h3>
            <Button size="sm" variant="outline" onClick={addPage} className="border-red-500/30 hover:bg-red-500/10 text-red-500">
              <Plus className="w-4 h-4 mr-2" /> ADD PAGE
            </Button>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-2">
            {module.pages.map((page, index) => (
              <AccordionItem key={page.id} value={page.id} className="border border-red-500/20 rounded-lg bg-card/30 px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-muted-foreground">#{index + 1}</span>
                    <span>{page.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4 border-t border-red-500/10 mt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Page Title</Label>
                      <Input 
                        value={page.title} 
                        onChange={(e) => updatePage(index, { ...page, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Content Type</Label>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={page.type}
                        onChange={(e) => updatePage(index, { ...page, type: e.target.value as any })}
                      >
                        <option value="text">Text / HTML</option>
                        <option value="code">Code Block</option>
                        <option value="video">Video Embed</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Content</Label>
                    <Textarea 
                      className="font-mono h-32"
                      value={page.content} 
                      onChange={(e) => updatePage(index, { ...page, content: e.target.value })}
                    />
                  </div>

                  {/* Questions Section */}
                  <div className="space-y-4 bg-black/20 p-4 rounded border border-red-500/10">
                    <div className="flex justify-between items-center">
                      <Label className="text-red-400">Questions & Flags</Label>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-6 text-xs"
                        onClick={() => {
                          const newQuestions = [...(page.questions || []), { id: `q${Date.now()}`, text: "", answer: "" }];
                          updatePage(index, { ...page, questions: newQuestions });
                        }}
                      >
                        <Plus className="w-3 h-3 mr-1" /> Add Question
                      </Button>
                    </div>
                    
                    {page.questions?.map((q, qIndex) => (
                      <div key={q.id} className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2 bg-background/50 rounded">
                        <Input 
                          placeholder="Question Text" 
                          value={q.text}
                          onChange={(e) => {
                            const newQs = [...(page.questions || [])];
                            newQs[qIndex].text = e.target.value;
                            updatePage(index, { ...page, questions: newQs });
                          }}
                        />
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Answer / Flag" 
                            className="font-mono text-green-500"
                            value={q.answer}
                            onChange={(e) => {
                              const newQs = [...(page.questions || [])];
                              newQs[qIndex].answer = e.target.value;
                              updatePage(index, { ...page, questions: newQs });
                            }}
                          />
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="text-muted-foreground hover:text-red-500"
                            onClick={() => {
                              const newQs = page.questions?.filter((_, i) => i !== qIndex);
                              updatePage(index, { ...page, questions: newQs });
                            }}
                          >
                            <Trash className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {(!page.questions || page.questions.length === 0) && (
                      <p className="text-xs text-muted-foreground italic">No questions added.</p>
                    )}
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => removePage(index)}
                    >
                      <Trash className="w-4 h-4 mr-2" /> DELETE PAGE
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
