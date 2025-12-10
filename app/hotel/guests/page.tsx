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
import { Badge } from "@/components/ui/badge";
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
} from "@/app/components/DataTableCard"; // ⬅️ adjust path if needed

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
  {
    id: "G-1001",
    name: "John Doe",
    room: "101",
    status: "Checked-in",
    vip: true,
    pax: 2,
    phone: "+8801712345678",
    email: "john@example.com",
    balance: 45.5,
    notes: "Allergic to peanuts",
    arrivedAt: "2025-12-08T15:10:00Z",
  },
  {
    id: "G-1002",
    name: "Maria Silva",
    room: "202",
    status: "Checked-in",
    vip: false,
    pax: 3,
    phone: "+8801798765432",
    email: "maria@example.com",
    balance: 0,
    notes: "Late arrival",
    arrivedAt: "2025-12-08T16:00:00Z",
  },
  {
    id: "G-1003",
    name: "Akira Tanaka",
    room: "305",
    status: "Checked-out",
    vip: false,
    pax: 1,
    phone: "+8801811122233",
    email: "akira@example.com",
    balance: 0,
    notes: "Paid in full",
    arrivedAt: "2025-12-07T14:00:00Z",
  },
  {
    id: "G-1004",
    name: "Fatima Khan",
    room: undefined,
    status: "Reservation",
    vip: false,
    pax: 2,
    phone: "+8801922334455",
    email: "fatima@example.com",
    balance: 0,
    notes: "Needs baby cot",
    arrivedAt: undefined,
  },
];

// Status pill styles
const statusPill: Record<Guest["status"], string> = {
  "Checked-in": "bg-blue-50 text-blue-800 border-blue-100",
  "Checked-out": "bg-green-50 text-green-800 border-green-100",
  "No-show": "bg-red-50 text-red-800 border-red-100",
  Reservation: "bg-slate-50 text-slate-800 border-slate-100",
};

