import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User, Shield, Ban } from "lucide-react";

export default function AdminUsers() {
  const { user } = useStore();

  // Mock list of users for display since store only has current user
  const users = [
    user,
    { id: "u2", username: "Guest_User", role: "user", cubes: 0 },
    { id: "u3", username: "Hacker_One", role: "user", cubes: 1200 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold font-mono text-red-500">USER MANAGEMENT</h2>
          <p className="text-muted-foreground">Manage system access and roles.</p>
        </div>
      </div>

      <Card className="bg-card/50 border-red-500/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-red-500/10 hover:bg-red-500/5">
                <TableHead className="text-red-400">USERNAME</TableHead>
                <TableHead className="text-red-400">ROLE</TableHead>
                <TableHead className="text-red-400">CUBES</TableHead>
                <TableHead className="text-right text-red-400">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => u && (
                <TableRow key={u.id} className="border-red-500/10 hover:bg-red-500/5">
                  <TableCell className="font-mono font-medium flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    {u.username}
                    {u.id === user?.id && <span className="text-xs text-muted-foreground">(You)</span>}
                  </TableCell>
                  <TableCell>
                    {u.role === 'admin' ? (
                      <span className="flex items-center gap-1 text-red-500 font-bold text-xs">
                        <Shield className="w-3 h-3" /> ADMIN
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">USER</span>
                    )}
                  </TableCell>
                  <TableCell>{u.cubes}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="hover:bg-red-500/10 hover:text-red-500 text-xs"
                      disabled={u.id === user?.id}
                    >
                      <Ban className="w-3 h-3 mr-1" /> BAN
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
