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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

// ✅ reusable table
import {
  DataTableCard,
  DataTableColumn,
} from "@/app/components/DataTableCard"; // adjust path if needed

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
  {
    id: "m100",
    room: "101",
    issue: "Broken lamp",
    status: "Open",
    priority: "Low",
    assigned: "Unassigned",
    reportedAt: "2025-12-08T09:15:00Z",
    notes: "Guest reported during afternoon",
  },
  {
    id: "m101",
    room: "202",
    issue: "AC not cooling",
    status: "In Progress",
    priority: "High",
    assigned: "Rafiq",
    reportedAt: "2025-12-08T06:30:00Z",
    notes: "Refrigerant suspected",
  },
  {
    id: "m102",
    room: "305",
    issue: "Water leak (bathroom)",
    status: "Blocked",
    priority: "Critical",
    assigned: "Unassigned",
    reportedAt: "2025-12-07T23:20:00Z",
    notes: "Needs plumbing team",
  },
  {
    id: "m103",
    room: "110",
    issue: "Broken door latch",
    status: "Resolved",
    priority: "Medium",
    assigned: "Nadia",
    reportedAt: "2025-12-06T12:00:00Z",
    notes: "Fixed and tested",
  },
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
  const [statusFilter, setStatusFilter] = useState<
    "all" | Maintenance["status"]
  >("all");
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | Maintenance["priority"]
  >("all");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [openAssign, setOpenAssign] = useState<Maintenance | null>(null);

  const selectedIds = Object.keys(selected).filter((k) => selected[k]);

  // apply only status + priority filters here;
  // text search is handled inside DataTableCard
  const filtered = useMemo(() => {
    return items.filter((it) => {
      const matchesStatus =
        statusFilter === "all" ? true : it.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" ? true : it.priority === priorityFilter;
      return matchesStatus && matchesPriority;
    });
  }, [items, statusFilter, priorityFilter]);

  function toggleSelect(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  function bulkResolve() {
    if (selectedIds.length === 0) return;
    setItems((prev) =>
      prev.map((it) =>
        selectedIds.includes(it.id) ? { ...it, status: "Resolved" } : it,
      ),
    );
    setSelected({});
  }

  function assignTech(id: string, tech: string) {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, assigned: tech, status: "In Progress" } : it,
      ),
    );
    setOpenAssign(null);
  }

  function reopen(id: string) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: "Open" } : it)),
    );
  }

  function markResolved(id: string) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: "Resolved" } : it)),
    );
  }

  function changePriority(id: string, p: Maintenance["priority"]) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, priority: p } : it)),
    );
  }

  const staffSummary = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((it) =>
      map.set(
        it.assigned || "Unassigned",
        (map.get(it.assigned || "Unassigned") || 0) + 1,
      ),
    );
    return Array.from(map.entries());
  }, [items]);

  // 👇 Columns config for DataTableCard (same layout style as reservations/housekeeping)
  const columns: DataTableColumn<Maintenance>[] = [
    {
      id: "select",
      label: "",
  
      cell: (it) => (
        <input
          type="checkbox"
          aria-label={`Select ${it.id}`}
          checked={!!selected[it.id]}
          onChange={() => toggleSelect(it.id)}
          className="mt-0.5"
        />
      ),
    },
    {
      id: "status",
      label: "Status",
      searchable: (it) => it.status,
      cell: (it) => (
        <span
          className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded border ${statusStyles[it.status]}`}
        >
          {it.status}
        </span>
      ),
    },
    {
      id: "room",
      label: "Room",
      searchable: (it) => it.room,
      cell: (it) => <span>Room {it.room}</span>,
    },
    {
      id: "issue",
      label: "Issue",
      searchable: (it) => `${it.issue} ${it.notes || ""}`,
      cell: (it) => (
        <div>
          <div className="font-medium">{it.issue}</div>
          {it.notes && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {it.notes}
            </p>
          )}
        </div>
      ),
    },
    {
      id: "priority",
      label: "Priority",
      searchable: (it) => it.priority,
      cell: (it) => (
        <div className="flex flex-col gap-2">
          <span
            className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded border ${priorityStyles[it.priority]}`}
          >
            {it.priority}
          </span>
          <Select
            value={it.priority}
            onValueChange={(v) => changePriority(it.id, v as any)}
          >
            <SelectTrigger className="h-8 text-xs">
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
      ),
    },
    {
      id: "assigned",
      label: "Assigned",
      searchable: (it) => it.assigned,
      cell: (it) => <div className="font-medium">{it.assigned}</div>,
    },
    {
      id: "reported",
      label: "Reported",
      searchable: (it) => it.reportedAt,
      cell: (it) => (
        <span
          className="text-xs text-muted-foreground"
          suppressHydrationWarning
        >
          {new Date(it.reportedAt).toLocaleString("en-GB", {
            timeZone: "UTC",
          })}
        </span>
      ),
    },
  ];

  return (
    <main className="">
      {/* Top heading + filters (status / priority / bulk) */}
      <div className="mb-4 md:mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Maintenance</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track and manage maintenance requests across the property.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto md:justify-end">
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as any)}
          >
            <SelectTrigger className="w-32">
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

          <Select
            value={priorityFilter}
            onValueChange={(v) => setPriorityFilter(v as any)}
          >
            <SelectTrigger className="w-32">
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

          <Button
            onClick={bulkResolve}
            disabled={selectedIds.length === 0}
            className="whitespace-nowrap"
          >
            Resolve selected ({selectedIds.length})
          </Button>
        </div>
      </div>

      {/* Main layout: table + sidebar */}
      <div className="flex flex-col gap-4">
        {/* LEFT: reusable data table */}
        <DataTableCard
          data={filtered}
          columns={columns}
          searchPlaceholder="Filter rooms, issues, technicians..."
          renderRowActions={(it) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setOpenAssign(it)}>
                  Assign technician
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => reopen(it.id)}>
                  Reopen
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => markResolved(it.id)}>
                  Mark resolved
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />

        {/* RIGHT: sidebar (overview, technicians, quick actions) */}
        <aside className="">
          <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Open</span>
                    <span>
                      {items.filter((i) => i.status === "Open").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>In Progress</span>
                    <span>
                      {
                        items.filter((i) => i.status === "In Progress")
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Blocked</span>
                    <span>
                      {items.filter((i) => i.status === "Blocked").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resolved</span>
                    <span>
                      {items.filter((i) => i.status === "Resolved").length}
                    </span>
                  </div>
                </div>

                <Button
                  className="mt-4 w-full"
                  onClick={() => router.push("/maintenance/schedule")}
                >
                  Open Maintenance Schedule
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technicians</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {staffSummary.map(([tech, count]) => (
                    <div key={tech} className="flex justify-between">
                      <span>{tech}</span>
                      <span className="text-muted-foreground">
                        {count} task{count > 1 ? "s" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="flex justify-between">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 justify-center">
                  <Button
                    onClick={() =>
                      setItems((prev) =>
                        prev.map((it) => ({ ...it, status: "Resolved" })),
                      )
                    }
                  >
                    Resolve all (demo)
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setItems(SAMPLE);
                      setSelected({});
                    }}
                  >
                    Reset demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>

      {/* Assign dialog */}
      <Dialog open={!!openAssign} onOpenChange={() => setOpenAssign(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Technician</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="text-sm">
              Request: Room {openAssign?.room} — {openAssign?.issue}
            </div>
            <Select
              onValueChange={(v) =>
                openAssign && assignTech(openAssign.id, v as any)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pick technician" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Rafiq">Rafiq</SelectItem>
                <SelectItem value="Nadia">Nadia</SelectItem>
                <SelectItem value="Rafi">Rafi</SelectItem>
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
