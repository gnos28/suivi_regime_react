import type { SuiviColName } from "../../types/globales";

export const timeRanges = ["7D", "1M", "6M"] as const;
export type TimeRange = (typeof timeRanges)[number];

export const dataGroups: SuiviColName[][] = [
  ["ballonnements", "selles", "nausées"],
  ["Calories", "Proteines", "Glucides", "Lipides"],
  ["fibre solubles", "fibres insolubles", "fibre total", "soluble / insoluble"],
  ["Sodium", "Potassium", "Calcium", "Magnésium", "Fer", "Zinc"],
  ["Vitamine D", "Vitamine B9", "Vitamine B12", "Vitamine C"],
  ["Oméga-3", "Oméga-6", "Ω3 / Ω6"],
] as const;
