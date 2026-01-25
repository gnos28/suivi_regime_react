import { extractQuantityFromText, removeBracketsFromText } from "./textUtils";

export const convertJsonStringToDate = (dateString: string | number) =>
  new Date(dateString);

export const convertDateToString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}/${month}/${year}`;
};

export const removeAccents = (
  dayTimeColOrSymptom:
    | "matin"
    | "midi"
    | "goûter"
    | "soir"
    | "ballonnements"
    | "selles"
    | "nausées",
) => {
  if (dayTimeColOrSymptom === "goûter") return "gouter";
  if (dayTimeColOrSymptom === "nausées") return "nausees";
  return dayTimeColOrSymptom;
};

export const parseMealLine = (
  line: string,
): { quantity: number; text: string } => {
  const trimmedLine = (line || "").trim();

  const quantity = extractQuantityFromText(trimmedLine);
  const text = removeBracketsFromText(trimmedLine);

  return { quantity, text };
};

export const formatMealLine = (quantity: number, text: string): string => {
  if (quantity === 1) return text;
  return `[${quantity}] ${text}`;
};

export const formatQuantityDisplay = (quantity: number): string => {
  if (quantity === 1) return "";
  if (quantity < 1) return `${Math.round(quantity * 100)}%`;
  return `x${quantity}`;
};
