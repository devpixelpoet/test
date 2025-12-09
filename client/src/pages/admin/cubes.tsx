import { useState } from "react";
import { useStore, GiftCode } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash, Gift, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminCubes() {
  const { giftCodes, addGiftCode, deleteGiftCode } = useStore();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCode, setNewCode] = useState({ code: "", value: 100 });

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 12; i++) {
      if (i > 0 && i % 4 === 0) result += "-";
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCode({ ...newCode, code: result });
  };

  const handleAddCode = () => {
    if (!newCode.code) return;
    
    addGiftCode({
      id: `gc${Date.now()}`,
      code: newCode.code,
      value: newCode.value,
      active: true
    });
    
    toast({ title: "Success", description: "Gift code generated." });
    setIsDialogOpen(false);
    setNewCode({ code: "", value: 100 });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Code copied to clipboard" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold font-mono text-red-500">CUBE & GIFT CODES</h2>
          <p className="text-muted-foreground">Manage economy and redemption codes.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="w-4 h-4 mr-2" /> GENERATE CODE
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background border-red-500/20">
            <DialogHeader>
              <DialogTitle className="text-red-500 font-mono">NEW GIFT CODE</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex gap-2">
                <Input 
                  value={newCode.code} 
                  onChange={(e) => setNewCode({...newCode, code: e.target.value.toUpperCase()})}
                  placeholder="CODE-XXXX-XXXX"
                  className="font-mono uppercase"
                />
                <Button variant="outline" onClick={generateCode}>Random</Button>
              </div>
              <div className="space-y-2">
                <Input 
                  type="number"
                  value={newCode.value} 
                  onChange={(e) => setNewCode({...newCode, value: parseInt(e.target.value)})}
                  placeholder="Value (Cubes)"
                />
              </div>
              <Button onClick={handleAddCode} className="w-full bg-red-600 hover:bg-red-700">
                CREATE CODE
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
                <TableHead className="text-red-400">CODE</TableHead>
                <TableHead className="text-red-400">VALUE</TableHead>
                <TableHead className="text-red-400">STATUS</TableHead>
                <TableHead className="text-right text-red-400">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {giftCodes.map((code) => (
                <TableRow key={code.id} className="border-red-500/10 hover:bg-red-500/5">
                  <TableCell className="font-mono font-medium flex items-center gap-2">
                    <Gift className="w-4 h-4 text-green-500" />
                    {code.code}
                  </TableCell>
                  <TableCell>
                    <span className="text-secondary font-bold">{code.value} Cubes</span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${code.active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {code.active ? 'ACTIVE' : 'REDEEMED'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="hover:bg-red-500/10 hover:text-red-500"
                      onClick={() => copyToClipboard(code.code)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="hover:bg-red-500/10 hover:text-red-500"
                      onClick={() => deleteGiftCode(code.id)}
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
