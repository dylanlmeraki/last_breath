import { useState, useEffect } from "react";
import { listEntities, filterEntities } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/lib/utils";
import {
  Users,
  Target,
  FileText,
  Search,
  Sparkles,
  TrendingUp,
  Calendar,
  Building2,
  Activity,
  ArrowRight,
  Loader2,
  BarChart3,
  Mail,
  Clock
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: prospects = [], isLoading: prospectsLoading } = useQuery({
    queryKey: ['dashboard-prospects'],
    queryFn: () => listEntities('Prospect', '-created_date', 10),
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['dashboard-projects'],
    queryFn: () => listEntities('Project', '-created_date', 10),
  });

  const { data: blogPosts = [], isLoading: blogLoading } = useQuery({
    queryKey: ['dashboard-blog'],
    queryFn: () => listEntities('BlogPost', '-created_date', 10),
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['dashboard-tasks'],
    queryFn: () => filterEntities('Task', { status: "Pending" }, '-due_date', 10),
  });

  const { data: auditLogs = [], isLoading: auditLoading } = useQuery({
    queryKey: ['dashboard-audit'],
    queryFn: () => listEntities('AuditLog', '-created_date', 10),
  });

  const quickActions = [
    {
      name: "Analytics",
      description: "View portfolio KPIs, charts & insights",
      icon: BarChart3,
      path: createPageUrl("AnalyticsDashboard"),
      color: "from-indigo-600 to-purple-600"
    },
    {
      name: "Manage Users",
      description: "Add, edit, or remove user accounts",
      icon: Users,
      path: createPageUrl("UserManagement"),
      color: "from-blue-600 to-cyan-600"
    },
    {
      name: "CRM Dashboard",
      description: "View and manage prospects & pipeline",
      icon: Target,
      path: createPageUrl("SalesDashboard"),
      color: "from-purple-600 to-indigo-600"
    },
    {
      name: "Workflows",
      description: "Automate project & CRM processes",
      icon: Activity,
      path: createPageUrl("WorkflowBuilder"),
      color: "from-pink-600 to-rose-600"
    },
    {
      name: "Create Blog Post",
      description: "Write and publish new content",
      icon: FileText,
      path: createPageUrl("BlogEditor"),
      color: "from-green-600 to-emerald-600"
    },
    {
      name: "Email Sequences",
      description: "Build multi-step outreach cadences",
      icon: BarChart3,
      path: createPageUrl("EmailSequences"),
      color: "from-emerald-600 to-teal-600"
    },
  ];

  const stats = [
    {
      label: "Total Prospects",
      value: prospects.length,
      icon: Target,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      label: "Active Projects",
      value: projects.filter((p: any) => p.status === "In Progress").length,
      icon: Building2,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/30"
    },
    {
      label: "Published Posts",
      value: blogPosts.filter((p: any) => p.published).length,
      icon: FileText,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/30"
    },
    {
      label: "Pending Tasks",
      value: tasks.length,
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/30"
    }
  ];

  const basePath = window.location.pathname.startsWith("/internal") ? "/internal" : "";

  return (
    <div className="py-6 lg:py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" data-testid="text-welcome">
          Welcome back{user ? `, ${user.full_name?.split(' ')[0]}` : ''}
        </h1>
        <p className="text-muted-foreground text-lg">
          Your internal command center for Pacific Engineering operations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="flex items-center justify-between gap-1 mb-3">
                <div className={`${stat.bg} rounded-lg p-3`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          );
        })}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.name} to={basePath + action.path} data-testid={`link-${action.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <Card className="p-6 hover-elevate transition-all group cursor-pointer relative">
                  <div className="relative">
                    <div className={`bg-gradient-to-r ${action.color} rounded-lg w-12 h-12 flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold mb-2">
                      {action.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                    <div className="flex items-center text-sm font-medium text-primary">
                      Open <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between gap-1 mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Recent Activity
            </h3>
            <Link to={basePath + createPageUrl("UserManagement")}>
              <Button variant="ghost" size="sm" data-testid="link-view-all-activity">
                View All
              </Button>
            </Link>
          </div>

          {auditLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No recent activity
            </div>
          ) : (
            <div className="space-y-3">
              {auditLogs.slice(0, 5).map((log: any) => (
                <div key={log.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg" data-testid={`activity-${log.id}`}>
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {log.actor_name} {log.action?.replace(/_/g, ' ')}
                    </p>
                    {log.resource_name && (
                      <p className="text-xs text-muted-foreground">{log.resource_name}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(log.created_date, "short")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between gap-1 mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              Pending Tasks
            </h3>
            <Link to={basePath + createPageUrl("SalesDashboard")}>
              <Button variant="ghost" size="sm" data-testid="link-view-all-tasks">
                View All
              </Button>
            </Link>
          </div>

          {tasksLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending tasks
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task: any) => (
                <div key={task.id} className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg" data-testid={`task-${task.id}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{task.title}</p>
                      {task.prospect_name && (
                        <p className="text-xs text-muted-foreground">{task.prospect_name}</p>
                      )}
                    </div>
                    {task.due_date && (
                      <span className="text-xs text-orange-600 font-medium">
                        {formatDate(task.due_date, "short")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <Card className="p-6">
          <div className="flex items-center justify-between gap-1 mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Recent Prospects
            </h3>
            <Link to={basePath + createPageUrl("SalesDashboard")}>
              <Button variant="ghost" size="sm" data-testid="link-view-crm">
                View CRM
              </Button>
            </Link>
          </div>

          {prospectsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            </div>
          ) : prospects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No prospects yet
            </div>
          ) : (
            <div className="space-y-3">
              {prospects.slice(0, 5).map((prospect: any) => (
                <div key={prospect.id} className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800" data-testid={`prospect-${prospect.id}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{prospect.contact_name}</p>
                      <p className="text-xs text-muted-foreground">{prospect.company_name}</p>
                      <span className="text-xs px-2 py-1 bg-purple-600 text-white rounded-full mt-1 inline-block">
                        {prospect.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between gap-1 mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              Blog Posts
            </h3>
            <Link to={basePath + createPageUrl("BlogEditor")}>
              <Button variant="ghost" size="sm" data-testid="link-manage-blog">
                Manage Blog
              </Button>
            </Link>
          </div>

          {blogLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No blog posts yet
            </div>
          ) : (
            <div className="space-y-3">
              {blogPosts.slice(0, 5).map((post: any) => (
                <div key={post.id} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800" data-testid={`blog-post-${post.id}`}>
                  <p className="font-medium text-sm">{post.title}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      post.published 
                        ? "bg-green-600 text-white" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(post.created_date, "short")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}