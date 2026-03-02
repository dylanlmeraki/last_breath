import { type ReactNode, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { cn, getInitials } from "@/lib/utils";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard, FolderKanban, FileText, FileSignature,
  DollarSign, MessageSquare, Bell, Menu, X, LogOut, User,
  Building2, Settings
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Projects", icon: FolderKanban, path: "/projects" },
  { label: "Documents", icon: FileText, path: "/documents" },
  { label: "Proposals", icon: FileSignature, path: "/proposals" },
  { label: "Invoices", icon: DollarSign, path: "/invoices" },
  { label: "Messages", icon: MessageSquare, path: "/messages" },
];

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutMutation } = useAuth();

  const { data: unreadNotifications } = useQuery<any[]>({
    queryKey: ["/api/notifications/unread/" + (user?.email || "")],
    enabled: !!user?.email,
  });

  const unreadCount = unreadNotifications?.length || 0;
  const basePath = location.pathname.startsWith("/portal") ? "/portal" : "";

  const isActive = (path: string) => {
    const full = basePath + path;
    if (path === "/dashboard") return location.pathname === full || location.pathname === basePath || location.pathname === basePath + "/";
    return location.pathname.startsWith(full);
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate(basePath + "/auth"),
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-white dark:bg-background sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link to={basePath + "/dashboard"} className="flex items-center gap-2" data-testid="link-home">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg hidden sm:inline">Pacific Engineering</span>
              </Link>

              <nav className="hidden lg:flex items-center gap-1">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.path}
                    to={basePath + item.path}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                      isActive(item.path)
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                    data-testid={`nav-${item.path.slice(1)}`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-medium">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2" data-testid="button-user-menu">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-foreground">{getInitials(user?.full_name)}</span>
                    </div>
                    <span className="hidden md:inline text-sm font-medium">{user?.full_name || "User"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="font-medium">{user?.full_name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(basePath + "/profile")} data-testid="menu-profile">
                    <User className="h-4 w-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} data-testid="menu-logout">
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2" data-testid="button-mobile-menu">
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t pb-3">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-1 pt-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={basePath + item.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                    isActive(item.path)
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-accent"
                  )}
                  data-testid={`mobile-nav-${item.path.slice(1)}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          Pacific Engineering Construction &middot; San Francisco, CA
        </div>
      </footer>
    </div>
  );
}
