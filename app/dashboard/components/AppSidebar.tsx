"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ModuleGroup } from "@/lib/modules";

export default function AppSidebar({ modules }: { modules: ModuleGroup[] }) {
  const pathnameRaw = usePathname() || "";

  // normalize helper removes trailing slashes for reliable comparisons
  const normalize = (s?: string) => (s || "").replace(/\/+$|^\s+|\s+$/g, "");
  const pathname = normalize(pathnameRaw);

  // Find the single best matching item for "active" state: the longest href that matches the current pathname.
  // This prevents multiple items (eg. '/hotel' and '/hotel/rooms') from both being marked active.
  const activeHref = useMemo(() => {
    const allItems = modules.flatMap((g) => g.items || []);
    const matches = allItems
      .map((i) => ({ ...i, hrefNorm: normalize(i.href) }))
      .filter((i) => i.hrefNorm && pathname.startsWith(i.hrefNorm));

    if (matches.length === 0) return null;

    // pick the match with the longest href (most specific)
    matches.sort((a, b) => b.hrefNorm.length - a.hrefNorm.length);
    return matches[0].hrefNorm;
  }, [modules, pathname]);

  // Auto-open group if current path is inside it (keeps current behavior)
  const initialGroups = useMemo(() => {
    const state: Record<string, boolean> = {};

    modules.forEach((group) => {
      state[group.id] = (group.items || []).some((item) => {
        const hrefNorm = normalize(item.href);
        return hrefNorm && pathname.startsWith(hrefNorm);
      });
    });

    return state;
  }, [modules, pathname]);

  const [open, setOpen] = useState(initialGroups);

  const toggle = (id: string) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <nav className="px-2 py-3 w-full overflow-y-auto overflow-x-hidden ">
      {/* BRAND */}
      <Link
        href="/dashboard"
        className="block py-4 px-2 text-center text-2xl font-bold text-blue-600"
      >
        Otithee
      </Link>

      {/* GROUPS */}
      <div className="space-y-2">
        {modules.map((group) => {
          const opened = open[group.id];

          return (
            <div key={group.id} className="border-b last:border-b-0 pb-1">
              {/* GROUP BUTTON */}
              <button
                type="button"
                className={cn(
                  "flex w-full items-center justify-between px-3 py-2 text-sm font-medium hover:bg-gray-100 rounded-md"
                )}
                onClick={() => toggle(group.id)}
              >
                <div className="flex items-center gap-2">
                  {group.icon}
                  <span>{group.title}</span>
                </div>

                <span className="text-xs">{opened ? "▾" : "▸"}</span>
              </button>

              {/* ITEMS */}
              {opened && (
                <div className="mt-1 space-y-1 pl-3">
                  {group.items.map((item) => {
                    const itemHrefNorm = normalize(item.href);
                    const active = itemHrefNorm && itemHrefNorm === activeHref;

                    return (
                      <Link
                        key={item.title}
                        href={item.href || "#"}
                        className={cn(
                          "block px-3 py-2 text-sm rounded-md",
                          active ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                        )}
                      >
                        {item.title}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
