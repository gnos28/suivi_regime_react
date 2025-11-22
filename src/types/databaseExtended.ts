import type { DatabaseColName, NutrimentsColName } from "./globales";

export type DatabaseExtended = Record<DatabaseColName, string | number> & {
  nutrimentByCalorie: Record<
    Exclude<NutrimentsColName, "Calories" | "soluble / insoluble" | "Ω3 / Ω6">,
    number
  >;
  nutrimentByCalorieVsAverage: Record<
    Exclude<NutrimentsColName, "Calories" | "soluble / insoluble" | "Ω3 / Ω6">,
    number
  >;
  nutrimentVsAverage: Record<NutrimentsColName, number>;
};

export type AverageNutrimentByCalorie = Record<
  Exclude<NutrimentsColName, "Calories" | "soluble / insoluble" | "Ω3 / Ω6">,
  number
>;

export type AverageNutriment = Record<NutrimentsColName, number>;
