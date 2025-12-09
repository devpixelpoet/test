import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout";
import Dashboard from "@/pages/dashboard";
import ModulesPage from "@/pages/modules";
import SpecialsPage from "@/pages/specials";
import CubePage from "@/pages/cube";
import ProfilePage from "@/pages/profile";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import { useStore } from "@/lib/store";

// Admin Pages
import AdminDashboard from "@/pages/admin/dashboard";
import AdminModules from "@/pages/admin/modules";
import AdminModuleEditor from "@/pages/admin/module-editor";
import AdminCubes from "@/pages/admin/cubes";
import AdminUsers from "@/pages/admin/users";
import ModuleViewer from "@/pages/module-viewer";

// Protected Route Wrapper
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user } = useStore();
  
  if (!user) {
    return <Redirect to="/login" />;
  }

  return (
    <Layout>
      <Component />
    </Layout>
  );
}

// Admin Route Wrapper
function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  const { user } = useStore();
  
  if (!user || user.role !== 'admin') {
    return <Redirect to="/" />;
  }

  return (
    <Layout>
      <Component />
    </Layout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      
      <Route path="/">
        <ProtectedRoute component={Dashboard} />
      </Route>
      
      <Route path="/modules">
        <ProtectedRoute component={ModulesPage} />
      </Route>
      
      <Route path="/modules/:id">
        <ProtectedRoute component={ModuleViewer} />
      </Route>
      
      <Route path="/specials">
        <ProtectedRoute component={SpecialsPage} />
      </Route>
      
      <Route path="/cube">
        <ProtectedRoute component={CubePage} />
      </Route>
      
      <Route path="/profile">
        <ProtectedRoute component={ProfilePage} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin">
        <AdminRoute component={AdminDashboard} />
      </Route>
      
      <Route path="/admin/modules">
        <AdminRoute component={AdminModules} />
      </Route>

      <Route path="/admin/modules/:id">
        <AdminRoute component={AdminModuleEditor} />
      </Route>

      <Route path="/admin/specials">
        {/* Reusing AdminModules because it handles both, just filters in UI if needed, or we can assume it lists all */}
        <AdminRoute component={AdminModules} />
      </Route>

      <Route path="/admin/cubes">
        <AdminRoute component={AdminCubes} />
      </Route>

      <Route path="/admin/users">
        <AdminRoute component={AdminUsers} />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
