"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Guest = {
  id: string;
  name: string;
  room?: string;
  status: "Checked-in" | "Checked-out" | "No-show" | "Reservation";
  vip?: boolean;
  pax: number;
  phone?: string;
  email?: string;
  balance?: number;
  notes?: string;
  arrivedAt?: string; // ISO
};

const SAMPLE_GUESTS: Guest[] = [
  { id: "G-1001", name: "John Doe", room: "101", status: "Checked-in", vip: true, pax: 2, phone: "+8801712345678", email: "john@example.com", balance: 45.5, notes: "Allergic to peanuts", arrivedAt: "2025-12-08T15:10:00Z" },
  { id: "G-1002", name: "Maria Silva", room: "202", status: "Checked-in", vip: false, pax: 3, phone: "+8801798765432", email: "maria@example.com", balance: 0, notes: "Late arrival", arrivedAt: "2025-12-08T16:00:00Z" },
  { id: "G-1003", name: "Akira Tanaka", room: "305", status: "Checked-out", vip: false, pax: 1, phone: "+8801811122233", email: "akira@example.com", balance: 0, notes: "Paid in full", arrivedAt: "2025-12-07T14:00:00Z" },
  { id: "G-1004", name: "Fatima Khan", room: undefined, status: "Reservation", vip: false, pax: 2, phone: "+8801922334455", email: "fatima@example.com", balance: 0, notes: "Needs baby cot", arrivedAt: undefined },
];

// Styles used for status and VIP -- consistent with hotel PMS color language
const statusPill: Record<Guest["status"], string> = {
  "Checked-in": "bg-blue-50 text-blue-800 border-blue-100",
  "Checked-out": "bg-green-50 text-green-800 border-green-100",
  "No-show": "bg-red-50 text-red-800 border-red-100",
  Reservation: "bg-slate-50 text-slate-800 border-slate-100",
};

