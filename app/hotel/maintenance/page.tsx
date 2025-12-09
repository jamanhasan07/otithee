"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Maintenance = {
  id: string;
  room: string;
  issue: string;
  status: "Open" | "In Progress" | "Resolved" | "Blocked";
  priority: "Low" | "Medium" | "High" | "Critical";
  assigned: string;
  reportedAt: string;
  notes?: string;
};

const SAMPLE: Maintenance[] = [
  { id: "m100", room: "101", issue: "Broken lamp", status: "Open", priority: "Low", assigned: "Unassigned", reportedAt: "2025-12-08T09:15:00Z", notes: "Guest reported during afternoon" },
  { id: "m101", room: "202", issue: "AC not cooling", status: "In Progress", priority: "High", assigned: "Rafiq", reportedAt: "2025-12-08T06:30:00Z", notes: "Refrigerant suspected" },
  { id: "m102", room: "305", issue: "Water leak (bathroom)", status: "Blocked", priority: "Critical", assigned: "Unassigned", reportedAt: "2025-12-07T23:20:00Z", notes: "Needs plumbing team" },
  { id: "m103", room: "110", issue: "Broken door latch", status: "Resolved", priority: "Medium", assigned: "Nadia", reportedAt: "2025-12-06T12:00:00Z", notes: "Fixed and tested" },
];

const statusStyles: Record<Maintenance["status"], string> = {
  Open: "bg-red-50 text-red-800 border-red-100",
  "In Progress": "bg-blue-50 text-blue-800 border-blue-100",
  Resolved: "bg-green-50 text-green-800 border-green-100",
  Blocked: "bg-orange-50 text-orange-800 border-orange-100",
};

const priorityStyles: Record<Maintenance["priority"], string> = {
  Low: "bg-slate-50 text-slate-800 border-slate-100",
  Medium: "bg-yellow-50 text-yellow-800 border-yellow-100",
  High: "bg-red-50 text-red-800 border-red-100",
  Critical: "bg-red-100 text-red-900 border-red-200",
};

