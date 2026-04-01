import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Bot, Sparkles, Loader2, Send, Users } from "lucide-react";

export default function AISalesAssistant() {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const { data: prospects, isLoading } = useQuery<any[]>({ queryKey: ["/api/prospects"] });

  const aiMutation = useMutation({
    mutationFn: async (userPrompt: string) => {
      const res = await apiRequest("POST", "/api/integrations/llm", {
        prompt: userPrompt,
        model: "gpt-4o-mini",
        temperature: 0.7,
      });
      return res.json();
    },
    onSuccess: (data: any) => {
      setResponse(data.content || data.text || JSON.stringify(data));
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Failed", description: e.message }),
  });

  const quickActions = [
    { label: "Draft cold email", prompt: "Write a professional cold outreach email for a construction engineering prospect" },
    { label: "Follow-up template", prompt: "Write a follow-up email for a prospect who hasn't responded in 5 days" },
    { label: "Meeting request", prompt: "Write a concise email requesting a discovery call with a potential client" },
    { label: "Proposal intro", prompt: "Write an engaging opening paragraph for an engineering services proposal" },
  ];

  return (
    <div>
      <PageHeader title="AI Sales Assistant" subtitle="AI-powered tools for sales outreach and content generation" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5" /> AI Assistant</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>What do you need help with?</Label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  placeholder="E.g., Write a cold outreach email for..."
                  data-testid="input-ai-prompt"
                />
              </div>
              <Button
                onClick={() => aiMutation.mutate(prompt)}
                disabled={aiMutation.isPending || !prompt}
                data-testid="button-ai-generate"
              >
                {aiMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                Generate
              </Button>
              {response && (
                <div className="mt-4 p-4 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium mb-2 text-muted-foreground">AI Response:</p>
                  <div className="text-sm whitespace-pre-wrap" data-testid="text-ai-response">{response}</div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickActions.map((action, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="justify-start text-left h-auto py-3"
                    onClick={() => { setPrompt(action.prompt); aiMutation.mutate(action.prompt); }}
                    disabled={aiMutation.isPending}
                    data-testid={`button-quick-action-${i}`}
                  >
                    <Sparkles className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader><CardTitle className="text-base">Recent Prospects</CardTitle></CardHeader>
            <CardContent>
              {isLoading ? <TableSkeleton rows={3} /> : (!prospects || prospects.length === 0) ? (
                <p className="text-sm text-muted-foreground text-center py-8">No prospects</p>
              ) : (
                <div className="space-y-2">
                  {prospects.slice(0, 8).map((p: any) => (
                    <div key={p.id} className="p-2 rounded bg-muted/30 text-sm" data-testid={`ai-prospect-${p.id}`}>
                      <p className="font-medium">{p.name || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{p.company || p.email}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
