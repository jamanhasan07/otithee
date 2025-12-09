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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


type Reservation = {
  id: string;
  guestName: string;
  room?: string; // assigned room number or undefined
  checkIn: string; // ISO date
  checkOut: string; // ISO date
  status: "Booked" | "Checked-in" | "Checked-out" | "No-show" | "Cancelled";
  rate: number;
  pax: number;
  source?: string; // OTA / Direct / Walk-in
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
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Reservation["status"]>("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "upcoming" | "past">("all");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [detail, setDetail] = useState<Reservation | null>(null);

  const selectedIds = Object.keys(selected).filter((k) => selected[k]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const now = new Date();
    return items.filter((r) => {
      const hay = `${r.id} ${r.guestName} ${r.room || ""} ${r.source || ""} ${r.notes || ""}`.toLowerCase();
      const matchesQ = q === "" ? true : hay.includes(q);
      const matchesStatus = statusFilter === "all" ? true : r.status === statusFilter;
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
      return matchesQ && matchesStatus && matchesDate;
    });
  }, [items, query, statusFilter, dateFilter]);

  // actions
  function toggleSelect(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  function bulkCancel() {
    if (selectedIds.length === 0) return;
    setItems((prev) => prev.map((p) => (selectedIds.includes(p.id) ? { ...p, status: "Cancelled" } : p)));
    setSelected({});
  }

  function checkIn(id: string) {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, status: "Checked-in", room: p.room ?? "TBD" } : p)));
    setDetail(null);
  }

  function checkOut(id: string) {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, status: "Checked-out" } : p)));
    setDetail(null);
  }

  function cancelReservation(id: string) {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, status: "Cancelled" } : p)));
    setDetail(null);
  }

  function assignRoom(id: string, roomNo?: string) {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, room: roomNo } : p)));
  }

  // derived summaries
  const totals = useMemo(() => {
    return {
      total: items.length,
      booked: items.filter((i) => i.status === "Booked").length,
      checkedIn: items.filter((i) => i.status === "Checked-in").length,
      checkedOut: items.filter((i) => i.status === "Checked-out").length,
    };
  }, [items]);

  return (
    <main className="">
      {/* Header */}
      <div className="mb-4 md:mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Reservations</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage bookings, check-ins, check-outs and room assignments.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search by guest, id, room..."
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
                <SelectItem value="Booked">Booked</SelectItem>
                <SelectItem value="Checked-in">Checked-in</SelectItem>
                <SelectItem value="Checked-out">Checked-out</SelectItem>
                <SelectItem value="No-show">No-show</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={(v) => setDateFilter(v as any)}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="past">Past</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={bulkCancel} disabled={selectedIds.length === 0}>Cancel selected ({selectedIds.length})</Button>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* list (spans 2 cols on md) */}
        <div className="md:col-span-2">
          <div className="space-y-4">
            {filtered.map((r) => (
              <article
                key={r.id}
                className="grid grid-cols-1 sm:grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_minmax(140px,180px)_minmax(120px,220px)] gap-3 items-start p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition min-h-[96px]"
                aria-labelledby={`res-${r.id}`}
              >
                {/* checkbox */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    checked={!!selected[r.id]}
                    onChange={() => toggleSelect(r.id)}
                    className="mt-1"
                    aria-label={`Select ${r.id}`}
                  />
                </div>

                {/* main content */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 id={`res-${r.id}`} className="font-semibold truncate">
                      {r.guestName}
                    </h3>

                    <span className="text-xs text-muted-foreground">• {r.source || "Direct"}</span>

                    <span className="ml-2 inline-flex items-center text-xs font-medium px-2 py-0.5 rounded border bg-slate-50 text-slate-800 border-slate-100">
                      {r.pax} pax
                    </span>

                    <span className={`ml-2 inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded border ${statusColors[r.status]}`}>
                      {r.status}
                    </span>
                  </div>

                  <div className="mt-1 text-sm text-muted-foreground truncate max-w-prose">
                    {r.notes ?? "—"}
                  </div>

                  <div className="mt-2 text-xs text-muted-foreground flex flex-wrap gap-3">
                    <div>Check-in: {new Date(r.checkIn).toLocaleString()}</div>
                    <div>Check-out: {new Date(r.checkOut).toLocaleString()}</div>
                    <div>Rate: ${r.rate}/nt</div>
                    <div>Res#: <span className="font-medium">{r.id}</span></div>
                  </div>
                </div>

                {/* room & dates (md column) */}
                <div className="hidden md:flex flex-col items-start md:items-center gap-2">
                  <div className="text-sm">Room</div>
                  <div className="text-lg font-semibold">{r.room ?? "Unassigned"}</div>
                </div>

                {/* actions */}
                <div className="flex flex-col items-end gap-2">
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    {r.status === "Booked" && (
                      <Button size="sm" className="w-full sm:w-auto" onClick={() => { setDetail(r); }}>View</Button>
                    )}
                    {r.status === "Booked" && (
                      <Button size="sm" variant="ghost" className="w-full sm:w-auto" onClick={() => checkIn(r.id)}>Check-in</Button>
                    )}
                    {r.status === "Checked-in" && (
                      <Button size="sm" className="w-full sm:w-auto" onClick={() => checkOut(r.id)}>Check-out</Button>
                    )}
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button size="sm" variant="outline" onClick={() => setDetail(r)}>Details</Button>
                    <Button size="sm" variant="ghost" onClick={() => cancelReservation(r.id)}>Cancel</Button>
                  </div>
                </div>
              </article>
            ))}

            {filtered.length === 0 && (
              <div className="text-sm text-muted-foreground">No reservations found.</div>
            )}
          </div>
        </div>

        {/* sidebar */}
        <aside className="md:sticky md:top-6">
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
              <CardContent>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between"><span>Total</span><span>{totals.total}</span></div>
                  <div className="flex justify-between"><span>Booked</span><span>{totals.booked}</span></div>
                  <div className="flex justify-between"><span>Checked-in</span><span>{totals.checkedIn}</span></div>
                  <div className="flex justify-between"><span>Checked-out</span><span>{totals.checkedOut}</span></div>
                </div>

                <Button className="mt-4 w-full" onClick={() => router.push("/reservations/calendar")}>Open calendar</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <Button onClick={() => { /* create reservation flow */ router.push("/reservations/new"); }}>New Reservation</Button>
                  <Button variant="ghost" onClick={() => { setItems(SAMPLE_RESERVATIONS); setSelected({}); }}>Reset demo</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>

      {/* detail dialog */}
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reservation Details</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold">{detail?.guestName}</h3>
              <div className="text-sm text-muted-foreground mt-1">Res#: {detail?.id}</div>

              <div className="mt-4 text-sm">
                <div><strong>Check-in:</strong> {detail && new Date(detail.checkIn).toLocaleString()}</div>
                <div><strong>Check-out:</strong> {detail && new Date(detail.checkOut).toLocaleString()}</div>
                <div><strong>Room:</strong> {detail?.room ?? "Unassigned"}</div>
                <div><strong>Rate:</strong> ${detail?.rate}/nt</div>
                <div className="mt-2"><strong>Notes:</strong><div className="text-muted-foreground mt-1">{detail?.notes ?? "—"}</div></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <Button onClick={() => { if (detail) { checkIn(detail.id); } }}>Check-in</Button>
                <Button variant="outline" onClick={() => { if (detail) { checkOut(detail.id); } }}>Check-out</Button>
                <Button variant="ghost" onClick={() => { if (detail) { cancelReservation(detail.id); } }}>Cancel Reservation</Button>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Assign Room</h4>
                <div className="flex gap-2">
                  <Input placeholder="Room no." className="flex-1" id="assign-room-input" />
                  <Button onClick={() => {
                    const el = document.getElementById("assign-room-input") as HTMLInputElement | null;
                    if (!el || !detail) return;
                    const val = el.value.trim();
                    if (!val) return;
                    assignRoom(detail.id, val);
                    el.value = "";
                    setDetail({ ...detail, room: val });
                  }}>Assign</Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
