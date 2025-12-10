"use client";

import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, MoreHorizontal, SlidersHorizontal } from "lucide-react";

export type DataTableColumn<T> = {
  id: string;
  label: string;
  /** for search text */
  searchable?: (row: T) => string;
  /** how to render the cell */
  cell: (row: T) => React.ReactNode;
};

type DataTableCardProps<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  searchPlaceholder?: string;
  /** extra JSX for the row actions menu */
  renderRowActions?: (row: T) => React.ReactNode;
};

export function DataTableCard<T>({
  data,
  columns,
  searchPlaceholder = "Search...",
  renderRowActions,
}: DataTableCardProps<T>) {
  const [query, setQuery] = useState("");
  const [visibleCols, setVisibleCols] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(columns.map((c) => [c.id, true])) as Record<
        string,
        boolean
      >
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((row) =>
      columns.some((col) => {
        if (!col.searchable) return false;
        const hay = col.searchable(row).toLowerCase();
        return hay.includes(q);
      })
    );
  }, [data, columns, query]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          {/* search */}
          <div className="relative w-full sm:w-80">
            <Input
              placeholder={searchPlaceholder}
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
              {columns.map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={visibleCols[col.id]}
                  onCheckedChange={(v) =>
                    setVisibleCols((old) => ({
                      ...old,
                      [col.id]: !!v,
                    }))
                  }
                >
                  {col.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="w-full overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                {columns.map(
                  (col) =>
                    visibleCols[col.id] && (
                      <TableHead key={col.id} className="px-4 py-3">
                        {col.label}
                      </TableHead>
                    )
                )}
                {renderRowActions && (
                  <TableHead className="px-4 py-3 text-right" />
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((row, idx) => (
                <TableRow key={idx}>
                  {columns.map(
                    (col) =>
                      visibleCols[col.id] && (
                        <TableCell key={col.id} className="px-4 py-3">
                          {col.cell(row)}
                        </TableCell>
                      )
                  )}

                  {renderRowActions && (
                    <TableCell className="px-4 py-3 text-right">
                      {renderRowActions(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (renderRowActions ? 1 : 0)}
                    className="text-center py-6 text-sm text-muted-foreground"
                  >
                    No data found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
