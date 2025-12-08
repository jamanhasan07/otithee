"use client";

import { createContext, useContext } from "react";
import type { ModuleGroup } from "@/lib/modules";

// Create a context with an empty array as default
const ModulesContext = createContext<ModuleGroup[]>([]);

export function useModules() {
  return useContext(ModulesContext);
}

export function ModulesProvider({
  children,
  modules,
}: {
  children: React.ReactNode;
  modules: ModuleGroup[];
}) {
  return (
    <ModulesContext.Provider value={modules}>
      {children}
    </ModulesContext.Provider>
  );
}
