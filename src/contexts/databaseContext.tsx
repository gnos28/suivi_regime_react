import { createContext, useState, useMemo, type ReactNode } from "react";
import type { DatabaseColName } from "../types/globales";

type DatabaseContextProviderProps = { children: ReactNode };

type TypeContext = {
  database: Record<DatabaseColName, string | number>[];
  setDatabase: (c: Record<DatabaseColName, string | number>[]) => void;
};

const DatabaseContext = createContext<TypeContext>({
  database: [],
  setDatabase: () => {},
});

export function DatabaseContextProvider({
  children,
}: DatabaseContextProviderProps) {
  const [database, setDatabase] = useState<
    Record<DatabaseColName, string | number>[]
  >([]);

  const value = useMemo(
    () => ({
      database,
      setDatabase,
    }),
    [database]
  );
  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}

export default DatabaseContext;
