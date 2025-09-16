import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "@/pages/HomePage";
import AdminPage from "@/pages/AdminPage";
import NotFound from "@/pages/not-found";

function Navigation() {
  const [location] = useLocation();
  
  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold text-foreground">מערכת ניהול אירועים</h1>
          </div>
          <div className="flex items-center space-x-4 space-x-reverse">
            <Link href="/" className={`text-sm font-medium px-3 py-2 rounded-md ${
              location === '/' ? 'text-foreground bg-muted' : 'text-muted-foreground hover:text-foreground'
            }`}>
              בית
            </Link>
            <Link href="/admin" className={`text-sm font-medium px-3 py-2 rounded-md ${
              location === '/admin' ? 'text-foreground bg-muted' : 'text-muted-foreground hover:text-foreground'
            }`}>
              לוח מנהל
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <>
      <Navigation />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/admin" component={AdminPage} />
        <Route component={NotFound} />
      </Switch>
    </>
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
