import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useClientProjects } from "../lib/useClientData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Star, CheckCircle2 } from "lucide-react";

interface FeedbackFormProps {
  onSuccess?: () => void;
  compact?: boolean;
}

const categories = [
  { value: "general", label: "General Feedback" },
  { value: "project_quality", label: "Project Quality" },
  { value: "communication", label: "Communication" },
  { value: "timeliness", label: "Timeliness" },
  { value: "professionalism", label: "Professionalism" },
  { value: "value", label: "Value for Money" },
  { value: "suggestion", label: "Suggestion" },
];

export function FeedbackForm({ onSuccess, compact = false }: FeedbackFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState("general");
  const [projectId, setProjectId] = useState("");
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { data: projects } = useClientProjects();

  const submitMutation = useMutation({
    mutationFn: async (data: Record<string, any>) => {
      const res = await apiRequest("POST", "/api/client-feedback", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/client-feedback"] });
      setSubmitted(true);
      toast({ title: "Thank you!", description: "Your feedback has been submitted successfully." });
      onSuccess?.();
    },
    onError: (e: any) => {
      toast({ variant: "destructive", title: "Error", description: e.message });
    },
  });

  const handleSubmit = () => {
    if (rating === 0) {
      toast({ variant: "destructive", title: "Rating required", description: "Please select a rating before submitting." });
      return;
    }
    submitMutation.mutate({
      client_email: user?.email,
      project_id: projectId || null,
      category,
      rating,
      comments: comments.trim() || null,
      status: "new",
      created_by: user?.email,
    });
  };

  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setCategory("general");
    setProjectId("");
    setComments("");
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <Card data-testid="card-feedback-success">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center py-4">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 mb-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-lg mb-1" data-testid="text-feedback-success-title">Thank You!</h3>
            <p className="text-sm text-muted-foreground mb-4">Your feedback has been received and helps us improve our services.</p>
            <Button variant="outline" onClick={resetForm} data-testid="button-submit-another-feedback">
              Submit Another
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-feedback-form">
      <CardHeader>
        <CardTitle className="text-base">Share Your Feedback</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Rating</Label>
          <div className="flex items-center gap-1 mt-1" data-testid="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-0.5 transition-colors"
                data-testid={`button-star-${star}`}
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground/40"
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="text-sm text-muted-foreground ml-2" data-testid="text-rating-value">
                {rating}/5
              </span>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="feedback-category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger data-testid="select-feedback-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!compact && (
          <div>
            <Label htmlFor="feedback-project">Project (optional)</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger data-testid="select-feedback-project">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No specific project</SelectItem>
                {(projects || []).map((p: any) => (
                  <SelectItem key={p.id} value={p.id}>{p.project_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label htmlFor="feedback-comments">Comments</Label>
          <Textarea
            id="feedback-comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Tell us about your experience..."
            rows={compact ? 3 : 4}
            data-testid="input-feedback-comments"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={submitMutation.isPending || rating === 0}
          className="w-full"
          data-testid="button-submit-feedback"
        >
          {submitMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Submit Feedback
        </Button>
      </CardContent>
    </Card>
  );
}
