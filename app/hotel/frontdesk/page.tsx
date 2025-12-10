"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

// ✅ shared table component
import {
  DataTableCard,
  DataTableColumn,
} from "@/app/components/DataTableCard"; // adjust path if needed

type Reservation = {
  id: string;
  guestName: string;
  status: "Booked" | "Arrived" | "Checked-out" | "No-show" | "Cancelled";
  room?: string;
  checkIn: string; // ISO
  checkOut: string; // ISO
  pax: number;
  source?: string;
  balance?: number;
  notes?: string;
};

const SAMPLE: Reservation[] = [
  {
    id: "R-1001",
    guestName: "John Doe",
    status: "Booked",
    room: undefined,
    checkIn: "2025-12-09T14:00:00Z",
    checkOut: "2025-12-12T12:00:00Z",
    pax: 2,
    source: "Direct",
    balance: 0,
    notes: "Anniversary",
  },
  {
    id: "R-1002",
    guestName: "Maria Silva",
    status: "Arrived",
    room: "101",
    checkIn: "2025-12-08T15:00:00Z",
    checkOut: "2025-12-11T11:00:00Z",
    pax: 3,
    source: "OTA",
    balance: 120.5,
    notes: "Late arrival",
  },
  {
    id: "R-1003",
    guestName: "Akira Tanaka",
    status: "Checked-out",
    room: "305",
    checkIn: "2025-12-07T14:00:00Z",
    checkOut: "2025-12-08T11:00:00Z",
    pax: 1,
    source: "Direct",
    balance: 0,
    notes: "Early departure",
  },
  {
    id: "R-1004",
    guestName: "Fatima Khan",
    status: "Booked",
    room: undefined,
    checkIn: "2025-12-10T14:00:00Z",
    checkOut: "2025-12-13T12:00:00Z",
    pax: 2,
    source: "Walk-in",
    balance: 0,
    notes: "Needs baby cot",
  },
];

const statusColors: Record<Reservation["status"], string> = {
  Booked: "bg-slate-50 text-slate-800 border-slate-100",
  Arrived: "bg-blue-50 text-blue-800 border-blue-100",
  "Checked-out": "bg-green-50 text-green-800 border-green-100",
  "No-show": "bg-red-50 text-red-800 border-red-100",
  Cancelled: "bg-orange-50 text-orange-800 border-orange-100",
};

