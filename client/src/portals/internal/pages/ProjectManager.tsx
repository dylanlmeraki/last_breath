import { useState } from "react";
import { listEntities, createEntity, updateEntity, deleteEntity } from "@/lib/apiClient";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, FileText, Sparkles, Save, Edit, Trash2, Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { formatDate, formatCurrency, generateProjectNumber } from "@/lib/utils";

export default function ProjectManager() {
  const [active, setActive] = useState('projects');
  const [scope, setScope] = useState<{ clientEmail: string | null; projectId: string | null }>({ clientEmail: null, projectId: null });
  const { toast } = useToast();
  const navigate = useNavigate();

  const qc = useQueryClient();

  const [editingProject, setEditingProject] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formData, setFormData] = useState({
    project_name: "",
    project_number: "",
    client_email: "",
    client_name: "",
    project_type: "SWPPP",
    status: "Planning",
    priority: "Medium",
    start_date: "",
    estimated_completion: "",
    location: "",
    description: "",
    budget: 0,
    notes: ""
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => listEntities('Project', '-created_date', 200),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => listEntities('User'),
  });

  const saveProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingProject?.id) {
        return await updateEntity('Project', editingProject.id, data);
      } else {
        return await createEntity('Project', { ...data, project_number: generateProjectNumber() });
      }
    },
    onSuccess: () => {
      toast({ title: editingProject ? 'Project updated' : 'Project created' });
      qc.invalidateQueries({ queryKey: ['projects'] });
      resetForm();
    },
    onError: (e: any) => {
      toast({ variant: "destructive", title: "Failed to save project", description: e?.message || 'Unknown error' });
    }
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (id: string) => deleteEntity('Project', id),
    onSuccess: () => {
      toast({ title: 'Project deleted' });
      qc.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (e: any) => {
      toast({ variant: "destructive", title: "Failed to delete", description: e?.message || 'Unknown error' });
    }
  });

  const resetForm = () => {
    setEditingProject(null);
    setFormData({
      project_name: "",
      project_number: "",
      client_email: "",
      client_name: "",
      project_type: "SWPPP",
      status: "Planning",
      priority: "Medium",
      start_date: "",
      estimated_completion: "",
      location: "",
      description: "",
      budget: 0,
      notes: ""
    });
  };

  const editProject = (project: any) => {
    setEditingProject(project);
    setFormData(project);
  };

  const filteredProjects = projects.filter((project: any) => {
    const scopeClient = !scope.clientEmail || (project.client_email === scope.clientEmail);
    const scopeProject = !scope.projectId || (project.id === scope.projectId);
    if (!scopeClient || !scopeProject) return false;
    const matchesSearch = project.project_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.project_number?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const basePath = window.location.pathname.startsWith("/internal") ? "/internal" : "";

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold" data-testid="text-project-manager-title">Project Manager</h1>
      </div>

      <Tabs value={active} onValueChange={setActive}>
        <TabsList className="flex flex-wrap gap-1 mb-6">
          <TabsTrigger value="projects" data-testid="tab-projects"><Building2 className="w-4 h-4 mr-2" />Projects</TabsTrigger>
          <TabsTrigger value="docs" data-testid="tab-docs">Documents</TabsTrigger>
          <TabsTrigger value="reports" data-testid="tab-reports"><FileText className="w-4 h-4 mr-2" />Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">
                  {editingProject ? "Edit Project" : "Create Project"}
                </h2>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Project Name *</Label>
                      <Input
                        value={formData.project_name}
                        onChange={(e) => setFormData({...formData, project_name: e.target.value})}
                        placeholder="Downtown SWPPP Project"
                        data-testid="input-project-name"
                      />
                    </div>
                    <div>
                      <Label>Project Number</Label>
                      <Input
                        value={formData.project_number}
                        onChange={(e) => setFormData({...formData, project_number: e.target.value})}
                        placeholder="PROJ-2024-001"
                        data-testid="input-project-number"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Client Name *</Label>
                      <Input
                        value={formData.client_name}
                        onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                        placeholder="ABC Construction"
                        data-testid="input-client-name"
                      />
                    </div>
                    <div>
                      <Label>Client Email *</Label>
                      <Input
                        type="email"
                        value={formData.client_email}
                        onChange={(e) => setFormData({...formData, client_email: e.target.value})}
                        placeholder="client@example.com"
                        data-testid="input-client-email"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label>Project Type</Label>
                      <Select value={formData.project_type} onValueChange={(value) => setFormData({...formData, project_type: value})}>
                        <SelectTrigger data-testid="select-project-type"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SWPPP">SWPPP</SelectItem>
                          <SelectItem value="Construction">Construction</SelectItem>
                          <SelectItem value="Inspections">Inspections</SelectItem>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Special Inspections">Special Inspections</SelectItem>
                          <SelectItem value="Multiple Services">Multiple Services</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                        <SelectTrigger data-testid="select-status"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Planning">Planning</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="On Hold">On Hold</SelectItem>
                          <SelectItem value="Under Review">Under Review</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                        <SelectTrigger data-testid="select-priority"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input type="date" value={formData.start_date} onChange={(e) => setFormData({...formData, start_date: e.target.value})} data-testid="input-start-date" />
                    </div>
                    <div>
                      <Label>Estimated Completion</Label>
                      <Input type="date" value={formData.estimated_completion} onChange={(e) => setFormData({...formData, estimated_completion: e.target.value})} data-testid="input-est-completion" />
                    </div>
                  </div>

                  <div>
                    <Label>Location</Label>
                    <Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="San Francisco, CA" data-testid="input-location" />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} data-testid="input-description" />
                  </div>

                  <div>
                    <Label>Budget ($)</Label>
                    <Input type="number" value={formData.budget} onChange={(e) => setFormData({...formData, budget: parseFloat(e.target.value) || 0})} data-testid="input-budget" />
                  </div>

                  <div>
                    <Label>Internal Notes</Label>
                    <Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={2} data-testid="input-notes" />
                  </div>

                  <div className="flex gap-3 pt-4 flex-wrap">
                    {editingProject && <Button variant="outline" onClick={resetForm} data-testid="button-cancel-edit">Cancel</Button>}
                    <Button
                      onClick={() => saveProjectMutation.mutate(formData)}
                      disabled={!formData.project_name || !formData.client_name || !formData.client_email || saveProjectMutation.isPending}
                      className="flex-1"
                      data-testid="button-save-project"
                    >
                      {saveProjectMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      <Save className="w-4 h-4 mr-2" />
                      {editingProject ? "Update" : "Create"} Project
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <Card className="p-6">
                <div className="flex items-center justify-between gap-1 mb-4 flex-wrap">
                  <h3 className="text-xl font-bold">Projects</h3>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">{filteredProjects.length}</Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" data-testid="input-search-projects" />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger data-testid="filter-project-status"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {projectsLoading && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  )}
                  {!projectsLoading && filteredProjects.length === 0 && (
                    <div className="p-6 text-center text-sm text-muted-foreground bg-muted/50 rounded-lg border">
                      No projects match your filters. Create a new one on the left or clear filters above.
                    </div>
                  )}
                  {filteredProjects.map((project: any) => (
                    <div key={project.id} className="border rounded-lg p-3 hover:bg-accent/50 cursor-pointer transition-colors" onClick={() => editProject(project)} data-testid={`project-item-${project.id}`}>
                      <div className="flex items-start justify-between gap-1 mb-2 flex-wrap">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{project.project_name}</h4>
                          <p className="text-xs text-muted-foreground">{project.client_name}</p>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">{project.project_type}</Badge>
                            <Badge className={project.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}>
                              {project.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); editProject(project); }} data-testid={`button-edit-project-${project.id}`}>
                          <Edit className="w-3 h-3 mr-1" />Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); if (confirm('Delete?')) deleteProjectMutation.mutate(project.id); }} data-testid={`button-delete-project-${project.id}`}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="docs" className="mt-4">
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Document Management</h3>
            <p className="text-muted-foreground">Document management features are available through individual project detail pages.</p>
            <Button className="mt-4" onClick={() => navigate(basePath + '/projects')} data-testid="button-go-to-projects">
              View Projects
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Project Reports</h3>
            <p className="text-muted-foreground">Select a project from the Projects tab to generate reports.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}