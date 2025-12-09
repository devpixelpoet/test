import { useState } from "react";
import { useStore, Module } from "@/lib/store";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash, Terminal, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminModules() {
  const { modules, addModule, deleteModule } = useStore();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // New Module Form State
  const [newModule, setNewModule] = useState<Partial<Module>>({
    title: "",
    description: "",
    type: "free",
    cubeCost: 0,
    isSpecial: false,
  });

  const handleAddModule = () => {
    if (!newModule.title || !newModule.description) {
      toast({ title: "Error", description: "Title and description are required", variant: "destructive" });
      return;
    }

    const module: Module = {
      id: `m${Date.now()}`,
      title: newModule.title,
      description: newModule.description,
      type: newModule.type as "free" | "cube",
      cubeCost: newModule.type === "free" ? 0 : (newModule.cubeCost || 0),
      isSpecial: newModule.isSpecial || false,
      progress: 0,
      pages: [],
      unlocked: newModule.type === "free",
    };

    addModule(module);
    toast({ title: "Success", description: "Module created successfully" });
    setIsDialogOpen(false);
    setNewModule({ title: "", description: "", type: "free", cubeCost: 0, isSpecial: false });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this module?")) {
      deleteModule(id);
      toast({ title: "Deleted", description: "Module removed" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold font-mono text-red-500">MODULE MANAGEMENT</h2>
          <p className="text-muted-foreground">Create and configure training modules.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="w-4 h-4 mr-2" /> CREATE MODULE
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background border-red-500/20">
            <DialogHeader>
              <DialogTitle className="text-red-500 font-mono">NEW MODULE CONFIGURATION</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  value={newModule.title} 
                  onChange={(e) => setNewModule({...newModule, title: e.target.value})}
                  placeholder="e.g. Buffer Overflow 101"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input 
                  value={newModule.description} 
                  onChange={(e) => setNewModule({...newModule, description: e.target.value})}
                  placeholder="Brief summary of the module"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select 
                    value={newModule.type} 
                    onValueChange={(v) => setNewModule({...newModule, type: v as "free" | "cube"})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="cube">Cube Locked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newModule.type === "cube" && (
                  <div className="space-y-2">
                    <Label>Cube Cost</Label>
                    <Input 
                      type="number" 
                      value={newModule.cubeCost} 
                      onChange={(e) => setNewModule({...newModule, cubeCost: parseInt(e.target.value)})}
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="special" 
                  checked={newModule.isSpecial} 
                  onCheckedChange={(c) => setNewModule({...newModule, isSpecial: c as boolean})}
                />
                <Label htmlFor="special" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Mark as Special Operation
                </Label>
              </div>
              <Button onClick={handleAddModule} className="w-full bg-red-600 hover:bg-red-700">
                INITIALIZE MODULE
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card/50 border-red-500/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-red-500/10 hover:bg-red-500/5">
                <TableHead className="text-red-400">TITLE</TableHead>
                <TableHead className="text-red-400">TYPE</TableHead>
                <TableHead className="text-red-400">COST</TableHead>
                <TableHead className="text-red-400">PAGES</TableHead>
                <TableHead className="text-right text-red-400">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map((module) => (
                <TableRow key={module.id} className="border-red-500/10 hover:bg-red-500/5">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {module.isSpecial ? <ShieldAlert className="w-4 h-4 text-purple-500" /> : <Terminal className="w-4 h-4 text-muted-foreground" />}
                      {module.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs border ${module.type === 'free' ? 'border-green-500/30 text-green-500 bg-green-500/10' : 'border-blue-500/30 text-blue-500 bg-blue-500/10'}`}>
                      {module.type.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{module.cubeCost}</TableCell>
                  <TableCell>{module.pages.length}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/admin/modules/${module.id}`}>
                      <Button size="icon" variant="ghost" className="hover:bg-red-500/10 hover:text-red-500">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="hover:bg-red-500/10 hover:text-red-500"
                      onClick={() => handleDelete(module.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
