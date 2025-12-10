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
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | Maintenance["status"]
  >("all");
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | Maintenance["priority"]
  >("all");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [openAssign, setOpenAssign] = useState<Maintenance | null>(null);

  // simple column-visibility state like shadcn data-table
  const [visibleColumns, setVisibleColumns] = useState({
    status: true,
    room: true,
    issue: true,
    priority: true,
    assigned: true,
    reported: true,
  });

  const selectedIds = Object.keys(selected).filter((k) => selected[k]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      const hay = `${it.room} ${it.issue} ${it.assigned} ${
        it.notes || ""
      }`.toLowerCase();
      const matchesQ = q === "" ? true : hay.includes(q);
      const matchesStatus =
        statusFilter === "all" ? true : it.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" ? true : it.priority === priorityFilter;
      return matchesQ && matchesStatus && matchesPriority;
    });
  }, [items, query, statusFilter, priorityFilter]);

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

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
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

      {/* Main layout: left data-table, right sidebar */}
      <div className="flex flex-col gap-4">
        {/* LEFT: Data table */}
        <div className="">
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                {/* Filter input with icon button (like screenshot) */}
                <div className="relative w-full sm:w-72">
                  <Input
                    placeholder="Filter rooms, issues, technicians..."
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
                      className="ml-auto inline-flex items-center gap-1"
                    >
                      Columns
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.status}
                      onCheckedChange={(v) =>
                        setVisibleColumns((c) => ({
                          ...c,
                          status: !!v,
                        }))
                      }
                    >
                      Status
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.room}
                      onCheckedChange={(v) =>
                        setVisibleColumns((c) => ({
                          ...c,
                          room: !!v,
                        }))
                      }
                    >
                      Room
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.issue}
                      onCheckedChange={(v) =>
                        setVisibleColumns((c) => ({
                          ...c,
                          issue: !!v,
                        }))
                      }
                    >
                      Issue
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.priority}
                      onCheckedChange={(v) =>
                        setVisibleColumns((c) => ({
                          ...c,
                          priority: !!v,
                        }))
                      }
                    >
                      Priority
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.assigned}
                      onCheckedChange={(v) =>
                        setVisibleColumns((c) => ({
                          ...c,
                          assigned: !!v,
                        }))
                      }
                    >
                      Assigned
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.reported}
                      onCheckedChange={(v) =>
                        setVisibleColumns((c) => ({
                          ...c,
                          reported: !!v,
                        }))
                      }
                    >
                      Reported
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
                      {visibleColumns.status && (
                        <TableHead className="w-[120px]">Status</TableHead>
                      )}
                      {visibleColumns.room && (
                        <TableHead className="min-w-[80px]">Room</TableHead>
                      )}
                      {visibleColumns.issue && (
                        <TableHead className="min-w-[220px]">Issue</TableHead>
                      )}
                      {visibleColumns.priority && (
                        <TableHead className="w-[140px]">Priority</TableHead>
                      )}
                      {visibleColumns.assigned && (
                        <TableHead className="min-w-[120px]">
                          Assigned
                        </TableHead>
                      )}
                      {visibleColumns.reported && (
                        <TableHead className="min-w-[180px]">
                          Reported
                        </TableHead>
                      )}
                      <TableHead className="w-[60px] text-right">
                        {/* Actions */}
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filtered.map((it) => (
                      <TableRow key={it.id} className="align-top">
                        {/* checkbox */}
                        <TableCell className="align-top pt-4">
                          <input
                            type="checkbox"
                            aria-label={`Select ${it.id}`}
                            checked={!!selected[it.id]}
                            onChange={() => toggleSelect(it.id)}
                            className="mt-1"
                          />
                        </TableCell>

                        {visibleColumns.status && (
                          <TableCell className="align-top pt-4">
                            <span
                              className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded border ${statusStyles[it.status]}`}
                            >
                              {it.status}
                            </span>
                          </TableCell>
                        )}

                        {visibleColumns.room && (
                          <TableCell className="align-top pt-4">
                            Room {it.room}
                          </TableCell>
                        )}

                        {visibleColumns.issue && (
                          <TableCell className="align-top pt-4">
                            <div className="font-medium">{it.issue}</div>
                            {it.notes && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {it.notes}
                              </p>
                            )}
                          </TableCell>
                        )}

                        {visibleColumns.priority && (
                          <TableCell className="align-top pt-4">
                            <div className="flex flex-col gap-2">
                              <span
                                className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded border ${priorityStyles[it.priority]}`}
                              >
                                {it.priority}
                              </span>
                              <Select
                                value={it.priority}
                                onValueChange={(v) =>
                                  changePriority(it.id, v as any)
                                }
                              >
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Low">Low</SelectItem>
                                  <SelectItem value="Medium">
                                    Medium
                                  </SelectItem>
                                  <SelectItem value="High">High</SelectItem>
                                  <SelectItem value="Critical">
                                    Critical
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                        )}

                        {visibleColumns.assigned && (
                          <TableCell className="align-top pt-4 text-sm">
                            <div className="font-medium">{it.assigned}</div>
                          </TableCell>
                        )}

                        {visibleColumns.reported && (
                          <TableCell className="align-top pt-4 text-xs text-muted-foreground">
                            <span className="block text-[11px] uppercase tracking-wide mb-0.5">
                              Reported
                            </span>
                            <span suppressHydrationWarning>
                              {new Date(
                                it.reportedAt,
                              ).toLocaleString("en-GB", {
                                timeZone: "UTC",
                              })}
                            </span>
                          </TableCell>
                        )}

                        {/* Row actions menu (ellipsis) */}
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
                                onClick={() => setOpenAssign(it)}
                              >
                                Assign technician
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => reopen(it.id)}
                              >
                                Reopen
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => markResolved(it.id)}
                              >
                                Mark resolved
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
                            No requests match your filters.
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

        {/* RIGHT: sidebar (overview, technicians, quick actions) */}
        <aside className="">
          <div className="grid grid-cols-3 gap-4">
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
