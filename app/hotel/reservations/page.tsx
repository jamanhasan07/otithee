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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";

// ✅ import reusable table
import {
  DataTableCard,
  DataTableColumn,
} from "@/app/components/DataTableCard"; // adjust path if needed

type Reservation = {
  id: string;
  guestName: string;
  room?: string;
  checkIn: string;
  checkOut: string;
  status: "Booked" | "Checked-in" | "Checked-out" | "No-show" | "Cancelled";
  rate: number;
  pax: number;
  source?: string;
  notes?: string;
};

const SAMPLE_RESERVATIONS: Reservation[] = [
  {
    id: "res-1001",
    guestName: "John Doe",
    room: "101",
    checkIn: "2025-12-12T14:00:00Z",
    checkOut: "2025-12-15T12:00:00Z",
    status: "Booked",
    rate: 150,
    pax: 2,
    source: "Direct",
    notes: "Anniversary",
  },
  {
    id: "res-1002",
    guestName: "Maria Silva",
    room: undefined,
    checkIn: "2025-12-09T15:00:00Z",
    checkOut: "2025-12-11T11:00:00Z",
    status: "Checked-in",
    rate: 200,
    pax: 3,
    source: "OTA",
    notes: "Late check-in",
  },
  {
    id: "res-1003",
    guestName: "Akira Tanaka",
    room: "305",
    checkIn: "2025-12-08T14:00:00Z",
    checkOut: "2025-12-09T11:00:00Z",
    status: "Checked-out",
    rate: 120,
    pax: 1,
    source: "Direct",
    notes: "Early departure",
  },
  {
    id: "res-1004",
    guestName: "Fatima Khan",
    room: undefined,
    checkIn: "2025-12-10T14:00:00Z",
    checkOut: "2025-12-13T12:00:00Z",
    status: "Booked",
    rate: 220,
    pax: 2,
    source: "Walk-in",
    notes: "Requires baby cot",
  },
];

const statusColors: Record<Reservation["status"], string> = {
  Booked: "bg-slate-50 text-slate-800 border-slate-100",
  "Checked-in": "bg-blue-50 text-blue-800 border-blue-100",
  "Checked-out": "bg-green-50 text-green-800 border-green-100",
  "No-show": "bg-red-50 text-red-800 border-red-100",
  Cancelled: "bg-orange-50 text-orange-800 border-orange-100",
};

