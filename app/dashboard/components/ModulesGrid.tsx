"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Truck,
  Home,
  Grid as GridIcon,
  BookOpen,
  FileText,
  Layers,
  Plane,
} from "lucide-react";

type ModuleItem = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path?: string;
  tag?: string;
  image: string;
  variant?: string;
  size?: 1 | 2;
  rows?: 1 | 2;
};

const MODULES: ModuleItem[] = [
  {
    id: "hotel",
    title: "Hotel & Resort",
    description: "Rooms, bookings, housekeeping & F&B.",
    icon: <Home className="w-5 h-5" />,
    path: "/hotel",
    tag: "Core",
    image:
      "https://images.unsplash.com/photo-1501117716987-c8e1ecb210d8?w=1600&q=80&auto=format&fit=crop",
    variant: "violet",
    size: 2,
    rows: 1,
  },
  {
    id: "transport",
    title: "Transport",
    description: "Fleet, drivers, bookings & tracking.",
    icon: <Truck className="w-5 h-5" />,
    path: "/transport",
    tag: "Logistics",
    image:
      "https://images.unsplash.com/photo-1506617420156-8e4536971650?w=1600&q=80&auto=format&fit=crop",
    variant: "teal",
    size: 1,
    rows: 1,
  },
  {
    id: "aviation",
    title: "Aviation",
    description: "Air ticketing, visas & compliance.",
    icon: <Plane className="w-5 h-5" />,
    path: "/aviation",
    tag: "Travel",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1600&q=80&auto=format&fit=crop",
    variant: "blue",
    size: 1,
    rows: 2,
  },
  {
    id: "property",
    title: "Property",
    description: "Tenants, maintenance & billing.",
    icon: <Layers className="w-5 h-5" />,
    path: "/property",
    tag: "Real Estate",
    image:
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=1600&q=80&auto=format&fit=crop",
    variant: "amber",
    size: 2,
    rows: 1,
  },
  {
    id: "city",
    title: "City & Resort",
    description: "Facilities, bookings & community tools.",
    icon: <GridIcon className="w-5 h-5" />,
    path: "/city",
    tag: "Urban",
    image:
      "https://images.unsplash.com/photo-1505988772020-6b0f1d6a862b?w=1600&q=80&auto=format&fit=crop",
    variant: "green",
    size: 1,
    rows: 1,
  },
  {
    id: "training",
    title: "Training",
    description: "Courses, exams & certifications.",
    icon: <BookOpen className="w-5 h-5" />,
    path: "/training",
    tag: "Training",
    image:
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1600&q=80&auto=format&fit=crop",
    variant: "pink",
    size: 1,
    rows: 1,
  },
  {
    id: "accounting_hr",
    title: "Accounting & HR",
    description: "GL, payroll, invoices & recruitment.",
    icon: <FileText className="w-5 h-5" />,
    path: "/accounting",
    tag: "Finance",
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1600&q=80&auto=format&fit=crop",
    variant: "gold",
    size: 2,
    rows: 1,
  },
  {
    id: "core",
    title: "Core ERP",
    description: "Roles, permissions, integrations & API.",
    icon: <CalendarDays className="w-5 h-5" />,
    path: "/core",
    tag: "Platform",
    image:
      "https://images.unsplash.com/photo-1532153975070-2c7c9af8a6dc?w=1600&q=80&auto=format&fit=crop",
    variant: "cyan",
    size: 1,
    rows: 1,
  },
];

const GRADIENTS: Record<string, string> = {
  violet: "from-violet-600/60 via-fuchsia-500/40 to-rose-400/30",
  teal: "from-cyan-600/60 via-teal-500/40 to-emerald-400/30",
  blue: "from-indigo-600/60 via-sky-500/40 to-blue-400/30",
  amber: "from-amber-600/60 via-orange-500/40 to-red-400/30",
  green: "from-emerald-600/60 via-lime-500/40 to-amber-400/30",
  pink: "from-pink-600/60 via-fuchsia-500/40 to-purple-400/30",
  gold: "from-yellow-500/60 via-amber-500/40 to-rose-400/30",
  cyan: "from-sky-600/60 via-cyan-500/40 to-blue-400/30",
  default: "from-black/40 to-black/20",
};

export default function ModulesMosaicSingleColumnMobile() {
  const router = useRouter();

  // No col-span on mobile; spans only start from md+
  const colSpanClass = (size?: number) => {
    if (size === 2) return "md:col-span-2 lg:col-span-4";
    return "md:col-span-1 lg:col-span-2";
  };

  const rowSpanClass = (rows?: number) => {
    if (rows === 2) return "lg:row-span-2";
    return "";
  };

  return (
    <section className="px-3 sm:px-0">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">
        Otithee — Modules
      </h2>

      {/* 1 col mobile, 4 cols md, 6 cols lg. Rows grow with content */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 auto-rows-[minmax(180px,_auto)]">
        {MODULES.map((m) => {
          const spanCls = `${colSpanClass(m.size)} ${rowSpanClass(m.rows)}`;
          const gradient = GRADIENTS[m.variant ?? "default"];

          return (
            <article
              key={m.id}
              role="button"
              tabIndex={0}
              onClick={() => m.path && router.push(m.path)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && m.path) router.push(m.path);
              }}
              className={`
                relative rounded-2xl overflow-hidden shadow-lg
                transform transition-transform duration-300
                focus:outline-none focus:ring-2 focus:ring-indigo-400
                ${spanCls}
                active:scale-[0.99] md:hover:scale-[1.02]
              `}
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 will-change-transform"
                style={{ backgroundImage: `url(${m.image})` }}
                aria-hidden
              />

              {/* gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${gradient} mix-blend-multiply opacity-90 transition-opacity duration-300`}
                aria-hidden
              />

              {/* dark layer */}
              <div className="absolute inset-0 bg-black/25" aria-hidden />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between p-3 sm:p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm text-white">
                      {m.icon}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-lg font-semibold text-white truncate">
                        {m.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/90 mt-1 line-clamp-2">
                        {m.description}
                      </p>
                    </div>
                  </div>

                  {/* Badge on md+ in top-right */}
                  <div className="hidden md:block shrink-0">
                    {m.tag && <Badge variant="secondary">{m.tag}</Badge>}
                  </div>
                </div>

                {/* Badge on mobile at bottom-right */}
                <div className="flex items-center justify-end mt-2 md:hidden">
                  {m.tag && (
                    <Badge variant="secondary" className="text-[10px]">
                      {m.tag}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Anchor overlay (for semantics) */}
              <a
                href={m.path ?? "#"}
                aria-label={`${m.title} — open module`}
                className="absolute inset-0 z-0"
                onClick={(e) => {
                  if (m.path) e.preventDefault();
                }}
              />
            </article>
          );
        })}
      </div>
    </section>
  );
}
