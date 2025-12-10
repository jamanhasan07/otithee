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

import {
  DataTableCard,
  DataTableColumn,
} from "@/app/components/DataTableCard"; // ⬅️ update path if needed

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

  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);
  const [statusFilter, setStatusFilter] = useState<"all" | Task["status"]>(
    "all",
  );
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [openAssign, setOpenAssign] = useState<Task | null>(null);

  // derived
  const selectedIds = Object.keys(selected).filter((k) => selected[k]);
  const selectedCount = selectedIds.length;

  const filtered = useMemo(() => {
    return tasks.filter((t) =>
      statusFilter === "all" ? true : t.status === statusFilter,
    );
  }, [tasks, statusFilter]);

  // actions
  function toggleSelect(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  function bulkMarkCleaned() {
    if (!selectedIds.length) return;
    setTasks((prev) =>
      prev.map((t) =>
        selectedIds.includes(t.id) ? { ...t, status: "Cleaned" } : t,
      ),
    );
    setSelected({});
  }

  function handleAssign(taskId: string, cleaner: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, assigned: cleaner, status: "In Progress" }
          : t,
      ),
    );
    setOpenAssign(null);
  }

  function resetToPending(taskId: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "Pending" } : t)),
    );
  }

  function markCleaned(taskId: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "Cleaned" } : t)),
    );
  }

  // table columns for the shared DataTableCard
  const columns: DataTableColumn<Task>[] = [
    {
      id: "select",
      label: "",

      cell: (t) => (
        <input
          aria-label={`Select task ${t.id}`}
          type="checkbox"
          checked={!!selected[t.id]}
          onChange={() => toggleSelect(t.id)}
          className="mt-0.5"
        />
      ),
    },
    {
      id: "room",
      label: "Room",
      searchable: (t) => t.room,
      cell: (t) => (
        <span className="font-medium text-sm">Room {t.room}</span>
      ),
    },
    {
      id: "type",
      label: "Type",
      searchable: (t) => t.type,
      cell: (t) => (
        <Badge className="text-xs py-0.5 px-2">{t.type}</Badge>
      ),
    },
    {
      id: "status",
      label: "Status",
      searchable: (t) => t.status,
      cell: (t) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded border ${statusColors[t.status]}`}
        >
          {t.status}
        </span>
      ),
    },
    {
      id: "priority",
      label: "Priority",
      searchable: (t) => t.priority,
      cell: (t) => <span className="text-sm">{t.priority}</span>,
    },
    {
      id: "assigned",
      label: "Assigned",
      searchable: (t) => t.assigned,
      cell: (t) => (
        <span className="text-sm font-medium">{t.assigned}</span>
      ),
    },
    {
      id: "notes",
      label: "Notes",
      searchable: (t) => t.notes,
      cell: (t) => (
        <p className="text-xs text-muted-foreground line-clamp-2">
          {t.notes}
        </p>
      ),
    },
  ];

  return (
    <main className="">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Housekeeping</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage cleaning tasks, assign staff, track progress and keep rooms
            guest-ready.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <Select
            onValueChange={(v) => setStatusFilter(v as any)}
            value={statusFilter}
          >
            <SelectTrigger className="w-40">
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

          <Button
            onClick={bulkMarkCleaned}
            disabled={selectedCount === 0}
          >
            Mark Cleaned ({selectedCount})
          </Button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-col gap-4">
        {/* Shared table card (search + columns + row actions) */}
        <DataTableCard<Task>
          data={filtered}
          columns={columns}
          searchPlaceholder="Search (room, staff, notes, type...)"
          renderRowActions={(t) => (
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
                <DropdownMenuItem onClick={() => setOpenAssign(t)}>
                  Assign cleaner
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => resetToPending(t.id)}
                >
                  Reset to pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => markCleaned(t.id)}>
                  Mark cleaned
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />

        {/* Overview / staff / quick actions row under the table */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                    {
                      tasks.filter((t) => t.status === "In Progress")
                        .length
                    }
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
                {Array.from(
                  tasks.reduce((map, t) => {
                    const key = t.assigned || "Unassigned";
                    map.set(key, (map.get(key) || 0) + 1);
                    return map;
                  }, new Map<string, number>()),
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
                    setTasks((prev) =>
                      prev.map((t) => ({ ...t, status: "Cleaned" })),
                    );
                  }}
                >
                  Mark all as Cleaned (demo)
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
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
