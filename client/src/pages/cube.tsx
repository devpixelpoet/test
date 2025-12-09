import { useState } from "react";
import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Box, Gift } from "lucide-react";
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
      const redeemedValue = redeemCode(code);
      if (redeemedValue > 0) {
        toast({
          title: "Code Redeemed!",
          description: `${redeemedValue} Cubes have been added to your inventory.`,
          className: "border-green-500 bg-green-950/20 text-green-500",
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

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
       <div className="border-b border-border pb-6 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold font-mono tracking-tight text-secondary">CUBE EXCHANGE</h2>
          <p className="text-muted-foreground mt-2">Redeem classified codes for resources.</p>
        </div>
        <div className="flex items-center gap-3 bg-secondary/10 px-6 py-3 rounded-lg border border-secondary/20">
            <Box className="w-8 h-8 text-secondary" />
            <div>
                <p className="text-xs text-secondary font-bold">CURRENT BALANCE</p>
                <p className="text-2xl font-bold font-mono">{user?.cubes}</p>
            </div>
        </div>
      </div>

      <Card className="bg-card/40 border-secondary/20 shadow-[0_0_30px_rgba(147,51,234,0.05)]">
        <CardContent className="p-12 text-center space-y-8">
            <div className="mx-auto w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20 mb-6">
                <Gift className="w-12 h-12 text-secondary" />
            </div>
            
            <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">Have a Gift Code?</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Enter your unique alphanumeric code below to instantly credit your account with Cubes.
                </p>
            </div>

            <div className="flex gap-2 max-w-md mx-auto">
                <Input 
                    placeholder="ENTER-CODE-HERE" 
                    className="font-mono uppercase text-lg h-12 bg-background/50 border-secondary/30 focus-visible:ring-secondary"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                />
                <Button 
                    onClick={handleRedeem} 
                    disabled={!code || isRedeeming} 
                    className="bg-secondary hover:bg-secondary/80 text-white h-12 px-8 font-bold"
                >
                    {isRedeeming ? "PROCESSING..." : "REDEEM"}
                </Button>
            </div>
            
            <p className="text-xs text-muted-foreground pt-4">
                * Codes are case-insensitive and can only be used once.
            </p>
        </CardContent>
      </Card>

      <div className="bg-muted/30 p-8 rounded-lg border border-dashed border-border mt-8">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Box className="w-4 h-4 text-primary" /> How to obtain codes?
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
                <span className="text-primary">•</span> 
                Complete weekly CTF challenges and community events.
            </li>
            <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Win HackTheBox tournaments and leaderboards.
            </li>
            <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Bug bounty rewards distributed by admins.
            </li>
            <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Try starter code: <code className="bg-background px-2 py-0.5 rounded border border-border mx-1 text-primary">WELCOME100</code>
            </li>
        </ul>
      </div>
    </div>
  );
}