export default function ReservationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Reservation[]>(SAMPLE_RESERVATIONS);
  const [statusFilter, setStatusFilter] = useState<
    "all" | Reservation["status"]
  >("all");
  const [dateFilter, setDateFilter] = useState<
    "all" | "today" | "upcoming" | "past"
  >("all");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [detail, setDetail] = useState<Reservation | null>(null);

  const selectedIds = Object.keys(selected).filter((k) => selected[k]);

  const filteredByStatusAndDate = useMemo(() => {
    const now = new Date();
    return items.filter((r) => {
      const matchesStatus =
        statusFilter === "all" ? true : r.status === statusFilter;
      let matchesDate = true;
      if (dateFilter === "today") {
        const ci = new Date(r.checkIn);
        const co = new Date(r.checkOut);
        matchesDate = ci <= now && co >= now;
      } else if (dateFilter === "upcoming") {
        matchesDate = new Date(r.checkIn) > now;
      } else if (dateFilter === "past") {
        matchesDate = new Date(r.checkOut) < now;
      }
      return matchesStatus && matchesDate;
    });
  }, [items, statusFilter, dateFilter]);

  // actions
  function toggleSelect(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  function bulkCancel() {
    if (selectedIds.length === 0) return;
    setItems((prev) =>
      prev.map((p) =>
        selectedIds.includes(p.id) ? { ...p, status: "Cancelled" } : p,
      ),
    );
    setSelected({});
  }

  function checkIn(id: string) {
    setItems((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "Checked-in", room: p.room ?? "TBD" } : p,
      ),
    );
    setDetail(null);
  }

  function checkOut(id: string) {
    setItems((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "Checked-out" } : p,
      ),
    );
    setDetail(null);
  }

  function cancelReservation(id: string) {
    setItems((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "Cancelled" } : p,
      ),
    );
    setDetail(null);
  }

  function assignRoom(id: string, roomNo?: string) {
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, room: roomNo } : p)),
    );
  }

  const totals = useMemo(
    () => ({
      total: items.length,
      booked: items.filter((i) => i.status === "Booked").length,
      checkedIn: items.filter((i) => i.status === "Checked-in").length,
      checkedOut: items.filter((i) => i.status === "Checked-out").length,
    }),
    [items],
  );

  // 👇 define columns for the reusable table
  const columns: DataTableColumn<Reservation>[] = [
    {
      id: "select",
      label: "",

      cell: (r) => (
        <input
          type="checkbox"
          checked={!!selected[r.id]}
          onChange={() => toggleSelect(r.id)}
          className="mt-0.5"
          aria-label={`Select ${r.id}`}
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
      searchable: (r) => `${r.guestName} ${r.id}`,
      cell: (r) => (
        <div>
          <div className="font-medium">{r.guestName}</div>
          <div className="text-[11px] text-muted-foreground">{r.id}</div>
        </div>
      ),
    },
    {
      id: "room",
      label: "Room",
      searchable: (r) => r.room ?? "",
      cell: (r) =>
        r.room ?? (
          <span className="text-xs text-muted-foreground">Unassigned</span>
        ),
    },
    {
      id: "checkIn",
      label: "Check-in",
      searchable: (r) => r.checkIn,
      cell: (r) => (
        <span className="text-xs" suppressHydrationWarning>
          {new Date(r.checkIn).toLocaleString("en-GB", { timeZone: "UTC" })}
        </span>
      ),
    },
    {
      id: "checkOut",
      label: "Check-out",
      searchable: (r) => r.checkOut,
      cell: (r) => (
        <span className="text-xs" suppressHydrationWarning>
          {new Date(r.checkOut).toLocaleString("en-GB", { timeZone: "UTC" })}
        </span>
      ),
    },
    {
      id: "rate",
      label: "Rate",
      searchable: (r) => String(r.rate),
      cell: (r) => <span className="text-sm">${r.rate}/nt</span>,
    },
    {
      id: "pax",
      label: "Pax",
      searchable: (r) => String(r.pax),
      cell: (r) => <span className="text-sm">{r.pax}</span>,
    },
    {
      id: "source",
      label: "Source",
      searchable: (r) => r.source || "",
      cell: (r) => <span className="text-sm">{r.source || "Direct"}</span>,
    },
    {
      id: "notes",
      label: "Notes",
      searchable: (r) => r.notes || "",
      cell: (r) => (
        <p className="text-xs text-muted-foreground line-clamp-2">
          {r.notes ?? "—"}
        </p>
      ),
    },
  ];

  return (
    <main className="">
      {/* Header filters */}
      <div className="mb-4 md:mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Reservations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage bookings, check-ins, check-outs and room assignments.
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
              <SelectItem value="Checked-in">Checked-in</SelectItem>
              <SelectItem value="Checked-out">Checked-out</SelectItem>
              <SelectItem value="No-show">No-show</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={dateFilter}
            onValueChange={(v) => setDateFilter(v as any)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All dates</SelectItem>
              <SelectItem value="today">Today (in house)</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="past">Past</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={bulkCancel} disabled={selectedIds.length === 0}>
            Cancel selected ({selectedIds.length})
          </Button>
        </div>
      </div>

      {/* Table + sidebar */}
      <div className="flex flex-col gap-4">
        {/* TABLE USING REUSABLE COMPONENT */}
        <DataTableCard
          data={filteredByStatusAndDate}
          columns={columns}
          searchPlaceholder="Search (guest, ID, room, source...)"
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
                  <DropdownMenuItem onClick={() => checkIn(r.id)}>
                    Check-in
                  </DropdownMenuItem>
                )}

                {r.status === "Checked-in" && (
                  <DropdownMenuItem onClick={() => checkOut(r.id)}>
                    Check-out
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={() => cancelReservation(r.id)}
                >
                  Cancel reservation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />

        {/* Sidebar summary + quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>{totals.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Booked</span>
                  <span>{totals.booked}</span>
                </div>
                <div className="flex justify-between">
                  <span>Checked-in</span>
                  <span>{totals.checkedIn}</span>
                </div>
                <div className="flex justify-between">
                  <span>Checked-out</span>
                  <span>{totals.checkedOut}</span>
                </div>
              </div>

              <Button
                className="mt-4 w-full"
                onClick={() => router.push("/reservations/calendar")}
              >
                Open calendar
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button onClick={() => router.push("/reservations/new")}>
                  New Reservation
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setItems(SAMPLE_RESERVATIONS);
                    setSelected({});
                  }}
                >
                  Reset demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detail dialog stays the same */}
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reservation Details</DialogTitle>
          </DialogHeader>

          {detail && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold">{detail.guestName}</h3>
                <div className="text-sm text-muted-foreground mt-1">
                  Res#: {detail.id}
                </div>

                <div className="mt-4 text-sm space-y-1">
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
                    <strong>Room:</strong> {detail.room ?? "Unassigned"}
                  </div>
                  <div>
                    <strong>Rate:</strong> ${detail.rate}/nt
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
                  <Button onClick={() => checkIn(detail.id)}>Check-in</Button>
                  <Button variant="outline" onClick={() => checkOut(detail.id)}>
                    Check-out
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => cancelReservation(detail.id)}
                  >
                    Cancel Reservation
                  </Button>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Assign Room</h4>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Room no."
                      className="flex-1"
                      id="assign-room-input"
                    />
                    <Button
                      onClick={() => {
                        const el = document.getElementById(
                          "assign-room-input",
                        ) as HTMLInputElement | null;
                        if (!el) return;
                        const val = el.value.trim();
                        if (!val) return;
                        assignRoom(detail.id, val);
                        el.value = "";
                        setDetail({ ...detail, room: val });
                      }}
                    >
                      Assign
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