export default function MaintenancePage() {
  const router = useRouter();
  const [items, setItems] = useState<Maintenance[]>(SAMPLE);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Maintenance["status"]>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | Maintenance["priority"]>("all");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [openAssign, setOpenAssign] = useState<Maintenance | null>(null);

  const selectedIds = Object.keys(selected).filter((k) => selected[k]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      const hay = `${it.room} ${it.issue} ${it.assigned} ${it.notes || ""}`.toLowerCase();
      const matchesQ = q === "" ? true : hay.includes(q);
      const matchesStatus = statusFilter === "all" ? true : it.status === statusFilter;
      const matchesPriority = priorityFilter === "all" ? true : it.priority === priorityFilter;
      return matchesQ && matchesStatus && matchesPriority;
    });
  }, [items, query, statusFilter, priorityFilter]);

  function toggleSelect(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  function bulkResolve() {
    if (selectedIds.length === 0) return;
    setItems((prev) => prev.map((it) => (selectedIds.includes(it.id) ? { ...it, status: "Resolved" } : it)));
    setSelected({});
  }

  function assignTech(id: string, tech: string) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, assigned: tech, status: "In Progress" } : it)));
    setOpenAssign(null);
  }

  function reopen(id: string) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status: "Open" } : it)));
  }

  function changePriority(id: string, p: Maintenance["priority"]) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, priority: p } : it)));
  }

  const staffSummary = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((it) => map.set(it.assigned || "Unassigned", (map.get(it.assigned || "Unassigned") || 0) + 1));
    return Array.from(map.entries());
  }, [items]);

  return (
    <main className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="mb-4 md:mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Maintenance</h1>
          <p className="text-sm text-muted-foreground mt-1">Track and manage maintenance requests across the property.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search (room, issue, tech...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-72"
          />

          <div className="flex gap-2 items-center">
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as any)}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={bulkResolve} disabled={selectedIds.length === 0} className="whitespace-nowrap">
              Resolve selected ({selectedIds.length})
            </Button>
          </div>
        </div>
      </div>

      {/* Main layout: left list, right sidebar (on md+) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* LEFT: list (spans 2 cols on md) */}
        <div className="md:col-span-2">
          <div className="space-y-4">
            {filtered.map((it) => (
              <article
                key={it.id}
                className="grid grid-cols-1 sm:grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_minmax(140px,180px)_minmax(120px,240px)] gap-3 items-start p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition min-h-[96px]"
                aria-labelledby={`maint-${it.id}`}
              >
                {/* 1) checkbox (always first column) */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    aria-label={`Select ${it.id}`}
                    checked={!!selected[it.id]}
                    onChange={() => toggleSelect(it.id)}
                    className="mt-1"
                  />
                </div>

                {/* 2) main content: title + notes */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 id={`maint-${it.id}`} className="font-semibold truncate">
                      Room {it.room} — {it.issue}
                    </h3>

                    {/* priority pill (only visible on very narrow screens inside content) */}
                    <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded border bg-slate-50 text-slate-800 border-slate-100 sm:hidden">
                      {it.priority}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground truncate mt-1">{it.notes}</p>

                  <div className="mt-2 text-xs text-muted-foreground flex flex-wrap gap-3">
                    <div>Reported: {new Date(it.reportedAt).toLocaleString()}</div>
                    <div>Assigned: <span className="font-medium">{it.assigned}</span></div>
                  </div>
                </div>

                {/* 3) status + priority (on md this is its own column; hidden on sm in favor of compact content) */}
                <div className="hidden md:flex flex-col items-start md:items-center gap-2">
                  <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded border ${statusStyles[it.status]}`}>
                    {it.status}
                  </span>

                  <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded border ${priorityStyles[it.priority]}`}>
                    {it.priority}
                  </span>

                  {/* compact priority selector on md+ */}
                  <div className="w-full md:w-auto mt-1">
                    <Select value={it.priority} onValueChange={(v) => changePriority(it.id, v as any)}>
                      <SelectTrigger className="w-full md:w-28">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 4) actions: full-width stacked on mobile, inline on larger screens */}
                <div className="flex flex-col items-end gap-2">
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button size="sm" className="w-full sm:w-auto" onClick={() => setOpenAssign(it)}>Assign</Button>
                    <Button size="sm" variant="ghost" className="w-full sm:w-auto" onClick={() => reopen(it.id)}>Reopen</Button>
                  </div>

                  <div className="flex w-full sm:w-auto gap-2">
                    <Button size="sm" variant="outline" onClick={() => setItems((prev) => prev.map(p => p.id === it.id ? {...p, status: "Resolved"} : p))}>Mark Resolved</Button>
                  </div>
                </div>
              </article>
            ))}

            {filtered.length === 0 && (
              <div className="text-sm text-muted-foreground">No requests match your filters.</div>
            )}
          </div>
        </div>

        {/* RIGHT: sidebar (sticky on md) */}
        <aside className="md:sticky md:top-6">
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
              <CardContent>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between"><span>Open</span><span>{items.filter(i => i.status === "Open").length}</span></div>
                  <div className="flex justify-between"><span>In Progress</span><span>{items.filter(i => i.status === "In Progress").length}</span></div>
                  <div className="flex justify-between"><span>Blocked</span><span>{items.filter(i => i.status === "Blocked").length}</span></div>
                  <div className="flex justify-between"><span>Resolved</span><span>{items.filter(i => i.status === "Resolved").length}</span></div>
                </div>

                <Button className="mt-4 w-full" onClick={() => router.push("/maintenance/schedule")}>Open Maintenance Schedule</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Technicians</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {staffSummary.map(([tech, count]) => (
                    <div key={tech} className="flex justify-between">
                      <span>{tech}</span>
                      <span className="text-muted-foreground">{count} task{count > 1 ? "s" : ""}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <Button onClick={() => setItems((prev) => prev.map(it => ({...it, status: "Resolved"})))}>Resolve all (demo)</Button>
                  <Button variant="ghost" onClick={() => { setItems(SAMPLE); setSelected({}); }}>Reset demo</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>

      {/* Assign dialog */}
      <Dialog open={!!openAssign} onOpenChange={() => setOpenAssign(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Assign Technician</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div className="text-sm">Request: Room {openAssign?.room} — {openAssign?.issue}</div>
            <Select onValueChange={(v) => openAssign && assignTech(openAssign.id, v as any)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Pick technician" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Rafiq">Rafiq</SelectItem>
                <SelectItem value="Nadia">Nadia</SelectItem>
                <SelectItem value="Rafi">Rafi</SelectItem>
                <SelectItem value="Unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpenAssign(null)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
