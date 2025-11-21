import { createContext, useState, useMemo, type ReactNode } from "react";

type DonutGroupIndexContextProviderProps = { children: ReactNode };

type TypeContext = {
  donutGroupIndex: number;
  setDonutGroupIndex: (c: number) => void;
};

const DonutGroupIndexContext = createContext<TypeContext>({
  donutGroupIndex: 0,
  setDonutGroupIndex: () => {},
});

export function DonutGroupIndexContextProvider({
  children,
}: DonutGroupIndexContextProviderProps) {
  const [donutGroupIndex, setDonutGroupIndex] = useState<number>(0);

  const value = useMemo(
    () => ({
      donutGroupIndex,
      setDonutGroupIndex,
    }),
    [donutGroupIndex]
  );
  return (
    <DonutGroupIndexContext.Provider value={value}>
      {children}
    </DonutGroupIndexContext.Provider>
  );
}

export default DonutGroupIndexContext;
