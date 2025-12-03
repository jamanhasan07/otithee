"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ModuleGroup } from "@/lib/modules";

export default function AppSidebar({ modules }: { modules?: ModuleGroup[] }) {
  const pathname = usePathname();
  const groups = modules ?? [];

  const initialState = useMemo(() => {
    const s: Record<string, boolean> = {};
    groups.forEach((g) => {
      s[g.id] = g.items.some((it) => it.href && pathname?.startsWith(it.href));
    });
    return s;
  }, [groups, pathname]);

  const [openGroups, setOpenGroups] =
    useState<Record<string, boolean>>(initialState);

  const toggleGroup = (id: string) =>
    setOpenGroups((p) => ({ ...p, [id]: !p[id] }));

  const isActive = (href?: string) =>
    href ? pathname === href || pathname?.startsWith(href) : false;

  return (
    <nav className="px-2">
      <Link href={'/dashboard'} className="py-4 px-2 text-center">
        <div className="text-2xl font-bold text-blue-600">Otithee</div>
      </Link>

      <div className="space-y-2">
        {groups.map((group) => {
          const opened = !!openGroups[group.id];
          return (
            <div key={group.id} className="border-b last:border-b-0">
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted/50 rounded"
              >
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{group.icon}</span>
                  <span>{group.title}</span>
                </div>
                <span>{opened ? "▾" : "▸"}</span>
              </button>

              {opened && (
                <div className="px-3 pb-2">
                  {group.items.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href ?? "#"}
                      className={cn(
                        "block px-3 py-2 rounded text-sm",
                        isActive(item.href)
                          ? "bg-blue-600 text-white"
                          : "hover:bg-muted/50"
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <span>{item.title}</span>
                        {item.badge ? (
                          <span className="text-xs px-2 py-0.5 rounded bg-muted">
                            {item.badge}
                          </span>
                        ) : null}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
