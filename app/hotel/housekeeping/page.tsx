"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Task = {
  id: string;
  room: string;
  type: string;
  status: "Pending" | "Dirty" | "In Progress" | "Cleaned";
  assigned: string;
  priority: "Low" | "Medium" | "High";
  notes: string;
};

// Status color system
const statusColors: Record<string, string> = {
  Dirty: "bg-red-100 text-red-700 border-red-300",
  Pending: "bg-orange-100 text-orange-700 border-orange-300",
  "In Progress": "bg-blue-100 text-blue-700 border-blue-300",
  Cleaned: "bg-green-100 text-green-700 border-green-300",
};

const SAMPLE_TASKS: Task[] = [
  {
    id: "101",
    room: "101",
    type: "Daily",
    status: "Dirty",
    assigned: "Rana",
    priority: "High",
    notes: "Spill on carpet",
  },
  {
    id: "102",
    room: "102",
    type: "Checkout",
    status: "Cleaned",
    assigned: "Sadia",
    priority: "Low",
    notes: "No issues",
  },
  {
    id: "201",
    room: "201",
    type: "Daily",
    status: "In Progress",
    assigned: "Rana",
    priority: "Medium",
    notes: "Guest requested extra towels",
  },
  {
    id: "202",
    room: "202",
    type: "Deep Clean",
    status: "Pending",
    assigned: "Unassigned",
    priority: "High",
    notes: "Maintenance needed",
  },
];

export default function HousekeepingPage() {
  const router = useRouter();

  // states
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Task["status"]>(
    "all"
  );
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [openAssign, setOpenAssign] = useState<Task | null>(null);

  // derived
  const selectedIds = Object.keys(selected).filter((k) => selected[k]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      const hay = `${t.room} ${t.assigned} ${t.notes} ${t.type}`.toLowerCase();
      const matchesQ = q === "" ? true : hay.includes(q);
      const matchesStatus =
        statusFilter === "all" ? true : t.status === statusFilter;
      return matchesQ && matchesStatus;
    });
  }, [tasks, query, statusFilter]);

  // actions
  function toggleSelect(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  function bulkMarkCleaned() {
    if (selectedIds.length === 0) return;
    setTasks((prev) =>
      prev.map((t) =>
        selectedIds.includes(t.id) ? { ...t, status: "Cleaned" } : t
      )
    );
    setSelected({});
  }

  function handleAssign(taskId: string, cleaner: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, assigned: cleaner, status: "In Progress" } : t
      )
    );
    setOpenAssign(null);
  }

  function resetToPending(taskId: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "Pending" } : t))
    );
  }

  // small helper to style badge variants
  const badgeForStatus = (s: Task["status"]) => {
    switch (s) {
      case "Cleaned":
        return "secondary";
      case "In Progress":
        return undefined;
      case "Dirty":
      case "Pending":
      default:
        return undefined;
    }
  };

  return (
    <main className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Housekeeping</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage cleaning tasks, assign staff, track progress and keep rooms
            guest-ready.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Input
            placeholder="Search (room, staff, notes, type...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full md:w-72"
          />

          <Select
            onValueChange={(v) => setStatusFilter(v as any)}
            value={statusFilter}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Dirty">Dirty</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Cleaned">Cleaned</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={bulkMarkCleaned} disabled={selectedIds.length === 0}>
            Mark Cleaned ({selectedIds.length})
          </Button>
        </div>
      </div>

      {/* Layout */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Left: Task list */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{`Today's Tasks`}</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {filtered.map((t) => (
                  <article
                    key={t.id}
                    className="flex items-start justify-between gap-4 p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition"
                    aria-labelledby={`task-${t.id}-title`}
                  >
                    {/* Left: checkbox + room info */}
                    <div className="flex items-start gap-3 w-full min-w-0">
                      <input
                        aria-label={`Select task ${t.id}`}
                        type="checkbox"
                        checked={!!selected[t.id]}
                        onChange={() => toggleSelect(t.id)}
                        className="mt-1"
                      />

                      <div className="min-w-0 w-full">
                        <div className="flex items-center gap-2">
                          <h3
                            id={`task-${t.id}-title`}
                            className="font-semibold truncate"
                          >
                            Room {t.room}
                          </h3>
                          <Badge className="text-xs py-0.5 px-2">
                            {t.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {t.notes}
                        </p>
                      </div>
                    </div>

                    {/* Middle: staff + priority (hidden on xs) */}
                    <div className="hidden md:flex md:flex-col md:items-center md:justify-center md:min-w-[120px]">
                      <div className="text-sm font-medium">{t.assigned}</div>
                      <div className="text-xs text-muted-foreground">
                        Priority: {t.priority}
                      </div>
                    </div>

                    {/* Right: status & actions */}
                    <div className="flex flex-col items-end gap-2 min-w-[110px]">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded border ${
                          statusColors[t.status]
                        }`}
                      >
                        {t.status}
                      </span>

                      <div className="flex flex-col gap-2 w-full">
                        <Button size="sm" onClick={() => setOpenAssign(t)}>
                          Assign
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => resetToPending(t.id)}
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}

                {filtered.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    No tasks match your filters.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Overview + Staff summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Pending</span>
                  <span>
                    {tasks.filter((t) => t.status === "Pending").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Dirty</span>
                  <span>
                    {tasks.filter((t) => t.status === "Dirty").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>In Progress</span>
                  <span>
                    {tasks.filter((t) => t.status === "In Progress").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cleaned</span>
                  <span>
                    {tasks.filter((t) => t.status === "Cleaned").length}
                  </span>
                </div>
              </div>

              <Button
                className="mt-4 w-full"
                onClick={() => router.push("/housekeeping/schedule")}
              >
                Open Schedule
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Staff Summary</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-2 text-sm">
                {/* derive counts by assigned staff */}
                {Array.from(
                  tasks.reduce((map, t) => {
                    const key = t.assigned || "Unassigned";
                    map.set(key, (map.get(key) || 0) + 1);
                    return map;
                  }, new Map<string, number>())
                ).map(([staff, count]) => (
                  <div key={staff} className="flex justify-between">
                    <span>{staff}</span>
                    <span className="text-muted-foreground">
                      {count} task{count > 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => {
                    // example: mark all as Cleaned (demo only)
                    setTasks((prev) =>
                      prev.map((t) => ({ ...t, status: "Cleaned" }))
                    );
                  }}
                >
                  Mark all as Cleaned (demo)
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    // reset sample dataset
                    setTasks(SAMPLE_TASKS);
                    setSelected({});
                  }}
                >
                  Reset demo data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assign dialog */}
      <Dialog open={!!openAssign} onOpenChange={() => setOpenAssign(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Cleaner</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="text-sm">Task: Room {openAssign?.room}</div>

            <Select
              onValueChange={(v) => {
                if (openAssign) handleAssign(openAssign.id, v);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pick cleaner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Rana">Rana</SelectItem>
                <SelectItem value="Sadia">Sadia</SelectItem>
                <SelectItem value="Arif">Arif</SelectItem>
                <SelectItem value="Unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpenAssign(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
