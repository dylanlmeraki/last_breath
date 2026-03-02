import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Plus, UserCog, Loader2 } from "lucide-react";
import { getInitials, formatDate } from "@/lib/utils";

const userSchema = z.object({
  full_name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  role: z.string().default("user"),
  department: z.string().optional(),
  title: z.string().optional(),
});

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: users, isLoading } = useQuery<any[]>({ queryKey: ["/api/prospects"] });

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: { full_name: "", email: "", role: "user", department: "", title: "" },
  });

  return (
    <div>
      <PageHeader title="User Management" subtitle="Manage team members and access" />
      <div className="mb-4"><SearchInput value={search} onChange={setSearch} placeholder="Search users..." /></div>
      <EmptyState icon={UserCog} title="User management" description="User management features are being configured. Users can register through the auth system." />
    </div>
  );
}
