import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

async function filterEntities(entity: string, query: Record<string, any>, sort?: string, limit?: number) {
  const res = await apiRequest("POST", `/api/${entity}/filter`, { query, sort, limit });
  return res.json();
}

export function useClientProjects() {
  const { user } = useAuth();
  return useQuery<any[]>({
    queryKey: ["/api/projects", "client", user?.email],
    queryFn: () => filterEntities("projects", { client_email: user?.email }),
    enabled: !!user?.email,
  });
}

export function useClientMilestones(projectIds: string[]) {
  return useQuery<any[]>({
    queryKey: ["/api/project-milestones", "client", projectIds],
    queryFn: async () => {
      if (projectIds.length === 0) return [];
      const results = await Promise.all(
        projectIds.map((id) => filterEntities("project-milestones", { project_id: id }))
      );
      return results.flat();
    },
    enabled: projectIds.length > 0,
  });
}

export function useClientChangeOrders(projectIds: string[]) {
  return useQuery<any[]>({
    queryKey: ["/api/change-orders", "client", projectIds],
    queryFn: async () => {
      if (projectIds.length === 0) return [];
      const results = await Promise.all(
        projectIds.map((id) => filterEntities("change-orders", { project_id: id }))
      );
      return results.flat();
    },
    enabled: projectIds.length > 0,
  });
}

export function useClientDocuments(projectIds: string[]) {
  return useQuery<any[]>({
    queryKey: ["/api/project-documents", "client", projectIds],
    queryFn: async () => {
      if (projectIds.length === 0) return [];
      const results = await Promise.all(
        projectIds.map((id) => filterEntities("project-documents", { project_id: id }))
      );
      return results.flat().sort((a: any, b: any) =>
        new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
      );
    },
    enabled: projectIds.length > 0,
  });
}

export function useClientProposals(projectIds: string[]) {
  return useQuery<any[]>({
    queryKey: ["/api/proposals", "client", projectIds],
    queryFn: async () => {
      if (projectIds.length === 0) return [];
      const results = await Promise.all(
        projectIds.map((id) => filterEntities("proposals", { project_id: id }))
      );
      return results.flat().sort((a: any, b: any) =>
        new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
      );
    },
    enabled: projectIds.length > 0,
  });
}

export function useClientInvoices() {
  const { user } = useAuth();
  return useQuery<any[]>({
    queryKey: ["/api/invoices", "client", user?.email],
    queryFn: () => filterEntities("invoices", { client_email: user?.email }),
    enabled: !!user?.email,
  });
}

export function useClientMessages(projectIds: string[]) {
  return useQuery<any[]>({
    queryKey: ["/api/project-messages", "client", projectIds],
    queryFn: async () => {
      if (projectIds.length === 0) return [];
      const results = await Promise.all(
        projectIds.map((id) => filterEntities("project-messages", { project_id: id }))
      );
      return results.flat().sort((a: any, b: any) =>
        new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
      );
    },
    enabled: projectIds.length > 0,
  });
}

export function useClientNotifications() {
  const { user } = useAuth();
  return useQuery<any[]>({
    queryKey: ["/api/notifications", "client", user?.email],
    queryFn: () => filterEntities("notifications", { recipient_email: user?.email, read: false }),
    enabled: !!user?.email,
  });
}

export function useClientTeamMembers() {
  const { user } = useAuth();
  return useQuery<any[]>({
    queryKey: ["/api/client-team-members", "client", user?.email],
    queryFn: () => filterEntities("client-team-members", { invited_by: user?.email }),
    enabled: !!user?.email,
  });
}

export function useClientProposalMessages(proposalId: string | null) {
  return useQuery<any[]>({
    queryKey: ["/api/proposal-messages", proposalId],
    queryFn: () => {
      if (!proposalId) return Promise.resolve([]);
      return filterEntities("proposal-messages", { proposal_id: proposalId });
    },
    enabled: !!proposalId,
  });
}

export function useClientDocumentApprovals(documentIds: string[]) {
  return useQuery<any[]>({
    queryKey: ["/api/document-approvals", "client", documentIds],
    queryFn: async () => {
      if (documentIds.length === 0) return [];
      const results = await Promise.all(
        documentIds.map((id) => filterEntities("document-approvals", { document_id: id }))
      );
      return results.flat();
    },
    enabled: documentIds.length > 0,
  });
}

export function useClientFeedback() {
  const { user } = useAuth();
  return useQuery<any[]>({
    queryKey: ["/api/client-feedback", "client", user?.email],
    queryFn: () => filterEntities("client-feedback", { client_email: user?.email }),
    enabled: !!user?.email,
  });
}

export function useNotificationPreferences() {
  const { user } = useAuth();
  return useQuery<any[]>({
    queryKey: ["/api/notification-preferences", user?.email],
    queryFn: () => filterEntities("notification-preferences", { user_email: user?.email }),
    enabled: !!user?.email,
  });
}

export function useClientProjectRequests() {
  const { user } = useAuth();
  return useQuery<any[]>({
    queryKey: ["/api/project-requests", "client", user?.email],
    queryFn: () => filterEntities("project-requests", { client_email: user?.email }),
    enabled: !!user?.email,
  });
}

export function useClientRfis(projectIds: string[]) {
  return useQuery<any[]>({
    queryKey: ["/api/rfis", "client", projectIds],
    queryFn: async () => {
      if (projectIds.length === 0) return [];
      const results = await Promise.all(
        projectIds.map((id) => filterEntities("rfis", { project_id: id }))
      );
      return results.flat().sort((a: any, b: any) =>
        new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
      );
    },
    enabled: projectIds.length > 0,
  });
}

export function useSendMessage() {
  return useMutation({
    mutationFn: async (data: { project_id: string; sender_email: string; sender_name: string; message: string; message_type?: string }) => {
      const res = await apiRequest("POST", "/api/project-messages", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/project-messages"] });
    },
  });
}

export function useSendProposalMessage() {
  return useMutation({
    mutationFn: async (data: { proposal_id: string; sender_email: string; sender_name: string; message: string }) => {
      const res = await apiRequest("POST", "/api/proposal-messages", data);
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/proposal-messages", variables.proposal_id] });
    },
  });
}

export function useUpdateEntity(entity: string) {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest("PUT", `/api/${entity}/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${entity}`] });
    },
  });
}

export function useCreateEntity(entity: string) {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", `/api/${entity}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${entity}`] });
    },
  });
}

export function useDeleteEntity(entity: string) {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/${entity}/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${entity}`] });
    },
  });
}
