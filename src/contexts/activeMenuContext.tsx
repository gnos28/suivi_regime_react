import { createContext, useState, useMemo, type ReactNode } from "react";

type ActiveMenuContextProviderProps = { children: ReactNode };

type TypeContext = {
  activeMenu: "charts" | "repas" | "mood" | "gemini";
  setActiveMenu: React.Dispatch<
    React.SetStateAction<"charts" | "repas" | "mood" | "gemini">
  >;
};

const ActiveMenuContext = createContext<TypeContext>({
  activeMenu: "repas",
  setActiveMenu: () => {},
});

export function ActiveMenuContextProvider({
  children,
}: ActiveMenuContextProviderProps) {
  const [activeMenu, setActiveMenu] = useState<
    "charts" | "repas" | "mood" | "gemini"
  >("repas");

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
