import { createContext, useState, useMemo, type ReactNode } from "react";

type ActiveMenuContextProviderProps = { children: ReactNode };

export type MenuItem = "charts" | "repas" | "mood" | "gemini";

type TypeContext = {
  activeMenu: MenuItem;
  setActiveMenu: React.Dispatch<React.SetStateAction<MenuItem>>;
};

const ActiveMenuContext = createContext<TypeContext>({
  activeMenu: "repas",
  setActiveMenu: () => {},
});

export function ActiveMenuContextProvider({
  children,
}: ActiveMenuContextProviderProps) {
  const [activeMenu, setActiveMenu] = useState<MenuItem>("repas");
  const value = useMemo(
    () => ({
      activeMenu,
      setActiveMenu,
    }),
    [activeMenu]
  );
  return (
    <ActiveMenuContext.Provider value={value}>
      {children}
    </ActiveMenuContext.Provider>
  );
}

export default ActiveMenuContext;
