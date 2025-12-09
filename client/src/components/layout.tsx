import { Link, useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { Terminal, Box, Shield, Gift, User, LogOut, LayoutDashboard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useStore();

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Modules", href: "/modules", icon: Terminal },
    { label: "Specials", href: "/specials", icon: Shield },
    { label: "Cube", href: "/cube", icon: Box },
    { label: "Profile", href: "/profile", icon: User },
  ];

  if (user?.role === "admin" && location.startsWith("/admin")) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-primary font-mono tracking-tighter flex items-center gap-2">
            <Terminal className="w-6 h-6" />
            HACK<span className="text-foreground">PLATFORM</span>
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md transition-all cursor-pointer font-medium",
                  location === item.href
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(0,255,128,0.1)]"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </div>
            </Link>
          ))}
          
          {user?.role === "admin" && (
             <Link href="/admin">
             <div
               className={cn(
                 "flex items-center gap-3 px-4 py-3 rounded-md transition-all cursor-pointer font-medium mt-8 border border-dashed border-red-500/30",
                 location.startsWith("/admin")
                   ? "bg-red-500/10 text-red-500"
                   : "text-red-500/70 hover:bg-red-500/10 hover:text-red-500"
               )}
             >
               <Settings className="w-5 h-5" />
               Admin Panel
             </div>
           </Link>
          )}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3 rounded-md bg-muted/50 mb-2">
            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary font-bold">
              {user?.username.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.username}</p>
              <p className="text-xs text-primary flex items-center gap-1">
                <Box className="w-3 h-3" /> {user?.cubes} Cubes
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 animate-in fade-in duration-500">
        {children}
      </main>
    </div>
  );
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { logout } = useStore();
  const [, setLocation] = useLocation();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Modules", href: "/admin/modules", icon: Terminal },
    { label: "Specials", href: "/admin/specials", icon: Shield },
    { label: "Cubes & Codes", href: "/admin/cubes", icon: Gift },
    { label: "Users", href: "/admin/users", icon: User },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans">
      <aside className="w-64 border-r border-red-900/30 bg-sidebar flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-red-900/30">
          <h1 className="text-xl font-bold text-red-500 font-mono tracking-tighter flex items-center gap-2">
            <Settings className="w-5 h-5" />
            ADMIN<span className="text-foreground">PANEL</span>
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md transition-all cursor-pointer font-medium",
                  location === item.href
                    ? "bg-red-500/10 text-red-500 border border-red-500/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </div>
            </Link>
          ))}
          
           <Link href="/">
             <div
               className="flex items-center gap-3 px-4 py-3 rounded-md transition-all cursor-pointer font-medium mt-8 text-primary/70 hover:text-primary"
             >
               <Terminal className="w-5 h-5" />
               Back to Platform
             </div>
           </Link>
        </nav>
        
        <div className="p-4 border-t border-red-900/30">
             <button 
            onClick={() => {
                logout();
                setLocation("/login");
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8 animate-in fade-in duration-500">
        <div className="mb-8 p-4 border border-red-500/20 bg-red-950/10 rounded-lg text-red-200 text-sm font-mono flex items-center gap-2">
            <Shield className="w-4 h-4" />
            ADMINISTRATOR MODE ACTIVE - CHANGES ARE LIVE
        </div>
        {children}
      </main>
    </div>
  );
}
