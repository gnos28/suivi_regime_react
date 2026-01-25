const nutrimentsColNames = [
  "Calories",
  "Proteines",
  "Lipides",
  "Glucides",
  "fibre solubles",
  "fibres insolubles",
  "fibre total",
  "soluble / insoluble",
  "Sodium",
  "Potassium",
  "Calcium",
  "Magnésium",
  "Fer",
  "Zinc",
  "Vitamine D",
  "Vitamine B9",
  "Vitamine B12",
  "Vitamine C",
  "Oméga-3",
  "Oméga-6",
  "Ω3 / Ω6",
] as const;

export type NutrimentsColName = (typeof nutrimentsColNames)[number];

const suiviColNames = [
  "date",
  "matin",
  "midi",
  "goûter",
  "soir",
  "ballonnements",
  "selles",
  "nausées",
  "commentaire",
  ...nutrimentsColNames,
] as const;

export type SuiviColName = (typeof suiviColNames)[number];

const nutrimentGroups: NutrimentsColName[][] = [
  ["Calories", "Proteines", "Glucides", "Lipides"],
  ["fibre solubles", "fibres insolubles", "fibre total", "soluble / insoluble"],
  ["Sodium", "Potassium", "Calcium", "Magnésium", "Fer", "Zinc"],
  ["Vitamine D", "Vitamine B9", "Vitamine B12", "Vitamine C"],
  ["Oméga-3", "Oméga-6", "Ω3 / Ω6"],
] as const;

export const dataGroups: SuiviColName[][] = [
  ["ballonnements", "selles", "nausées"],
  ...nutrimentGroups,
] as const;

const databaseColNames = ["aliment", ...nutrimentsColNames] as const;

export type DatabaseColName = (typeof databaseColNames)[number];

export type NutrimentsFromGemini = {
  calories_kcal: number;
  proteines_g: number;
  glucides_g: number;
  lipides_g: number;
  fibre_solubles_g: number;
  fibre_insolubles_g: number;
  sodium_mg: number;
  potassium_mg: number;
  calcium_mg: number;
  magnésium_mg: number;
  fer_mg: number;
  zinc_mg: number;
  vitamine_D_ug: number;
  vitamine_B9_ug: number;
  vitamine_B12_ug: number;
  vitamine_C_mg: number;
  omega_3_mg: number;
  omega_6_mg: number;
};

export const globales = {
  suiviColNames,
  suiviTabName: "SUIVI",
  databaseColNames,
  databaseTabName: "DATABASE",
  nutrimentsColNames,
  nutrimentGroups,
} as const;
