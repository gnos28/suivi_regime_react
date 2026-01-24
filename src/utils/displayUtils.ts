import type { DatabaseExtended } from "../types/databaseExtended";
import type { DatabaseColName } from "../types/globales";

export const calcNutrimentGrayscale = (
  colName: DatabaseColName,
  nutrimentsResume: DatabaseExtended
): number => {
  if (
    colName === "aliment" ||
    colName === "soluble / insoluble" ||
    colName === "Ω3 / Ω6" ||
    colName === "Calories"
  )
    return 0;

  const key = colName as keyof typeof nutrimentsResume.nutrimentByCalorieVsAverage;
  const nutrimentByCalorieVsAverage = nutrimentsResume.nutrimentByCalorieVsAverage[key];

  const grayscaleValue = 1 - Math.min(1, nutrimentByCalorieVsAverage);

  return grayscaleValue;
};

export const isNutrimentRelevant = (
  colName: DatabaseColName,
  nutrimentsResume: DatabaseExtended
): boolean => {
  const value = nutrimentsResume[colName];
  const hasValue =
    value !== undefined &&
    value !== null &&
    value !== "" &&
    (value !== 0 ||
      ["Calories", "Proteines", "Lipides", "Glucides"].includes(colName));

  if (!hasValue) return false;

  const calcVsAverage = () => {
    if (colName === "Calories") return true;

    const nutrimentVsAverage = nutrimentsResume.nutrimentVsAverage[colName];

    if (nutrimentVsAverage > 0.25) return true;
    return false;
  };

  const calcCalorieVsAverage = () => {
    if (
      colName === "Calories" ||
      colName === "soluble / insoluble" ||
      colName === "Ω3 / Ω6"
    )
      return true;

    const key = colName as keyof typeof nutrimentsResume.nutrimentByCalorieVsAverage;
    const nutrimentByCalorieVsAverage = nutrimentsResume.nutrimentByCalorieVsAverage[key];

    if (nutrimentByCalorieVsAverage > 0.8) return true;
    return false;
  };

  const vsAverage = calcVsAverage();
  const CalorieVsAverage = calcCalorieVsAverage();

  return (
    ["Calories", "Proteines", "Lipides", "Glucides"].includes(colName) ||
    (vsAverage && CalorieVsAverage)
  );
};