export default function GuestsPage() {
  const router = useRouter();

  // Core data state (replace with remote fetch for production)
  const [guests, setGuests] = useState<Guest[]>(SAMPLE_GUESTS);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Guest["status"]>("all");
  const [vipFilter, setVipFilter] = useState<"all" | "vip" | "nonvip">("all");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [detail, setDetail] = useState<Guest | null>(null);
  // pagination
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  // derived helpers
  const selectedIds = Object.keys(selected).filter((k) => selected[k]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return guests.filter((g) => {
      const hay = `${g.id} ${g.name} ${g.room ?? ""} ${g.email ?? ""} ${g.phone ?? ""} ${g.notes ?? ""}`.toLowerCase();
      const matchesQ = q === "" ? true : hay.includes(q);
      const matchesStatus = statusFilter === "all" ? true : g.status === statusFilter;
      const matchesVip = vipFilter === "all" ? true : (vipFilter === "vip" ? !!g.vip : !g.vip);
      return matchesQ && matchesStatus && matchesVip;
    });
  }, [guests, query, statusFilter, vipFilter]);

  // pagination window
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageSafe = Math.min(Math.max(1, page), totalPages);
  const start = (pageSafe - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = filtered.slice(start, end);

  // small helpers
  function toggleSelect(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }
  function clearSelection() {
    setSelected({});
  }
  function initials(name = "") {
    return name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  }
  function formatCurrency(n = 0) {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);
  }

  // bulk actions
  function bulkCheckOut() {
    if (!selectedIds.length) return;
    setGuests((prev) => prev.map((g) => (selectedIds.includes(g.id) ? { ...g, status: "Checked-out" } : g)));
    clearSelection();
  }
  function bulkMessage(text: string) {
    if (!selectedIds.length) return;
    // integrate real messaging API here
    alert(`Sending message to ${selectedIds.length} guest(s):\n\n${text}`);
    clearSelection();
  }
  function exportCSV() {
    const rows = [
      ["id", "name", "room", "status", "vip", "pax", "phone", "email", "balance", "notes", "arrivedAt"],
      ...filtered.map((g) => [
        g.id,
        g.name,
        g.room ?? "",
        g.status,
        g.vip ? "yes" : "no",
        String(g.pax),
        g.phone ?? "",
        g.email ?? "",
        String(g.balance ?? 0),
        (g.notes ?? "").replace(/\n/g, " "),
        g.arrivedAt ?? "",
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `guests_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // single-guest actions
  function checkOutGuest(id: string) {
    setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, status: "Checked-out" } : g)));
    if (detail?.id === id) setDetail({ ...detail, status: "Checked-out" });
  }
  function toggleVIP(id: string) {
    setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, vip: !g.vip } : g)));
    if (detail?.id === id) setDetail({ ...detail, vip: !detail.vip });
  }
  function assignRoom(guestId: string, roomNo?: string) {
    setGuests((prev) => prev.map((g) => (g.id === guestId ? { ...g, room: roomNo } : g)));
    if (detail?.id === guestId) setDetail({ ...detail, room: roomNo });
  }

  // ---------- RENDER ----------
  return (
    <main className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* header */}
      <div className="mb-4 md:mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Guests</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Follow top hotel PMS conventions: dense table on desktop, touch-friendly cards on mobile.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search guest, res#, room, phone, email..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-80"
            aria-label="Search guests"
          />

          <div className="flex gap-2 items-center">
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as any); setPage(1); }}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Checked-in">Checked-in</SelectItem>
                <SelectItem value="Checked-out">Checked-out</SelectItem>
                <SelectItem value="No-show">No-show</SelectItem>
                <SelectItem value="Reservation">Reservation</SelectItem>
              </SelectContent>
            </Select>

            <Select value={vipFilter} onValueChange={(v) => { setVipFilter(v as any); setPage(1); }}>
              <SelectTrigger className="w-32"><SelectValue placeholder="VIP" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="nonvip">Non-VIP</SelectItem>
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

            <Button onClick={exportCSV} variant="ghost">Export</Button>
          </div>
        </div>
      </div>

      {/* bulk action row */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          {selectedIds.length > 0 ? <span>{selectedIds.length} selected</span> : <span>{filtered.length} guests</span>}
        </div>

        <div className="flex gap-2">
          <Button onClick={() => { if (selectedIds.length === 0) return; setMessageOpenBulk(selectedIds.length); }} disabled={selectedIds.length === 0}>Message</Button>
          <Button onClick={bulkCheckOut} disabled={selectedIds.length === 0}>Check-out</Button>
          <Button variant="ghost" onClick={() => clearSelection()} disabled={selectedIds.length === 0}>Clear</Button>
        </div>
      </div>

      {/* Responsive list: table on md+, cards on sm */}
      <div className="space-y-4">
        {/* Desktop table */}
        <div className="hidden md:block">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col style={{ width: "36px" }} />
              <col style={{ width: "1fr" }} />
              <col style={{ width: "120px" }} />
              <col style={{ width: "180px" }} />
              <col style={{ width: "160px" }} />
              <col style={{ width: "120px" }} />
            </colgroup>

            <thead>
              <tr className="text-sm text-muted-foreground">
                <th className="text-left py-2 pl-2"><input aria-label="select all" type="checkbox" onChange={(e) => {
                  const checked = e.target.checked;
                  const slice = filtered.slice(start, end);
                  const newSel = { ...selected };
                  slice.forEach(g => { newSel[g.id] = checked; });
                  setSelected(newSel);
                }} /></th>
                <th className="text-left py-2">Guest</th>
                <th className="text-left py-2">Room</th>
                <th className="text-left py-2">Arrival</th>
                <th className="text-left py-2">Contact</th>
                <th className="text-right py-2 pr-2">Balance</th>
                <th className="text-right py-2 pr-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {pageItems.map((g) => (
                <tr key={g.id} className="align-top border-t">
                  <td className="py-3 pl-2 text-sm">
                    <input aria-label={`Select ${g.name}`} type="checkbox" checked={!!selected[g.id]} onChange={() => toggleSelect(g.id)} />
                  </td>

                  <td className="py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-800 font-medium flex-shrink-0">
                        {initials(g.name)}
                      </div>

                      <div className="min-w-0">
                        <div className="font-semibold truncate">{g.name} {g.vip && <span className="ml-2 inline-flex items-center text-xs font-medium px-2 py-0.5 rounded border bg-yellow-50 text-yellow-800 border-yellow-100">VIP</span>}</div>
                        <div className="text-sm text-muted-foreground truncate">{g.notes ?? g.email ?? g.phone ?? "—"}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3">
                    <div className="text-sm font-medium">{g.room ?? "Unassigned"}</div>
                  </td>

                  <td className="py-3">
                    <div className="text-sm">{g.arrivedAt ? new Date(g.arrivedAt).toLocaleString() : "—"}</div>
                    <div className="text-xs text-muted-foreground">Pax: {g.pax}</div>
                    <div className="mt-1"><span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded border ${statusPill[g.status]}`}>{g.status}</span></div>
                  </td>

                  <td className="py-3">
                    <div className="text-sm">{g.email ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">{g.phone ?? "—"}</div>
                  </td>

                  <td className="py-3 text-right pr-2">
                    <div className="font-medium">{formatCurrency(g.balance)}</div>
                  </td>

                  <td className="py-3 text-right pr-2">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" onClick={() => setDetail(g)}>Open</Button>
                      <Button size="sm" variant="ghost" onClick={() => { setDetail(g); /* open quick message? */ }}>Message</Button>
                      <Button size="sm" variant="outline" onClick={() => checkOutGuest(g.id)}>Check-out</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked cards */}
        <div className="md:hidden space-y-3">
          {pageItems.map((g) => (
            <article key={g.id} className="p-3 border rounded-lg bg-white shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-800 font-medium">
                  {initials(g.name)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{g.name} {g.vip && <span className="ml-2 inline-flex items-center text-xs font-medium px-2 py-0.5 rounded border bg-yellow-50 text-yellow-800 border-yellow-100">VIP</span>}</div>
                      <div className="text-sm text-muted-foreground truncate">{g.email ?? g.phone ?? "—"}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-medium">{g.room ?? "Unassigned"}</div>
                      <div className="text-xs text-muted-foreground">{g.arrivedAt ? new Date(g.arrivedAt).toLocaleString() : "—"}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => setDetail(g)}>Open</Button>
                    <Button size="sm" variant="ghost" className="flex-1" onClick={() => { setDetail(g); /* open message modal */ }}>Message</Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => checkOutGuest(g.id)}>Check-out</Button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Pagination footer */}
      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">Showing {start + 1}–{Math.min(end, total)} of {total} guests</div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={pageSafe === 1}>Prev</Button>
          <div className="text-sm">Page {pageSafe} / {totalPages}</div>
          <Button variant="ghost" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={pageSafe === totalPages}>Next</Button>
        </div>
      </div>

      {/* Guest detail dialog */}
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>Guest profile</DialogTitle></DialogHeader>

          <div className="grid gap-4 md:grid-cols-2 p-2">
            <div>
              <h3 className="text-lg font-semibold">{detail?.name}</h3>
              <div className="text-sm text-muted-foreground mt-1">ID: {detail?.id}</div>

              <div className="mt-4 text-sm space-y-2">
                <div><strong>Room:</strong> {detail?.room ?? "Unassigned"}</div>
                <div><strong>Status:</strong> <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded border ${detail ? statusPill[detail.status] : ""}`}>{detail?.status}</span></div>
                <div><strong>Pax:</strong> {detail?.pax}</div>
                <div><strong>Phone:</strong> {detail?.phone ?? "—"}</div>
                <div><strong>Email:</strong> {detail?.email ?? "—"}</div>
                <div><strong>Balance:</strong> {formatCurrency(detail?.balance)}</div>
                <div className="mt-2"><strong>Notes:</strong><div className="text-muted-foreground mt-1">{detail?.notes ?? "—"}</div></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                {detail?.status !== "Checked-out" && <Button onClick={() => detail && checkOutGuest(detail.id)}>Check-out</Button>}
                <Button variant="outline" onClick={() => {
                  if (!detail) return;
                  const note = prompt("Add note to guest:");
                  if (note) setGuests(prev => prev.map(g => g.id === detail.id ? { ...g, notes: (g.notes ? g.notes + " | " : "") + note } : g));
                }}>Add note</Button>
                <Button variant="ghost" onClick={() => detail && toggleVIP(detail.id)}>{detail?.vip ? "Remove VIP" : "Mark VIP"}</Button>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Assign room</h4>
                <div className="flex gap-2">
                  <Input id="assign-room-guest" placeholder="Room no." className="flex-1" />
                  <Button onClick={() => {
                    const el = document.getElementById("assign-room-guest") as HTMLInputElement | null;
                    if (!el || !detail) return;
                    const val = el.value.trim(); if (!val) return;
                    assignRoom(detail.id, val); el.value = "";
                  }}>Assign</Button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Quick message</h4>
                <textarea id="guest-quick-message" className="w-full h-24 p-2 border rounded" placeholder="Type message..." />
                <div className="flex justify-end gap-2 mt-2">
                  <Button variant="ghost" onClick={() => { const el = document.getElementById("guest-quick-message") as HTMLTextAreaElement | null; if (!el || !detail) return; const txt = el.value.trim(); if (!txt) return; alert(`Message to ${detail.name}: ${txt}`); el.value = ""; }}>Send</Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

// NOTE: small UI helper used above to open bulk message -- kept local
function setMessageOpenBulk(count: number) {
  const txt = prompt(`Send message to ${count} selected guests:`);
  if (!txt) return;
  alert(`(demo) Message sent to ${count} guests:\n\n${txt}`);
}
