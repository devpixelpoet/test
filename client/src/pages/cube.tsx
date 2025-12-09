import { useState } from "react";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Box, Gift, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CubePage() {
  const { user, redeemCode } = useStore();
  const [code, setCode] = useState("");
  const { toast } = useToast();
  const [isRedeeming, setIsRedeeming] = useState(false);

  const handleRedeem = () => {
    setIsRedeeming(true);
    // Simulate network delay
    setTimeout(() => {
      const success = redeemCode(code);
      if (success) {
        toast({
          title: "Code Redeemed!",
          description: "Cubes have been added to your inventory.",
        });
        setCode("");
      } else {
        toast({
          title: "Invalid Code",
          description: "This code is invalid, expired, or already used.",
          variant: "destructive",
        });
      }
      setIsRedeeming(false);
    }, 800);
  };

  const cubePacks = [100, 200, 300, 400, 500];

  return (
    <div className="space-y-8">
       <div className="border-b border-border pb-6 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold font-mono tracking-tight text-secondary">CUBE EXCHANGE</h2>
          <p className="text-muted-foreground mt-2">Acquire resources to unlock advanced modules.</p>
        </div>
        <div className="flex items-center gap-3 bg-secondary/10 px-6 py-3 rounded-lg border border-secondary/20">
            <Box className="w-8 h-8 text-secondary" />
            <div>
                <p className="text-xs text-secondary font-bold">CURRENT BALANCE</p>
                <p className="text-2xl font-bold font-mono">{user?.cubes}</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cubePacks.map((amount) => (
          <Dialog key={amount}>
            <DialogTrigger asChild>
              <Card className="bg-card/40 border-primary/10 hover:border-secondary/50 hover:bg-secondary/5 transition-all cursor-pointer group">
                <CardContent className="p-6 flex flex-col items-center justify-center aspect-square text-center">
                  <Box className="w-12 h-12 text-muted-foreground mb-4 group-hover:text-secondary group-hover:scale-110 transition-all" />
                  <h3 className="text-2xl font-bold group-hover:text-secondary">{amount}</h3>
                  <p className="text-xs text-muted-foreground mt-1">CUBES</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="border-secondary/20 bg-background/95 backdrop-blur">
              <DialogHeader>
                <DialogTitle className="text-secondary flex items-center gap-2">
                    <Gift className="w-5 h-5" /> Redeem Code
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground">Enter your gift code to receive {amount} Cubes.</p>
                <div className="flex gap-2">
                    <Input 
                        placeholder="ENTER-CODE-HERE" 
                        className="font-mono uppercase"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                    />
                    <Button onClick={handleRedeem} disabled={!code || isRedeeming} className="bg-secondary hover:bg-secondary/80 text-white">
                        {isRedeeming ? "..." : "REDEEM"}
                    </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>

      <div className="bg-muted/30 p-8 rounded-lg border border-dashed border-border mt-8">
        <h3 className="text-lg font-bold mb-4">How to get codes?</h3>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
            <li>Complete CTF challenges in community events.</li>
            <li>Participate in HackTheBox monthly tournaments.</li>
            <li>Admin distributed rewards for bug bounties.</li>
            <li>Try <code className="bg-background px-2 py-1 rounded border border-border">WELCOME100</code> for a starter pack.</li>
        </ul>
      </div>
    </div>
  );
}
