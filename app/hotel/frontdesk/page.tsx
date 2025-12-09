"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  { id: "R-1001", guestName: "John Doe", status: "Booked", room: undefined, checkIn: "2025-12-09T14:00:00Z", checkOut: "2025-12-12T12:00:00Z", pax: 2, source: "Direct", balance: 0, notes: "Anniversary" },
  { id: "R-1002", guestName: "Maria Silva", status: "Arrived", room: "101", checkIn: "2025-12-08T15:00:00Z", checkOut: "2025-12-11T11:00:00Z", pax: 3, source: "OTA", balance: 120.5, notes: "Late arrival" },
  { id: "R-1003", guestName: "Akira Tanaka", status: "Checked-out", room: "305", checkIn: "2025-12-07T14:00:00Z", checkOut: "2025-12-08T11:00:00Z", pax: 1, source: "Direct", balance: 0, notes: "Early departure" },
  { id: "R-1004", guestName: "Fatima Khan", status: "Booked", room: undefined, checkIn: "2025-12-10T14:00:00Z", checkOut: "2025-12-13T12:00:00Z", pax: 2, source: "Walk-in", balance: 0, notes: "Needs baby cot" },
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
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Reservation["status"]>("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | string>("all");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [detail, setDetail] = useState<Reservation | null>(null);
  const [assignRoomOpenFor, setAssignRoomOpenFor] = useState<Reservation | null>(null);

  // Pagination
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const arrivals = useMemo(
    () => items.filter(i => new Date(i.checkIn).toDateString() === new Date().toDateString()),
    [items]
  );

  const departures = useMemo(
    () => items.filter(i => new Date(i.checkOut).toDateString() === new Date().toDateString()),
    [items]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(i => {
      const hay = `${i.id} ${i.guestName} ${i.room || ""} ${i.source || ""} ${i.notes || ""}`.toLowerCase();
      const matchesQ = q === "" ? true : hay.includes(q);
      const matchesStatus = statusFilter === "all" ? true : i.status === statusFilter;
      const matchesSource = sourceFilter === "all" ? true : (i.source || "") === sourceFilter;
      return matchesQ && matchesStatus && matchesSource;
    });
  }, [items, query, statusFilter, sourceFilter]);

  // pagination slice
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageSafe = Math.min(Math.max(1, page), totalPages);
  const start = (pageSafe - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const pageItems = filtered.slice(start, end);

  // actions
  function toggleSelect(id: string) {
    setSelected(s => ({ ...s, [id]: !s[id] }));
  }
  function selectRangeOnPage(checked: boolean) {
    const newSel = { ...selected };
    pageItems.forEach(i => {
      newSel[i.id] = checked;
    });
    setSelected(newSel);
  }
  function bulkCheckIn() {
    const ids = Object.keys(selected).filter(k => selected[k]);
    if (!ids.length) return;
    setItems(prev => prev.map(p => ids.includes(p.id) ? { ...p, status: "Arrived", room: p.room ?? "TBD" } : p));
    setSelected({});
  }
  function bulkCancel() {
    const ids = Object.keys(selected).filter(k => selected[k]);
    if (!ids.length) return;
    setItems(prev => prev.map(p => ids.includes(p.id) ? { ...p, status: "Cancelled" } : p));
    setSelected({});
  }

  function doCheckIn(id: string) {
    setItems(prev => prev.map(p => p.id === id ? ({ ...p, status: "Arrived", room: p.room ?? "TBD" }) : p));
    setDetail(null);
  }
  function doCheckOut(id: string) {
    setItems(prev => prev.map(p => p.id === id ? ({ ...p, status: "Checked-out" }) : p));
    setDetail(null);
  }
  function cancelReservation(id: string) {
    setItems(prev => prev.map(p => p.id === id ? ({ ...p, status: "Cancelled" }) : p));
    setDetail(null);
  }
  function assignRoom(id: string, roomNo?: string) {
    setItems(prev => prev.map(p => p.id === id ? ({ ...p, room: roomNo }) : p));
    setAssignRoomOpenFor(null);
    if (detail && detail.id === id) setDetail({ ...detail, room: roomNo });
  }

  // derived summary
  const summary = useMemo(() => ({
    total: items.length,
    booked: items.filter(i => i.status === "Booked").length,
    arrived: items.filter(i => i.status === "Arrived").length,
    checkedOut: items.filter(i => i.status === "Checked-out").length,
  }), [items]);

  // helpers
  function initials(name = "") {
    return name.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();
  }
  function formatCurrency(n = 0) {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);
  }

  return (
    <main className="">
      {/* Header */}
      <div className="mb-4 md:mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Front Desk</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage arrivals, departures, room assignments and guest folios.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search guest, res#, room..."
            className="w-full sm:w-72"
            aria-label="Search reservations"
          />

          <div className="flex gap-2 items-center">
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as any); setPage(1); }}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Booked">Booked</SelectItem>
                <SelectItem value="Arrived">Arrived</SelectItem>
                <SelectItem value="Checked-out">Checked-out</SelectItem>
                <SelectItem value="No-show">No-show</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={(v) => { setSourceFilter(v as any); setPage(1); }}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Source" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Direct">Direct</SelectItem>
                <SelectItem value="OTA">OTA</SelectItem>
                <SelectItem value="Walk-in">Walk-in</SelectItem>
              </SelectContent>
            </Select>

            <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
              <SelectTrigger className="w-28"><SelectValue placeholder="Page size" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => { /* placeholder for integrations */ alert("Sync with PMS (demo)"); }}>Sync</Button>
          </div>
        </div>
      </div>

      {/* Controls / Bulk actions */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          {Object.keys(selected).filter(k => selected[k]).length > 0 ? (
            <span>{Object.keys(selected).filter(k => selected[k]).length} selected</span>
          ) : (
            <span>{filtered.length} reservations</span>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={bulkCheckIn} disabled={Object.keys(selected).filter(k => selected[k]).length === 0}>Check-in selected</Button>
          <Button variant="ghost" onClick={bulkCancel} disabled={Object.keys(selected).filter(k => selected[k]).length === 0}>Cancel selected</Button>
          <Button variant="outline" onClick={() => { selectRangeOnPage(true); }}>Select page</Button>
          <Button variant="ghost" onClick={() => { setSelected({}); }}>Clear</Button>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* LIST (spans 2 cols) */}
        <div className="md:col-span-2 space-y-4">
          {/* Quick cards: arrivals & departures */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle>Arrivals (Today)</CardTitle></CardHeader>
              <CardContent>
                {arrivals.length === 0 && <div className="text-sm text-muted-foreground">No arrivals today.</div>}
                <div className="space-y-2 mt-2">
                  {arrivals.map(a => (
                    <div key={a.id} className="flex items-center justify-between gap-3 p-2 border rounded">
                      <div>
                        <div className="font-medium truncate">{a.guestName} <span className="text-xs text-muted-foreground">• {a.source || "Direct"}</span></div>
                        <div className="text-xs text-muted-foreground">Check-in: {new Date(a.checkIn).toLocaleTimeString()}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded border ${statusColors[a.status]}`}>{a.status}</span>
                        <Button size="sm" onClick={() => setDetail(a)}>Open</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Departures (Today)</CardTitle></CardHeader>
              <CardContent>
                {departures.length === 0 && <div className="text-sm text-muted-foreground">No departures today.</div>}
                <div className="space-y-2 mt-2">
                  {departures.map(d => (
                    <div key={d.id} className="flex items-center justify-between gap-3 p-2 border rounded">
                      <div>
                        <div className="font-medium truncate">{d.guestName} <span className="text-xs text-muted-foreground">• {d.room ?? "Unassigned"}</span></div>
                        <div className="text-xs text-muted-foreground">Check-out: {new Date(d.checkOut).toLocaleTimeString()}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded border ${statusColors[d.status]}`}>{d.status}</span>
                        <Button size="sm" onClick={() => setDetail(d)}>Open</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table on desktop, cards on mobile */}
          <div className="space-y-4">
            {/* Desktop table */}
            <div className="hidden md:block">
              <table className="w-full table-fixed border-collapse bg-white rounded">
                <colgroup>
                  <col style={{ width: 36 }} />
                  <col style={{ width: "1fr" }} />
                  <col style={{ width: 120 }} />
                  <col style={{ width: 220 }} />
                  <col style={{ width: 180 }} />
                  <col style={{ width: 120 }} />
                  <col style={{ width: 180 }} />
                </colgroup>
                <thead className="text-sm text-muted-foreground">
                  <tr>
                    <th className="py-2 pl-2"><input aria-label="select page" type="checkbox" onChange={(e) => selectRangeOnPage(e.target.checked)} /></th>
                    <th className="text-left py-2">Guest</th>
                    <th className="text-left py-2">Room</th>
                    <th className="text-left py-2">Dates</th>
                    <th className="text-left py-2">Contact / Source</th>
                    <th className="text-right py-2 pr-2">Balance</th>
                    <th className="text-right py-2 pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map(r => (
                    <tr key={r.id} className="border-t">
                      <td className="py-3 pl-2 text-sm">
                        <input aria-label={`Select ${r.id}`} type="checkbox" checked={!!selected[r.id]} onChange={() => toggleSelect(r.id)} />
                      </td>

                      <td className="py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-800 font-medium flex-shrink-0">{initials(r.guestName)}</div>
                          <div className="min-w-0">
                            <div className="font-semibold truncate">{r.guestName}</div>
                            <div className="text-sm text-muted-foreground truncate">{r.notes ?? r.source ?? "—"}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 text-sm font-medium">{r.room ?? "Unassigned"}</td>

                      <td className="py-3 text-sm">
                        <div>{new Date(r.checkIn).toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground mt-1">→ {new Date(r.checkOut).toLocaleString()}</div>
                        <div className="mt-1"><span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded border ${statusColors[r.status]}`}>{r.status}</span></div>
                      </td>

                      <td className="py-3 text-sm">
                        <div>{r.source ?? "Direct"}</div>
                      </td>

                      <td className="py-3 text-right pr-2">
                        <div className="font-medium">{formatCurrency(r.balance ?? 0)}</div>
                      </td>

                      <td className="py-3 text-right pr-2">
                        <div className="flex justify-end gap-2">
                          {r.status === "Booked" && <Button size="sm" onClick={() => doCheckIn(r.id)}>Check-in</Button>}
                          {r.status === "Arrived" && <Button size="sm" onClick={() => doCheckOut(r.id)}>Check-out</Button>}
                          <Button size="sm" variant="ghost" onClick={() => setAssignRoomOpenFor(r)}>Assign</Button>
                          <Button size="sm" variant="outline" onClick={() => setDetail(r)}>Open</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile stacked cards */}
            <div className="md:hidden space-y-3">
              {pageItems.map(r => (
                <article key={r.id} className="p-3 border rounded-lg bg-white shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-800 font-medium">{initials(r.guestName)}</div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{r.guestName}</div>
                          <div className="text-sm text-muted-foreground truncate">{r.notes ?? r.source ?? "—"}</div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-semibold">{r.room ?? "Unassigned"}</div>
                          <div className="text-xs text-muted-foreground">{new Date(r.checkIn).toLocaleDateString()}</div>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <Button size="sm" className="col-span-2" onClick={() => setDetail(r)}>Open</Button>
                        <Button size="sm" variant="ghost" onClick={() => setAssignRoomOpenFor(r)}>Assign</Button>
                        <Button size="sm" variant="outline" className="col-span-3" onClick={() => doCheckOut(r.id)}>Check-out</Button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">Showing {start + 1}–{end} of {total} reservations</div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={pageSafe === 1}>Prev</Button>
              <div className="text-sm">Page {pageSafe} / {totalPages}</div>
              <Button variant="ghost" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={pageSafe === totalPages}>Next</Button>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="md:sticky md:top-6 space-y-4">
          <Card>
            <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between"><span>Total reservations</span><span>{summary.total}</span></div>
                <div className="flex justify-between"><span>Booked</span><span>{summary.booked}</span></div>
                <div className="flex justify-between"><span>Arrived</span><span>{summary.arrived}</span></div>
                <div className="flex justify-between"><span>Checked-out</span><span>{summary.checkedOut}</span></div>
              </div>

              <div className="mt-4">
                <Button className="w-full" onClick={() => router.push("/reservations/new")}>New reservation</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button onClick={() => { setItems(SAMPLE); setSelected({}); }}>Reset demo</Button>
                <Button variant="ghost" onClick={() => alert("Open calendar (demo)")}>Open calendar</Button>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Details dialog */}
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>Reservation</DialogTitle></DialogHeader>
          <div className="grid gap-4 md:grid-cols-2 p-2">
            <div>
              <h3 className="text-lg font-semibold">{detail?.guestName}</h3>
              <div className="text-sm text-muted-foreground mt-1">Res#: {detail?.id}</div>

              <div className="mt-4 text-sm space-y-2">
                <div><strong>Room:</strong> {detail?.room ?? "Unassigned"}</div>
                <div><strong>Check-in:</strong> {detail && new Date(detail.checkIn).toLocaleString()}</div>
                <div><strong>Check-out:</strong> {detail && new Date(detail.checkOut).toLocaleString()}</div>
                <div><strong>Pax:</strong> {detail?.pax}</div>
                <div><strong>Source:</strong> {detail?.source ?? "Direct"}</div>
                <div><strong>Balance:</strong> {formatCurrency(detail?.balance)}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                {detail?.status === "Booked" && <Button onClick={() => doCheckIn(detail.id)}>Check-in</Button>}
                {detail?.status === "Arrived" && <Button variant="outline" onClick={() => doCheckOut(detail.id)}>Check-out</Button>}
                <Button variant="ghost" onClick={() => detail && cancelReservation(detail.id)}>Cancel</Button>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Assign room</h4>
                <div className="flex gap-2">
                  <Input id="assign-room-frontdesk" placeholder="Room no." className="flex-1" />
                  <Button onClick={() => {
                    const el = document.getElementById("assign-room-frontdesk") as HTMLInputElement | null;
                    if (!el || !detail) return;
                    const val = el.value.trim(); if (!val) return;
                    assignRoom(detail.id, val); el.value = "";
                  }}>Assign</Button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Quick folio</h4>
                <div className="text-sm text-muted-foreground">Charges and payments — (demo) open folio screen.</div>
                <div className="mt-2"><Button onClick={() => alert("Open folio (demo)")}>Open folio</Button></div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign room dialog */}
      <Dialog open={!!assignRoomOpenFor} onOpenChange={() => setAssignRoomOpenFor(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Assign Room</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div className="text-sm">Reservation: {assignRoomOpenFor?.id} — {assignRoomOpenFor?.guestName}</div>
            <div className="flex gap-2">
              <Input id="assign-room-small" placeholder="Room no." className="flex-1" />
              <Button onClick={() => {
                const el = document.getElementById("assign-room-small") as HTMLInputElement | null;
                if (!el || !assignRoomOpenFor) return;
                const val = el.value.trim(); if (!val) return;
                assignRoom(assignRoomOpenFor.id, val); el.value = "";
              }}>Assign</Button>
            </div>
            <div className="flex justify-end"><Button variant="ghost" onClick={() => setAssignRoomOpenFor(null)}>Cancel</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
