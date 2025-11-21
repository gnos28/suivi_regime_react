import { createContext, useState, useMemo, type ReactNode } from "react";
import type { NutrimentsColName } from "../types/globales";

export type Target = {
  targetName: NutrimentsColName;
  min: string;
  max: string;
};

type TargetsContextProviderProps = { children: ReactNode };

type TypeContext = {
  targets: Target[];
  setTargets: (c: Target[]) => void;
};

const TargetsContext = createContext<TypeContext>({
  targets: [],
  setTargets: () => {},
});

export function TargetsContextProvider({
  children,
}: TargetsContextProviderProps) {
  const [targets, setTargets] = useState<Target[]>([]);

  const value = useMemo(
    () => ({
      targets,
      setTargets,
    }),
    [targets]
  );
  return (
    <TargetsContext.Provider value={value}>{children}</TargetsContext.Provider>
  );
}

export default TargetsContext;
