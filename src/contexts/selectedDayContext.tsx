import { createContext, useState, useMemo, type ReactNode } from "react";

type SelectedDayContextProviderProps = { children: ReactNode };

type TypeContext = {
  selectedDay: Date;
  setSelectedDay: React.Dispatch<React.SetStateAction<Date>>;
};

const SelectedDayContext = createContext<TypeContext>({
  selectedDay: new Date(),
  setSelectedDay: () => {},
});

export function SelectedDayContextProvider({
  children,
}: SelectedDayContextProviderProps) {
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  const value = useMemo(
    () => ({
      selectedDay,
      setSelectedDay,
    }),
    [selectedDay]
  );
  return (
    <SelectedDayContext.Provider value={value}>
      {children}
    </SelectedDayContext.Provider>
  );
}

export default SelectedDayContext;
