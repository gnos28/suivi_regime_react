import { createContext, useState, useMemo, type ReactNode } from "react";
import type { SuiviColName } from "../types/globales";

type SuiviDaysContextProviderProps = { children: ReactNode };

type TypeContext = {
  suiviDays: Record<SuiviColName, string | number>[];
  setSuiviDays: (c: Record<SuiviColName, string | number>[]) => void;
};

const SuiviDaysContext = createContext<TypeContext>({
  suiviDays: [],
  setSuiviDays: () => {},
});

export function SuiviDaysContextProvider({
  children,
}: SuiviDaysContextProviderProps) {
  const [suiviDays, setSuiviDays] = useState<
    Record<SuiviColName, string | number>[]
  >([]);

  const value = useMemo(
    () => ({
      suiviDays,
      setSuiviDays,
    }),
    [suiviDays]
  );
  return (
    <SuiviDaysContext.Provider value={value}>
      {children}
    </SuiviDaysContext.Provider>
  );
}

export default SuiviDaysContext;
