import { createContext, useState, useMemo, type ReactNode } from "react";
import type { DatabaseColName } from "../types/globales";
import type {
  AverageNutriment,
  AverageNutrimentByCalorie,
  DatabaseExtended,
} from "../types/databaseExtended";

const zeroAverage: AverageNutriment = {
  Calories: 0,
  Proteines: 0,
  Glucides: 0,
  Lipides: 0,
  "fibre solubles": 0,
  "fibres insolubles": 0,
  "fibre total": 0,
  "soluble / insoluble": 0,
  Sodium: 0,
  Potassium: 0,
  Calcium: 0,
  Magnésium: 0,
  Fer: 0,
  Zinc: 0,
  "Vitamine D": 0,
  "Vitamine B9": 0,
  "Vitamine B12": 0,
  "Vitamine C": 0,
  "Oméga-3": 0,
  "Oméga-6": 0,
  "Ω3 / Ω6": 0,
};

type DatabaseContextProviderProps = { children: ReactNode };

type TypeContext = {
  database: Record<DatabaseColName, string | number>[];
  setDatabase: (c: Record<DatabaseColName, string | number>[]) => void;
  databaseExtended: DatabaseExtended[];
  setDatabaseExtended: (c: DatabaseExtended[]) => void;
  averageNutrimentByCalorie: AverageNutrimentByCalorie;
  setAverageNutrimentByCalorie: (c: AverageNutrimentByCalorie) => void;
  averageNutriment: AverageNutriment;
  setAverageNutriment: (c: AverageNutriment) => void;
};

const DatabaseContext = createContext<TypeContext>({
  database: [],
  setDatabase: () => {},
  databaseExtended: [],
  setDatabaseExtended: () => {},
  averageNutrimentByCalorie: zeroAverage,
  setAverageNutrimentByCalorie: () => {},
  averageNutriment: zeroAverage,
  setAverageNutriment: () => {},
});

export function DatabaseContextProvider({
  children,
}: DatabaseContextProviderProps) {
  const [database, setDatabase] = useState<
    Record<DatabaseColName, string | number>[]
  >([]);
  const [databaseExtended, setDatabaseExtended] = useState<DatabaseExtended[]>(
    []
  );
  const [averageNutrimentByCalorie, setAverageNutrimentByCalorie] =
    useState<AverageNutrimentByCalorie>(zeroAverage);
  const [averageNutriment, setAverageNutriment] =
    useState<AverageNutriment>(zeroAverage);

  const value = useMemo(
    () => ({
      database,
      setDatabase,
      databaseExtended,
      setDatabaseExtended,
      averageNutrimentByCalorie,
      setAverageNutrimentByCalorie,
      averageNutriment,
      setAverageNutriment,
    }),
    [database, databaseExtended, averageNutrimentByCalorie, averageNutriment]
  );
  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}

export default DatabaseContext;