export default function FrontDeskPage() {
  const router = useRouter();

  const [items, setItems] = useState<Reservation[]>(SAMPLE);
  const [statusFilter, setStatusFilter] = useState<
    "all" | Reservation["status"]
  >("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | string>("all");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [detail, setDetail] = useState<Reservation | null>(null);
  const [assignRoomOpenFor, setAssignRoomOpenFor] =
    useState<Reservation | null>(null);

  // Arrivals / departures (today)
  const arrivals = useMemo(
    () =>
      items.filter(
        (i) =>
          new Date(i.checkIn).toDateString() === new Date().toDateString(),
      ),
    [items],
  );

  const departures = useMemo(
    () =>
      items.filter(
        (i) =>
          new Date(i.checkOut).toDateString() === new Date().toDateString(),
      ),
    [items],
  );

  // Filter by status + source (text search handled by DataTableCard)
  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchesStatus =
        statusFilter === "all" ? true : i.status === statusFilter;
      const matchesSource =
        sourceFilter === "all" ? true : (i.source || "") === sourceFilter;
      return matchesStatus && matchesSource;
    });
  }, [items, statusFilter, sourceFilter]);

  const selectedIds = Object.keys(selected).filter((k) => selected[k]);
  const selectedCount = selectedIds.length;

  // actions
  function toggleSelect(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  function bulkCheckIn() {
    if (!selectedCount) return;
    setItems((prev) =>
      prev.map((p) =>
        selectedIds.includes(p.id)
          ? { ...p, status: "Arrived", room: p.room ?? "TBD" }
          : p,
      ),
    );
    setSelected({});
  }

  function bulkCancel() {
    if (!selectedCount) return;
    setItems((prev) =>
      prev.map((p) =>
        selectedIds.includes(p.id)
          ? { ...p, status: "Cancelled" }
          : p,
      ),
    );
    setSelected({});
  }

  function doCheckIn(id: string) {
    setItems((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: "Arrived", room: p.room ?? "TBD" }
          : p,
      ),
    );
    setDetail(null);
  }

  function doCheckOut(id: string) {
    setItems((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: "Checked-out" }
          : p,
      ),
    );
    setDetail(null);
  }

  function cancelReservation(id: string) {
    setItems((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: "Cancelled" }
          : p,
      ),
    );
    setDetail(null);
  }

  function assignRoom(id: string, roomNo?: string) {
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, room: roomNo } : p)),
    );
    setAssignRoomOpenFor(null);
    if (detail && detail.id === id) setDetail({ ...detail, room: roomNo });
  }

  // derived summary
  const summary = useMemo(
    () => ({
      total: items.length,
      booked: items.filter((i) => i.status === "Booked").length,
      arrived: items.filter((i) => i.status === "Arrived").length,
      checkedOut: items.filter((i) => i.status === "Checked-out").length,
    }),
    [items],
  );

  // helpers
  function initials(name = "") {
    return name
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  function formatCurrency(n = 0) {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(n);
  }

  // 👇 table columns for DataTableCard (same structure as other pages)
  const columns: DataTableColumn<Reservation>[] = [
    {
      id: "select",
      label: "",
      cell: (r) => (
        <input
          type="checkbox"
          aria-label={`Select ${r.id}`}
          checked={!!selected[r.id]}
          onChange={() => toggleSelect(r.id)}
          className="mt-0.5"
        />
      ),
    },
    {
      id: "status",
      label: "Status",
      searchable: (r) => r.status,
      cell: (r) => (
        <span
          className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded border ${statusColors[r.status]}`}
        >
          {r.status}
        </span>
      ),
    },
    {
      id: "guest",
      label: "Guest",
      searchable: (r) =>
        `${r.guestName} ${r.id} ${r.notes || ""}`.toLowerCase(),
      cell: (r) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 text-slate-800 text-xs font-medium flex-shrink-0">
            {initials(r.guestName)}
          </div>
          <div className="min-w-0">
            <div className="font-semibold truncate">{r.guestName}</div>
            <div className="text-[11px] text-muted-foreground truncate">
              {r.id} · {r.notes ?? r.source ?? "—"}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "room",
      label: "Room",
      searchable: (r) => r.room ?? "",
      cell: (r) => (
        <span className="text-sm font-medium">
          {r.room ?? "Unassigned"}
        </span>
      ),
    },
    {
      id: "dates",
      label: "Dates",
      searchable: (r) => `${r.checkIn} ${r.checkOut}`,
      cell: (r) => (
        <div className="text-xs">
          <div suppressHydrationWarning>
            In:{" "}
            {new Date(r.checkIn).toLocaleString("en-GB", {
              timeZone: "UTC",
            })}
          </div>
          <div className="text-muted-foreground" suppressHydrationWarning>
            Out:{" "}
            {new Date(r.checkOut).toLocaleString("en-GB", {
              timeZone: "UTC",
            })}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            {r.pax} pax
          </div>
        </div>
      ),
    },
    {
      id: "source",
      label: "Source",
      searchable: (r) => `${r.source || "Direct"}`,
      cell: (r) => (
        <span className="text-sm">{r.source ?? "Direct"}</span>
      ),
    },
    {
      id: "balance",
      label: "Balance",
      searchable: (r) => String(r.balance ?? 0),
      cell: (r) => (
        <span className="text-sm font-medium">
          {formatCurrency(r.balance ?? 0)}
        </span>
      ),
    },
  ];

  return (
    <main className="">
      {/* Header */}
      <div className="mb-4 md:mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Front Desk</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage arrivals, departures, room assignments and guest folios.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as any)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Booked">Booked</SelectItem>
              <SelectItem value="Arrived">Arrived</SelectItem>
              <SelectItem value="Checked-out">Checked-out</SelectItem>
              <SelectItem value="No-show">No-show</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sourceFilter}
            onValueChange={(v) => setSourceFilter(v as any)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sources</SelectItem>
              <SelectItem value="Direct">Direct</SelectItem>
              <SelectItem value="OTA">OTA</SelectItem>
              <SelectItem value="Walk-in">Walk-in</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => {
              alert("Sync with PMS (demo)");
            }}
          >
            Sync
          </Button>
        </div>
      </div>

      {/* Bulk actions summary row */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          {selectedCount > 0
            ? `${selectedCount} selected`
            : `${filtered.length} reservations`}
        </div>

        <div className="flex gap-2">
          <Button onClick={bulkCheckIn} disabled={selectedCount === 0}>
            Check-in selected
          </Button>
          <Button
            variant="ghost"
            onClick={bulkCancel}
            disabled={selectedCount === 0}
          >
            Cancel selected
          </Button>
          <Button variant="ghost" onClick={() => setSelected({})}>
            Clear selection
          </Button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-col gap-4">
        {/* LEFT: arrivals + departures + table */}
        <div className="md:col-span-2 space-y-4">
          {/* Quick cards: arrivals & departures */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Arrivals (Today)</CardTitle>
              </CardHeader>
              <CardContent>
                {arrivals.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    No arrivals today.
                  </div>
                )}
                <div className="space-y-2 mt-2">
                  {arrivals.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between gap-3 p-2 border rounded"
                    >
                      <div>
                        <div className="font-medium truncate">
                          {a.guestName}
                          <span className="text-xs text-muted-foreground">
                            {" "}
                            · {a.source || "Direct"}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Check-in:{" "}
                          {new Date(a.checkIn).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded border ${statusColors[a.status]}`}
                        >
                          {a.status}
                        </span>
                        <Button size="sm" onClick={() => setDetail(a)}>
                          Open
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Departures (Today)</CardTitle>
              </CardHeader>
              <CardContent>
                {departures.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    No departures today.
                  </div>
                )}
                <div className="space-y-2 mt-2">
                  {departures.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between gap-3 p-2 border rounded"
                    >
                      <div>
                        <div className="font-medium truncate">
                          {d.guestName}
                          <span className="text-xs text-muted-foreground">
                            {" "}
                            · {d.room ?? "Unassigned"}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Check-out:{" "}
                          {new Date(d.checkOut).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded border ${statusColors[d.status]}`}
                        >
                          {d.status}
                        </span>
                        <Button size="sm" onClick={() => setDetail(d)}>
                          Open
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ✅ Main table with shared design (search + columns + ellipsis actions) */}
          <DataTableCard
            data={filtered}
            columns={columns}
            searchPlaceholder="Search (guest, res#, room, notes...)"
            renderRowActions={(r) => (
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
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setDetail(r)}>
                    View details
                  </DropdownMenuItem>
                  {r.status === "Booked" && (
                    <DropdownMenuItem onClick={() => doCheckIn(r.id)}>
                      Check-in
                    </DropdownMenuItem>
                  )}
                  {r.status === "Arrived" && (
                    <DropdownMenuItem onClick={() => doCheckOut(r.id)}>
                      Check-out
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => setAssignRoomOpenFor(r)}
                  >
                    Assign room
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => cancelReservation(r.id)}
                  >
                    Cancel reservation
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          />
        </div>

        {/* SIDEBAR */}
        <aside className="grid grid-cols-1  lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Total reservations</span>
                  <span>{summary.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Booked</span>
                  <span>{summary.booked}</span>
                </div>
                <div className="flex justify-between">
                  <span>Arrived</span>
                  <span>{summary.arrived}</span>
                </div>
                <div className="flex justify-between">
                  <span>Checked-out</span>
                  <span>{summary.checkedOut}</span>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  className="w-full"
                  onClick={() => router.push("/reservations/new")}
                >
                  New reservation
                </Button>
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
                    setItems(SAMPLE);
                    setSelected({});
                  }}
                >
                  Reset demo
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => alert("Open calendar (demo)")}
                >
                  Open calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Details dialog */}
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reservation</DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="grid gap-4 md:grid-cols-2 p-2">
              <div>
                <h3 className="text-lg font-semibold">
                  {detail.guestName}
                </h3>
                <div className="text-sm text-muted-foreground mt-1">
                  Res#: {detail.id}
                </div>

                <div className="mt-4 text-sm space-y-2">
                  <div>
                    <strong>Room:</strong> {detail.room ?? "Unassigned"}
                  </div>
                  <div>
                    <strong>Check-in:</strong>{" "}
                    <span suppressHydrationWarning>
                      {new Date(detail.checkIn).toLocaleString("en-GB", {
                        timeZone: "UTC",
                      })}
                    </span>
                  </div>
                  <div>
                    <strong>Check-out:</strong>{" "}
                    <span suppressHydrationWarning>
                      {new Date(detail.checkOut).toLocaleString("en-GB", {
                        timeZone: "UTC",
                      })}
                    </span>
                  </div>
                  <div>
                    <strong>Pax:</strong> {detail.pax}
                  </div>
                  <div>
                    <strong>Source:</strong> {detail.source ?? "Direct"}
                  </div>
                  <div>
                    <strong>Balance:</strong>{" "}
                    {formatCurrency(detail.balance)}
                  </div>
                  <div className="mt-2">
                    <strong>Notes:</strong>
                    <div className="text-muted-foreground mt-1">
                      {detail.notes ?? "—"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col gap-2">
                  {detail.status === "Booked" && (
                    <Button onClick={() => doCheckIn(detail.id)}>
                      Check-in
                    </Button>
                  )}
                  {detail.status === "Arrived" && (
                    <Button
                      variant="outline"
                      onClick={() => doCheckOut(detail.id)}
                    >
                      Check-out
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => cancelReservation(detail.id)}
                  >
                    Cancel
                  </Button>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Assign room
                  </h4>
                  <div className="flex gap-2">
                    <Input
                      id="assign-room-frontdesk"
                      placeholder="Room no."
                      className="flex-1"
                    />
                    <Button
                      onClick={() => {
                        const el = document.getElementById(
                          "assign-room-frontdesk",
                        ) as HTMLInputElement | null;
                        if (!el) return;
                        const val = el.value.trim();
                        if (!val) return;
                        assignRoom(detail.id, val);
                        el.value = "";
                      }}
                    >
                      Assign
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Quick folio
                  </h4>
                  <div className="text-sm text-muted-foreground">
                    Charges and payments — (demo) open folio screen.
                  </div>
                  <div className="mt-2">
                    <Button
                      onClick={() =>
                        alert("Open folio (demo)")
                      }
                    >
                      Open folio
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Assign room dialog (small) */}
      <Dialog
        open={!!assignRoomOpenFor}
        onOpenChange={() => setAssignRoomOpenFor(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Room</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="text-sm">
              Reservation: {assignRoomOpenFor?.id} —{" "}
              {assignRoomOpenFor?.guestName}
            </div>
            <div className="flex gap-2">
              <Input
                id="assign-room-small"
                placeholder="Room no."
                className="flex-1"
              />
              <Button
                onClick={() => {
                  const el = document.getElementById(
                    "assign-room-small",
                  ) as HTMLInputElement | null;
                  if (!el || !assignRoomOpenFor) return;
                  const val = el.value.trim();
                  if (!val) return;
                  assignRoom(assignRoomOpenFor.id, val);
                  el.value = "";
                }}
              >
                Assign
              </Button>
            </div>
            <div className="flex justify-end">
              <Button
                variant="ghost"
                onClick={() => setAssignRoomOpenFor(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
