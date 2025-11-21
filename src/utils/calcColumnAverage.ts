import type { DatabaseColName, SuiviColName } from "../types/globales";

type CalcColumnAverageProps = {
  dayTimeCol: "matin" | "midi" | "goûter" | "soir";
  database: Record<DatabaseColName, string | number | undefined>[];
  suiviDays: Record<SuiviColName, string | number | undefined>[];
};

export const calcColumnAverage =
  ({ dayTimeCol, database, suiviDays }: CalcColumnAverageProps) =>
  (columnName: DatabaseColName): number => {
    const today = new Date();

    const filteredSuiviDays = suiviDays.filter(
      (suiviDay) =>
        suiviDay.date && new Date(suiviDay.date).getTime() <= today.getTime()
    );

    const total = filteredSuiviDays
      .map((suiviDay) => {
        const meals = suiviDay[dayTimeCol];

        if (!meals) return 0;
        const mealItems = (meals ?? "").toString().split("\n");

        return mealItems.reduce((total, item) => {
          const dbItem = database.find(
            (dbEntry) =>
              dbEntry.aliment?.toString().toLowerCase() === item.toLowerCase()
          );
          const itemValue =
            dbItem !== undefined
              ? parseFloat(dbItem[columnName]?.toString() ?? "0")
              : 0;
          return total + itemValue;
        }, 0);
      })
      .reduce((acc, val) => acc + val, 0);
    return total / filteredSuiviDays.length;
  };
