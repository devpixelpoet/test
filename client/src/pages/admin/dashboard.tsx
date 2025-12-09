import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Terminal, Gift, Activity } from "lucide-react";

export default function AdminDashboard() {
  const { modules, giftCodes, user } = useStore();

  const totalModules = modules.length;
  const totalSpecial = modules.filter(m => m.isSpecial).length;
  const activeCodes = giftCodes.filter(c => c.active).length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-mono text-red-500 mb-2">SYSTEM OVERVIEW</h2>
        <p className="text-muted-foreground">Monitoring active nodes and resources.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card/50 border-red-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground font-mono">TOTAL MODULES</CardTitle>
            <Terminal className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalModules}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-red-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground font-mono">SPECIAL OPS</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSpecial}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-red-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground font-mono">ACTIVE CODES</CardTitle>
            <Gift className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCodes}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-red-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground font-mono">REGISTERED USERS</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
