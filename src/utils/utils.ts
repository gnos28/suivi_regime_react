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
    | "nausées"
) => {
  if (dayTimeColOrSymptom === "goûter") return "gouter";
  if (dayTimeColOrSymptom === "nausées") return "nausees";
  return dayTimeColOrSymptom;
};
