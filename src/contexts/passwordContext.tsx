import { createContext, useState, useMemo, type ReactNode } from "react";

type PasswordContextProviderProps = { children: ReactNode };

type TypeContext = {
  password: string;
  setPassword: (c: string) => void;
  invalidPassword: boolean;
  setInvalidPassword: (c: boolean) => void;
};

const PasswordContext = createContext<TypeContext>({
  password: "",
  setPassword: () => {},
  invalidPassword: false,
  setInvalidPassword: () => {},
});

export function PasswordContextProvider({
  children,
}: PasswordContextProviderProps) {
  const [password, setPassword] = useState<string>("");
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false);

  const value = useMemo(
    () => ({
      password,
      setPassword,
      invalidPassword,
      setInvalidPassword,
    }),
    [password, invalidPassword]
  );
  return (
    <PasswordContext.Provider value={value}>
      {children}
    </PasswordContext.Provider>
  );
}

export default PasswordContext;
