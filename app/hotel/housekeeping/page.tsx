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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, MoreHorizontal, SlidersHorizontal } from "lucide-react";

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

  // state
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Task["status"]>(
    "all",
  );
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [openAssign, setOpenAssign] = useState<Task | null>(null);

  // simple column visibility (like shadcn data table)
  const [visibleColumns, setVisibleColumns] = useState({
    room: true,
    type: true,
    status: true,
    priority: true,
    assigned: true,
    notes: true,
  });

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

  // small helper to style badge variants (you can still use if needed)
  const badgeForStatus = (s: Task["status"]) => {
    switch (s) {
      case "Cleaned":
        return "secondary";
      default:
        return undefined;
    }
  };

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

          <Button onClick={bulkMarkCleaned} disabled={selectedIds.length === 0}>
            Mark Cleaned ({selectedIds.length})
          </Button>
        </div>
      </div>

      {/* Layout */}
      <div className="flex flex-col gap-4">
        {/* LEFT: table (2 cols) */}
        <div className="">
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                {/* Filter input with small button (like screenshot) */}
                <div className="relative w-full sm:w-72">
                  <Input
                    placeholder="Search (room, staff, notes, type...)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                {/* Columns dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="inline-flex items-center gap-1"
                    >
                      Columns
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.room}
                      onCheckedChange={(v) =>
                        setVisibleColumns((c) => ({ ...c, room: !!v }))
                      }
                    >
                      Room
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.type}
                      onCheckedChange={(v) =>
                        setVisibleColumns((c) => ({ ...c, type: !!v }))
                      }
                    >
                      Type
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.status}
                      onCheckedChange={(v) =>
                        setVisibleColumns((c) => ({ ...c, status: !!v }))
                      }
                    >
                      Status
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.priority}
                      onCheckedChange={(v) =>
                        setVisibleColumns((c) => ({ ...c, priority: !!v }))
                      }
                    >
                      Priority
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.assigned}
                      onCheckedChange={(v) =>
                        setVisibleColumns((c) => ({ ...c, assigned: !!v }))
                      }
                    >
                      Assigned
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.notes}
                      onCheckedChange={(v) =>
                        setVisibleColumns((c) => ({ ...c, notes: !!v }))
                      }
                    >
                      Notes
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]" />
                      {visibleColumns.room && (
                        <TableHead className="w-[80px]">Room</TableHead>
                      )}
                      {visibleColumns.type && (
                        <TableHead className="w-[120px]">Type</TableHead>
                      )}
                      {visibleColumns.status && (
                        <TableHead className="w-[120px]">Status</TableHead>
                      )}
                      {visibleColumns.priority && (
                        <TableHead className="w-[120px]">Priority</TableHead>
                      )}
                      {visibleColumns.assigned && (
                        <TableHead className="w-[140px]">Assigned</TableHead>
                      )}
                      {visibleColumns.notes && (
                        <TableHead className="min-w-[220px]">Notes</TableHead>
                      )}
                      <TableHead className="w-[60px] text-right">
                        {/* actions */}
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filtered.map((t) => (
                      <TableRow key={t.id} className="align-top">
                        {/* checkbox */}
                        <TableCell className="align-top pt-4">
                          <input
                            aria-label={`Select task ${t.id}`}
                            type="checkbox"
                            checked={!!selected[t.id]}
                            onChange={() => toggleSelect(t.id)}
                            className="mt-1"
                          />
                        </TableCell>

                        {visibleColumns.room && (
                          <TableCell className="align-top pt-4">
                            <span className="font-medium">Room {t.room}</span>
                          </TableCell>
                        )}

                        {visibleColumns.type && (
                          <TableCell className="align-top pt-4">
                            <Badge className="text-xs py-0.5 px-2">
                              {t.type}
                            </Badge>
                          </TableCell>
                        )}

                        {visibleColumns.status && (
                          <TableCell className="align-top pt-4">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded border ${
                                statusColors[t.status]
                              }`}
                            >
                              {t.status}
                            </span>
                          </TableCell>
                        )}

                        {visibleColumns.priority && (
                          <TableCell className="align-top pt-4 text-sm">
                            {t.priority}
                          </TableCell>
                        )}

                        {visibleColumns.assigned && (
                          <TableCell className="align-top pt-4 text-sm">
                            <div className="font-medium">{t.assigned}</div>
                          </TableCell>
                        )}

                        {visibleColumns.notes && (
                          <TableCell className="align-top pt-4">
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {t.notes}
                            </p>
                          </TableCell>
                        )}

                        {/* Actions ellipsis menu */}
                        <TableCell className="align-top pt-3 text-right">
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
                              <DropdownMenuItem
                                onClick={() => setOpenAssign(t)}
                              >
                                Assign cleaner
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => resetToPending(t.id)}
                              >
                                Reset to pending
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => markCleaned(t.id)}
                              >
                                Mark cleaned
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}

                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6">
                          <span className="text-sm text-muted-foreground">
                            No tasks match your filters.
                          </span>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Overview + Staff summary + Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
