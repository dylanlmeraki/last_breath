import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Globe, CheckCircle, AlertTriangle, Clock, Activity } from "lucide-react";

export default function WebsiteMonitoring() {
  const monitors = [
    { name: "Main Website", url: "pacificengineering.com", status: "up", uptime: "99.9%", responseTime: "245ms" },
    { name: "Client Portal", url: "portal.pacificengineering.com", status: "up", uptime: "99.8%", responseTime: "312ms" },
    { name: "API Gateway", url: "api.pacificengineering.com", status: "up", uptime: "99.95%", responseTime: "89ms" },
  ];

  return (
    <div>
      <PageHeader title="Website Monitoring" subtitle="Monitor website uptime, performance, and health" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Globe} label="Sites Monitored" value={monitors.length} />
        <StatCard icon={CheckCircle} label="Sites Up" value={monitors.filter((m) => m.status === "up").length} />
        <StatCard icon={Activity} label="Avg Response" value="215ms" />
        <StatCard icon={Clock} label="Avg Uptime" value="99.9%" />
      </div>

      <div className="space-y-3">
        {monitors.map((m, i) => (
          <Card key={i} className="hover-elevate" data-testid={`monitor-card-${i}`}>
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`h-3 w-3 rounded-full flex-shrink-0 ${m.status === "up" ? "bg-green-500" : "bg-red-500"}`} />
                <div className="min-w-0">
                  <p className="font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.url}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm flex-shrink-0">
                <div className="text-right">
                  <p className="font-medium">{m.uptime}</p>
                  <p className="text-xs text-muted-foreground">uptime</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{m.responseTime}</p>
                  <p className="text-xs text-muted-foreground">response</p>
                </div>
                <Badge variant={m.status === "up" ? "default" : "destructive"}>{m.status === "up" ? "Healthy" : "Down"}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