export default function GuestsPage() {
  const router = useRouter();

  const [guests, setGuests] = useState<Guest[]>(SAMPLE_GUESTS);
  const [statusFilter, setStatusFilter] = useState<"all" | Guest["status"]>(
    "all",
  );
  const [vipFilter, setVipFilter] = useState<"all" | "vip" | "nonvip">("all");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [detail, setDetail] = useState<Guest | null>(null);

  const selectedIds = Object.keys(selected).filter((k) => selected[k]);
  const selectedCount = selectedIds.length;

  // filter (search handled inside DataTableCard)
  const filtered = useMemo(() => {
    return guests.filter((g) => {
      const matchesStatus =
        statusFilter === "all" ? true : g.status === statusFilter;
      const matchesVip =
        vipFilter === "all"
          ? true
          : vipFilter === "vip"
          ? !!g.vip
          : !g.vip;
      return matchesStatus && matchesVip;
    });
  }, [guests, statusFilter, vipFilter]);

  // helpers
  function toggleSelect(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }
  function clearSelection() {
    setSelected({});
  }
  function initials(name = "") {
    return name
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }
  function formatCurrency(n: number | undefined) {
    const value = n ?? 0;
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);
  }

  // bulk actions
  function bulkCheckOut() {
    if (!selectedIds.length) return;
    setGuests((prev) =>
      prev.map((g) =>
        selectedIds.includes(g.id)
          ? { ...g, status: "Checked-out" }
          : g,
      ),
    );
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
      [
        "id",
        "name",
        "room",
        "status",
        "vip",
        "pax",
        "phone",
        "email",
        "balance",
        "notes",
        "arrivedAt",
      ],
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
    const csv = rows
      .map((r) =>
        r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `guests_export_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // single-guest actions
  function checkOutGuest(id: string) {
    setGuests((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, status: "Checked-out" } : g,
      ),
    );
    if (detail?.id === id)
      setDetail({ ...detail, status: "Checked-out" });
  }

  function toggleVIP(id: string) {
    setGuests((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, vip: !g.vip } : g,
      ),
    );
    if (detail?.id === id) setDetail({ ...detail, vip: !detail.vip });
  }

  function assignRoom(guestId: string, roomNo?: string) {
    setGuests((prev) =>
      prev.map((g) => (g.id === guestId ? { ...g, room: roomNo } : g)),
    );
    if (detail?.id === guestId) setDetail({ ...detail, room: roomNo });
  }

  // table columns (same structure as your other pages)
  const columns: DataTableColumn<Guest>[] = [
    {
      id: "select",
      label: "",

      cell: (g) => (
        <input
          aria-label={`Select ${g.name}`}
          type="checkbox"
          checked={!!selected[g.id]}
          onChange={() => toggleSelect(g.id)}
          className="mt-0.5"
        />
      ),
    },
    {
      id: "guest",
      label: "Guest",
      searchable: (g) =>
        `${g.name} ${g.id} ${g.email ?? ""} ${g.phone ?? ""} ${
          g.notes ?? ""
        }`.toLowerCase(),
      cell: (g) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 text-slate-800 text-xs font-medium flex-shrink-0">
            {initials(g.name)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold truncate">{g.name}</span>
              {g.vip && (
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-800 border-yellow-100 text-[10px] px-1.5 py-0"
                >
                  VIP
                </Badge>
              )}
            </div>
            <div className="text-[11px] text-muted-foreground truncate">
              {g.notes ?? g.email ?? g.phone ?? "—"}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "room",
      label: "Room",
      searchable: (g) => g.room ?? "",
      cell: (g) => (
        <span className="text-sm font-medium">
          {g.room ?? "Unassigned"}
        </span>
      ),
    },
    {
      id: "status",
      label: "Status",
      searchable: (g) => g.status,
      cell: (g) => (
        <span
          className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded border ${statusPill[g.status]}`}
        >
          {g.status}
        </span>
      ),
    },
    {
      id: "arrival",
      label: "Arrival / Pax",
      searchable: (g) => `${g.arrivedAt ?? ""} ${g.pax}`,
      cell: (g) => (
        <div className="text-xs">
          <div suppressHydrationWarning>
            {g.arrivedAt
              ? new Date(g.arrivedAt).toLocaleString("en-GB", {
                  timeZone: "UTC",
                })
              : "—"}
          </div>
          <div className="text-[11px] text-muted-foreground">
            Pax: {g.pax}
          </div>
        </div>
      ),
    },
    {
      id: "contact",
      label: "Contact",
      searchable: (g) => `${g.email ?? ""} ${g.phone ?? ""}`,
      cell: (g) => (
        <div className="text-xs">
          <div>{g.email ?? "—"}</div>
          <div className="text-[11px] text-muted-foreground">
            {g.phone ?? "—"}
          </div>
        </div>
      ),
    },
    {
      id: "balance",
      label: "Balance",
      searchable: (g) => String(g.balance ?? 0),
      cell: (g) => (
        <span className="text-sm font-medium">
          {formatCurrency(g.balance)}
        </span>
      ),
    },
  ];

  // ---------- RENDER ----------
  return (
    <main className="">
      {/* header */}
      <div className="mb-4 md:mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Guests</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Dense PMS-style guest list with consistent table layout across
            modules.
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
              <SelectItem value="Checked-in">Checked-in</SelectItem>
              <SelectItem value="Checked-out">Checked-out</SelectItem>
              <SelectItem value="No-show">No-show</SelectItem>
              <SelectItem value="Reservation">Reservation</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={vipFilter}
            onValueChange={(v) => setVipFilter(v as any)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="VIP" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="nonvip">Non-VIP</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" onClick={exportCSV}>
            Export CSV
          </Button>
        </div>
      </div>

      {/* bulk actions row */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          {selectedCount > 0
            ? `${selectedCount} selected`
            : `${filtered.length} guests`}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => {
              if (!selectedCount) return;
              const txt = prompt(
                `Send message to ${selectedCount} selected guests:`,
              );
              if (!txt) return;
              bulkMessage(txt);
            }}
            disabled={selectedCount === 0}
          >
            Message
          </Button>
          <Button
            onClick={bulkCheckOut}
            disabled={selectedCount === 0}
          >
            Check-out
          </Button>
          <Button
            variant="ghost"
            onClick={clearSelection}
            disabled={selectedCount === 0}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Main table (shared design: search + columns dropdown + row actions) */}
      <DataTableCard
        data={filtered}
        columns={columns}
        searchPlaceholder="Search (guest, ID, room, contact, notes...)"
        renderRowActions={(g) => (
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
              <DropdownMenuItem onClick={() => setDetail(g)}>
                Open profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const txt = prompt(
                    `Message to ${g.name}:`,
                  );
                  if (!txt) return;
                  alert(`(demo) Message to ${g.name}:\n\n${txt}`);
                }}
              >
                Message
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toggleVIP(g.id)}
              >
                {g.vip ? "Remove VIP" : "Mark VIP"}
              </DropdownMenuItem>
              {g.status !== "Checked-out" && (
                <DropdownMenuItem
                  onClick={() => checkOutGuest(g.id)}
                >
                  Check-out
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      {/* Guest detail dialog */}
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Guest profile</DialogTitle>
          </DialogHeader>

          {detail && (
            <div className="grid gap-4 md:grid-cols-2 p-2">
              <div>
                <h3 className="text-lg font-semibold">
                  {detail.name}
                </h3>
                <div className="text-sm text-muted-foreground mt-1">
                  ID: {detail.id}
                </div>

                <div className="mt-4 text-sm space-y-2">
                  <div>
                    <strong>Room:</strong>{" "}
                    {detail.room ?? "Unassigned"}
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded border ${statusPill[detail.status]}`}
                    >
                      {detail.status}
                    </span>
                  </div>
                  <div>
                    <strong>Pax:</strong> {detail.pax}
                  </div>
                  <div>
                    <strong>Phone:</strong> {detail.phone ?? "—"}
                  </div>
                  <div>
                    <strong>Email:</strong> {detail.email ?? "—"}
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
                  {detail.status !== "Checked-out" && (
                    <Button
                      onClick={() => checkOutGuest(detail.id)}
                    >
                      Check-out
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      const note = prompt("Add note to guest:");
                      if (!note) return;
                      setGuests((prev) =>
                        prev.map((g) =>
                          g.id === detail.id
                            ? {
                                ...g,
                                notes: g.notes
                                  ? `${g.notes} | ${note}`
                                  : note,
                              }
                            : g,
                        ),
                      );
                      setDetail((d) =>
                        d
                          ? {
                              ...d,
                              notes: d.notes
                                ? `${d.notes} | ${note}`
                                : note,
                            }
                          : d,
                      );
                    }}
                  >
                    Add note
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => toggleVIP(detail.id)}
                  >
                    {detail.vip ? "Remove VIP" : "Mark VIP"}
                  </Button>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Assign room
                  </h4>
                  <div className="flex gap-2">
                    <Input
                      id="assign-room-guest"
                      placeholder="Room no."
                      className="flex-1"
                    />
                    <Button
                      onClick={() => {
                        const el = document.getElementById(
                          "assign-room-guest",
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
                    Quick message
                  </h4>
                  <textarea
                    id="guest-quick-message"
                    className="w-full h-24 p-2 border rounded text-sm"
                    placeholder="Type message..."
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const el = document.getElementById(
                          "guest-quick-message",
                        ) as HTMLTextAreaElement | null;
                        if (!el) return;
                        const txt = el.value.trim();
                        if (!txt) return;
                        alert(
                          `(demo) Message to ${detail.name}:\n\n${txt}`,
                        );
                        el.value = "";
                      }}
                    >
                      Send
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
