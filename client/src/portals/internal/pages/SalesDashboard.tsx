import { useState } from "react";
import { listEntities, updateEntity } from "@/lib/apiClient";
import { callFunction } from "@/lib/functionsClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Target, 
  Send, 
  Users, 
  TrendingUp, 
  Mail, 
  Calendar,
  Building2,
  Loader2,
  CheckCircle,
  Clock,
  ExternalLink,
  Zap,
  ListTodo,
  MessageSquare,
  DollarSign,
  Flame,
  BarChart3,
  RefreshCw,
  Brain,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { formatCurrency } from "@/lib/utils";

function ProspectDetailModal({ prospect, onClose }: { prospect: any; onClose: () => void }) {
  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{prospect?.contact_name || "Prospect Details"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {prospect?.company_name && (
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span>{prospect.company_name}</span>
            </div>
          )}
          {prospect?.contact_email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{prospect.contact_email}</span>
            </div>
          )}
          {prospect?.contact_title && (
            <p className="text-sm text-muted-foreground">{prospect.contact_title}</p>
          )}
          {prospect?.status && <Badge>{prospect.status}</Badge>}
          {prospect?.deal_value && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-bold">{formatCurrency(prospect.deal_value)}</span>
            </div>
          )}
          {prospect?.notes && (
            <div>
              <p className="text-sm font-medium mb-1">Notes:</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{prospect.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function SalesDashboard() {
  const [view, setView] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSegment, setFilterSegment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedProspect, setSelectedProspect] = useState<any>(null);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [optimizationInsights, setOptimizationInsights] = useState<any>(null);
  const [selectedProspectIds, setSelectedProspectIds] = useState<Set<string>>(new Set());
  const [filterOwner, setFilterOwner] = useState("all");
  const [sortField, setSortField] = useState("-updated_date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const queryClient = useQueryClient();

  const { data: prospects = [], isLoading: loadingProspects, error: prospectsError } = useQuery({
    queryKey: ['prospects'],
    queryFn: () => listEntities('Prospect', '-updated_date', 200),
  });

  const { data: interactions = [], error: interactionsError } = useQuery({
    queryKey: ['interactions'],
    queryFn: () => listEntities('Interaction', '-interaction_date', 500),
  });

  const { data: tasks = [], error: tasksError } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => listEntities('Task', '-due_date', 300),
  });

  const { data: outreach = [], error: outreachError } = useQuery({
    queryKey: ['outreach'],
    queryFn: () => listEntities('SalesOutreach', '-sent_date', 500),
  });

  const { data: allSequences = [] } = useQuery({
    queryKey: ['email-sequences'],
    queryFn: () => listEntities('EmailSequence', '-updated_date', 200),
  });

  const handleRunAutomation = async () => {
    setIsAutoRunning(true);
    try {
      const [perfRes, actionsRes] = await Promise.all([
        callFunction('analyzeSequencePerformance', {}),
        callFunction('suggestProspectActions', {})
      ]);
      setOptimizationInsights({ performance: perfRes, actions: actionsRes });
    } catch (error) {
      console.error('Sequence optimization error:', error);
    } finally {
      setIsAutoRunning(false);
    }
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['prospects'] });
    queryClient.invalidateQueries({ queryKey: ['interactions'] });
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    queryClient.invalidateQueries({ queryKey: ['outreach'] });
  };

  const ownerOptions = Array.from(new Set(prospects.map((p: any) => p.assigned_to).filter(Boolean)));

  const filteredProspects = prospects.filter((p: any) => {
    const matchesSearch = !searchQuery || 
      p.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.contact_email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSegment = filterSegment === "all" || p.segment === filterSegment;
    const matchesOwner = filterOwner === "all" || p.assigned_to === filterOwner;
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    
    return matchesSearch && matchesSegment && matchesStatus && matchesOwner;
  });

  const sorters: Record<string, (a: any, b: any) => number> = {
    "-updated_date": (a, b) => new Date(b.updated_date || 0).getTime() - new Date(a.updated_date || 0).getTime(),
    "updated_date": (a, b) => new Date(a.updated_date || 0).getTime() - new Date(b.updated_date || 0).getTime(),
    "prospect_score": (a, b) => (sortDir === 'asc' ? 1 : -1) * ((a.prospect_score || 0) - (b.prospect_score || 0)),
    "engagement_score": (a, b) => (sortDir === 'asc' ? 1 : -1) * ((a.engagement_score || 0) - (b.engagement_score || 0)),
    "deal_value": (a, b) => (sortDir === 'asc' ? 1 : -1) * ((a.deal_value || 0) - (b.deal_value || 0)),
    "probability": (a, b) => (sortDir === 'asc' ? 1 : -1) * ((a.probability || 0) - (b.probability || 0))
  };
  const sortedProspects = [...filteredProspects].sort(sorters[sortField] || sorters["-updated_date"]);

  const stats = {
    totalProspects: prospects.length,
    hotLeads: prospects.filter((p: any) => p.segment === "Hot Lead" || p.engagement_score >= 70).length,
    activeTasks: tasks.filter((t: any) => t.status === "Pending").length,
    meetingsScheduled: prospects.filter((p: any) => p.status === "Meeting Scheduled").length,
    proposalsSent: prospects.filter((p: any) => p.status === "Proposal Sent").length,
    totalPipeline: prospects.reduce((sum: number, p: any) => sum + (p.deal_value || 0), 0),
    weightedPipeline: prospects.reduce((sum: number, p: any) => sum + ((p.deal_value || 0) * (p.probability || 0) / 100), 0),
    avgEngagement: Math.round(prospects.reduce((sum: number, p: any) => sum + (p.engagement_score || 0), 0) / prospects.length || 0)
  };

  const urgentTasks = tasks.filter((t: any) => {
    if (t.status !== "Pending") return false;
    const dueDate = new Date(t.due_date);
    const now = new Date();
    const hoursDiff = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDiff < 24 && hoursDiff > 0;
  }).slice(0, 5);

  const statusColors: Record<string, string> = {
    "New": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    "Researched": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    "Contacted": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "Engaged": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    "Qualified": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    "Meeting Scheduled": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    "Proposal Sent": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    "Negotiation": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    "Won": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    "Lost": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    "Nurture": "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400"
  };

  const hasErrors = prospectsError || interactionsError || tasksError || outreachError;

  return (
    <div className="py-6 lg:py-8">
      <div className="w-full px-0 lg:px-2 xl:px-4">
        {hasErrors && (
          <Card className="p-4 mb-6 bg-red-50 dark:bg-red-900/20">
            <div className="flex items-center justify-between gap-1 flex-wrap">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-900 dark:text-red-400">Connection Issue</p>
                  <p className="text-sm text-red-700 dark:text-red-300">Some data couldn't be loaded. Click Refresh to try again.</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleRefresh} data-testid="button-retry">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </Card>
        )}

        <div className="flex items-center justify-between gap-1 mb-6 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" data-testid="text-sales-title">Sales CRM</h1>
            <p className="text-lg text-muted-foreground">AI-powered pipeline management and automation</p>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={handleRunAutomation}
              disabled={isAutoRunning}
              data-testid="button-optimize"
            >
              {isAutoRunning ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Optimizing...</>
              ) : (
                <><Sparkles className="w-5 h-5 mr-2" />Optimize Sequences</>
              )}
            </Button>
            <Button variant="outline" onClick={handleRefresh} data-testid="button-refresh">
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {optimizationInsights && (
          <Card className="p-6 mb-6 bg-indigo-50 dark:bg-indigo-900/20">
            <div className="flex items-center justify-between gap-1 mb-2 flex-wrap">
              <div className="text-lg font-semibold">Sequence Optimization Insights</div>
              <Button variant="outline" size="sm" onClick={() => setOptimizationInsights(null)} data-testid="button-clear-insights">Clear</Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-background rounded-lg border p-3">
                <div className="font-medium mb-1">Performance</div>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-words max-h-48 overflow-auto">{JSON.stringify(optimizationInsights.performance || {}, null, 2)}</pre>
              </div>
              <div className="bg-background rounded-lg border p-3">
                <div className="font-medium mb-1">Recommended Actions</div>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-words max-h-48 overflow-auto">{JSON.stringify(optimizationInsights.actions || {}, null, 2)}</pre>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white" data-testid="stat-total-prospects">
            <div className="flex items-center justify-between gap-1 mb-3">
              <Users className="w-8 h-8 opacity-80" />
              <div className="text-right">
                <p className="text-3xl font-bold">{stats.totalProspects}</p>
                <p className="text-sm opacity-90">Total Prospects</p>
              </div>
            </div>
            <div className="text-xs opacity-75">
              {stats.hotLeads} hot leads
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white" data-testid="stat-hot-leads">
            <div className="flex items-center justify-between gap-1 mb-3">
              <Flame className="w-8 h-8 opacity-80" />
              <div className="text-right">
                <p className="text-3xl font-bold">{stats.hotLeads}</p>
                <p className="text-sm opacity-90">Hot Leads</p>
              </div>
            </div>
            <div className="text-xs opacity-75">
              {stats.meetingsScheduled} meetings
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white" data-testid="stat-pipeline">
            <div className="flex items-center justify-between gap-1 mb-3">
              <DollarSign className="w-8 h-8 opacity-80" />
              <div className="text-right">
                <p className="text-3xl font-bold">${(stats.weightedPipeline / 1000).toFixed(0)}K</p>
                <p className="text-sm opacity-90">Weighted Pipeline</p>
              </div>
            </div>
            <div className="text-xs opacity-75">
              ${(stats.totalPipeline / 1000).toFixed(0)}K total pipeline value
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-indigo-500 text-white" data-testid="stat-tasks">
            <div className="flex items-center justify-between gap-1 mb-3">
              <ListTodo className="w-8 h-8 opacity-80" />
              <div className="text-right">
                <p className="text-3xl font-bold">{stats.activeTasks}</p>
                <p className="text-sm opacity-90">Active Tasks</p>
              </div>
            </div>
            <div className="text-xs opacity-75">
              {urgentTasks.length} due in 24 hours
            </div>
          </Card>
        </div>

        {urgentTasks.length > 0 && (
          <Card className="p-6 mb-8 bg-orange-50 dark:bg-orange-900/20">
            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold mb-3">Urgent Tasks Due Today</h3>
                <div className="space-y-2">
                  {urgentTasks.map((task: any) => (
                    <div key={task.id} className="bg-background rounded-lg p-3 flex items-center justify-between gap-1 flex-wrap" data-testid={`urgent-task-${task.id}`}>
                      <div>
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className="text-xs text-muted-foreground">{task.company_name} {task.task_type ? `\u2022 ${task.task_type}` : ''}</p>
                      </div>
                      <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">{task.priority}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search prospects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-prospects"
              />
            </div>

            <Select value={filterSegment} onValueChange={setFilterSegment}>
              <SelectTrigger className="w-full sm:w-[180px]" data-testid="filter-segment">
                <SelectValue placeholder="All Segments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Segments</SelectItem>
                <SelectItem value="Hot Lead">Hot Lead</SelectItem>
                <SelectItem value="Warm Lead">Warm Lead</SelectItem>
                <SelectItem value="Cold Lead">Cold Lead</SelectItem>
                <SelectItem value="High Value">High Value</SelectItem>
                <SelectItem value="Quick Win">Quick Win</SelectItem>
                <SelectItem value="Long Term">Long Term</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]" data-testid="filter-status">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Engaged">Engaged</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Meeting Scheduled">Meeting Scheduled</SelectItem>
                <SelectItem value="Proposal Sent">Proposal Sent</SelectItem>
                <SelectItem value="Negotiation">Negotiation</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterOwner} onValueChange={setFilterOwner}>
              <SelectTrigger className="w-full sm:w-[180px]" data-testid="filter-owner">
                <SelectValue placeholder="Owner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Owners</SelectItem>
                {ownerOptions.map((o: string) => (<SelectItem key={o} value={o}>{o}</SelectItem>))}
              </SelectContent>
            </Select>

            <Select value={sortField} onValueChange={setSortField}>
              <SelectTrigger className="w-full sm:w-[200px]" data-testid="sort-field">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-updated_date">Recently Updated</SelectItem>
                <SelectItem value="updated_date">Oldest Updated</SelectItem>
                <SelectItem value="prospect_score">Prospect Score</SelectItem>
                <SelectItem value="engagement_score">Engagement Score</SelectItem>
                <SelectItem value="deal_value">Deal Value</SelectItem>
                <SelectItem value="probability">Win Probability</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')} data-testid="button-sort-dir">
              {sortDir === 'asc' ? 'Asc' : 'Desc'}
            </Button>

            <div className="flex gap-2">
              <Button
                variant={view === "list" ? "default" : "outline"}
                onClick={() => setView("list")}
                size="sm"
                data-testid="button-view-list"
              >
                List
              </Button>
              <Button
                variant={view === "analytics" ? "default" : "outline"}
                onClick={() => setView("analytics")}
                size="sm"
                data-testid="button-view-analytics"
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {loadingProspects ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        ) : filteredProspects.length === 0 ? (
          <Card className="p-12 text-center">
            <Target className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No prospects found. Adjust your filters or add new prospects.</p>
          </Card>
        ) : (
          <>
            {view === "list" && (
              <Card className="p-6">
                <div className="space-y-3">
                  {sortedProspects.map((prospect: any) => (
                    <div 
                      key={prospect.id} 
                      className="border rounded-xl p-5 hover-elevate transition-all cursor-pointer bg-background flex gap-3"
                      onClick={() => setSelectedProspect(prospect)}
                      data-testid={`prospect-row-${prospect.id}`}
                    >
                      <div className="pt-1">
                        <Checkbox
                          checked={selectedProspectIds.has(prospect.id)}
                          onCheckedChange={(c) => {
                            const next = new Set(selectedProspectIds);
                            if (c) next.add(prospect.id); else next.delete(prospect.id);
                            setSelectedProspectIds(next);
                          }}
                          onClick={(e: any) => e.stopPropagation()}
                          data-testid={`checkbox-prospect-${prospect.id}`}
                        />
                      </div>
                      <div className="flex items-start justify-between gap-1 flex-1 flex-wrap">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                              {prospect.engagement_score >= 60 && <Flame className="w-5 h-5 text-orange-500" />}
                              {prospect.contact_name}
                            </h3>
                            <Badge className={statusColors[prospect.status] || "bg-gray-100 text-gray-700"}>
                              {prospect.status}
                            </Badge>
                            {prospect.segment && (
                              <Badge variant="outline">{prospect.segment}</Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3 flex-wrap">
                            <div className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              <span>{prospect.company_name}</span>
                            </div>
                            {prospect.contact_title && (
                              <span>{prospect.contact_title}</span>
                            )}
                            {prospect.contact_email && (
                              <a href={`mailto:${prospect.contact_email}`} className="text-blue-600 hover:underline" onClick={(e) => e.stopPropagation()}>
                                {prospect.contact_email}
                              </a>
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div>
                              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>Overall</span>
                                <span className="font-bold">{prospect.prospect_score || 0}</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600" style={{width: `${prospect.prospect_score || 0}%`}} />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>Fit</span>
                                <span className="font-bold">{prospect.fit_score || 0}</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-green-600" style={{width: `${prospect.fit_score || 0}%`}} />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>Engagement</span>
                                <span className="font-bold">{prospect.engagement_score || 0}</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-orange-600" style={{width: `${prospect.engagement_score || 0}%`}} />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 flex-wrap">
                            {prospect.deal_value && (
                              <div className="text-sm">
                                <span className="text-muted-foreground">Deal Value:</span>
                                <span className="font-bold text-green-700 dark:text-green-400 ml-1">${prospect.deal_value.toLocaleString()}</span>
                              </div>
                            )}
                            {prospect.probability !== undefined && prospect.probability !== null && (
                              <div className="text-sm">
                                <span className="text-muted-foreground">Win Probability:</span>
                                <span className="font-bold text-blue-700 dark:text-blue-400 ml-1">{prospect.probability}%</span>
                              </div>
                            )}
                            {prospect.last_contact_date && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>Last contact: {new Date(prospect.last_contact_date).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {prospect.linkedin_url && (
                          <a
                            href={prospect.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {view === "analytics" && (
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-bold mb-4 text-lg">Pipeline by Stage</h3>
                  <div className="space-y-3">
                    {["Contacted", "Engaged", "Qualified", "Meeting Scheduled", "Proposal Sent", "Negotiation"].map(stage => {
                      const count = prospects.filter((p: any) => p.status === stage).length;
                      const value = prospects.filter((p: any) => p.status === stage).reduce((sum: number, p: any) => sum + (p.deal_value || 0), 0);
                      const percentage = (count / prospects.length * 100) || 0;
                      
                      return (
                        <div key={stage} data-testid={`pipeline-stage-${stage.toLowerCase().replace(/\s+/g, '-')}`}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{stage}</span>
                            <span className="font-bold">{count} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{width: `${percentage}%`}} />
                          </div>
                          {value > 0 && (
                            <div className="text-xs text-muted-foreground mt-1">${value.toLocaleString()}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-bold mb-4 text-lg">Segment Distribution</h3>
                  <div className="space-y-3">
                    {["Hot Lead", "Warm Lead", "High Value", "Quick Win", "Long Term"].map(segment => {
                      const count = prospects.filter((p: any) => p.segment === segment).length;
                      const percentage = (count / prospects.length * 100) || 0;
                      const avgScore = prospects.filter((p: any) => p.segment === segment).reduce((sum: number, p: any) => sum + (p.prospect_score || 0), 0) / count || 0;
                      
                      return (
                        <div key={segment}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{segment}</span>
                            <span className="font-bold">{count} Avg {avgScore.toFixed(0)}</span>
                          </div>
                          <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-orange-500 to-red-500" style={{width: `${percentage}%`}} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-bold mb-4 text-lg">Activity Summary</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-1 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-6 h-6 text-blue-600" />
                        <span className="text-muted-foreground">Total Interactions</span>
                      </div>
                      <span className="text-2xl font-bold">{interactions.length}</span>
                    </div>
                    <div className="flex items-center justify-between gap-1 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <span className="text-muted-foreground">Completed Tasks</span>
                      </div>
                      <span className="text-2xl font-bold">{tasks.filter((t: any) => t.status === "Completed").length}</span>
                    </div>
                    <div className="flex items-center justify-between gap-1 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="w-6 h-6 text-orange-600" />
                        <span className="text-muted-foreground">Emails Sent</span>
                      </div>
                      <span className="text-2xl font-bold">{outreach.length}</span>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </>
        )}

        {selectedProspect && (
          <ProspectDetailModal
            prospect={selectedProspect}
            onClose={() => setSelectedProspect(null)}
          />
        )}
      </div>
    </div>
  );
}