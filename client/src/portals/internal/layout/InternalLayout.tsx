import { useState, useEffect, type ReactNode } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, FolderKanban, FileText, MessageSquare,
  Users, TrendingUp, Mail, Send, FileSignature, DollarSign,
  PenSquare, Globe, Palette, Search, Workflow, BarChart3,
  UserCog, UserPlus, Settings, Shield, Bell, ChevronLeft,
  ChevronRight as ChevronRightIcon, Menu, X, LogOut, User,
  ClipboardList, Calendar, Monitor, Bot, FileDown, Layers,
  InboxIcon, HelpCircle, Building2, ListChecks
} from "lucide-react";

const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    ],
  },
  {
    title: "Projects",
    items: [
      { label: "Project Manager", icon: FolderKanban, path: "/projects" },
      { label: "Project Requests", icon: ClipboardList, path: "/project-requests" },
      { label: "RFIs", icon: HelpCircle, path: "/rfis" },
      { label: "Doc Approval", icon: ListChecks, path: "/doc-approval" },
    ],
  },
  {
    title: "CRM & Sales",
    items: [
      { label: "Contact Manager", icon: Users, path: "/contacts" },
      { label: "Sales Dashboard", icon: TrendingUp, path: "/sales" },
      { label: "Outreach Queue", icon: Send, path: "/outreach" },
      { label: "Email Sequences", icon: Mail, path: "/email-sequences" },
      { label: "Proposal Dashboard", icon: FileSignature, path: "/proposals" },
      { label: "Invoice Management", icon: DollarSign, path: "/invoices" },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Blog Editor", icon: PenSquare, path: "/blog" },
      { label: "Content Manager", icon: Layers, path: "/content" },
      { label: "Page Builder", icon: Palette, path: "/page-builder" },
      { label: "SEO Assistant", icon: Search, path: "/seo" },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Workflow Builder", icon: Workflow, path: "/workflows" },
      { label: "Analytics", icon: BarChart3, path: "/analytics" },
      { label: "User Management", icon: UserCog, path: "/users" },
      { label: "Client Invites", icon: UserPlus, path: "/client-invites" },
      { label: "Admin Console", icon: Shield, path: "/admin" },
      { label: "Form Submissions", icon: InboxIcon, path: "/form-submissions" },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Email Settings", icon: Settings, path: "/email-settings" },
      { label: "ICP Settings", icon: Building2, path: "/icp-settings" },
      { label: "Calendar", icon: Calendar, path: "/calendar-settings" },
      { label: "Monitoring", icon: Monitor, path: "/monitoring" },
    ],
  },
];

interface InternalLayoutProps {
  children: ReactNode;
}

export default function InternalLayout({ children }: InternalLayoutProps) {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("pe_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutMutation } = useAuth();

  const { data: unreadNotifications } = useQuery<any[]>({
    queryKey: ["/api/notifications/unread/" + (user?.email || "")],
    enabled: !!user?.email,
  });

  const unreadCount = unreadNotifications?.length || 0;

  useEffect(() => {
    try {
      localStorage.setItem("pe_sidebar_collapsed", String(collapsed));
    } catch {}
  }, [collapsed]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const getBasePath = () => {
    if (location.pathname.startsWith("/internal")) return "/internal";
    return "";
  };

  const basePath = getBasePath();

  const isActive = (path: string) => {
    const fullPath = basePath + path;
    if (path === "/dashboard") {
      return location.pathname === fullPath || location.pathname === basePath || location.pathname === basePath + "/";
    }
    return location.pathname.startsWith(fullPath);
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate(basePath + "/auth"),
    });
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className={cn(
        "flex items-center h-16 px-4 border-b border-gray-700/50 flex-shrink-0",
        collapsed ? "justify-center" : "gap-3"
      )}>
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <Building2 className="h-5 w-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-white truncate">Pacific Engineering</h1>
            <p className="text-[10px] text-gray-400 truncate">Internal Portal</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="px-3 mb-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={basePath + item.path}
                    className={cn(
                      "flex items-center gap-3 rounded-lg transition-colors duration-150",
                      collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2",
                      active
                        ? "bg-primary/20 text-white"
                        : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
                    )}
                    title={collapsed ? item.label : undefined}
                    data-testid={`nav-${item.path.slice(1)}`}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {!collapsed && (
                      <span className="text-sm truncate">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="flex-shrink-0 border-t border-gray-700/50 p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center w-full py-2 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white transition-colors"
          data-testid="button-toggle-sidebar"
        >
          {collapsed ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed && <span className="ml-2 text-sm">Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 transition-all duration-200 flex-shrink-0",
          collapsed ? "w-[72px]" : "w-[280px]"
        )}
        data-testid="sidebar"
      >
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-[280px] bg-gradient-to-b from-gray-900 to-gray-800 z-50">
            <div className="flex items-center justify-end p-2">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-gray-400 hover:text-white"
                data-testid="button-close-mobile-nav"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-4 lg:px-6 flex-shrink-0 bg-background">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-accent"
              data-testid="button-mobile-menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-medium">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {unreadCount === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No new notifications
                  </div>
                ) : (
                  unreadNotifications?.slice(0, 5).map((n: any) => (
                    <DropdownMenuItem key={n.id} className="flex flex-col items-start py-2">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.message}</p>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2" data-testid="button-user-menu">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-foreground">
                      {getInitials(user?.full_name)}
                    </span>
                  </div>
                  <span className="hidden md:inline text-sm font-medium max-w-[120px] truncate">
                    {user?.full_name || "User"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{user?.full_name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <Badge variant="secondary" className="mt-1 text-xs">{user?.role}</Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(basePath + "/profile")} data-testid="menu-profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(basePath + "/email-settings")} data-testid="menu-settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} data-testid="menu-logout">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
