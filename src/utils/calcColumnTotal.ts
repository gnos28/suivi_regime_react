import type { DatabaseColName } from "../types/globales";

type CalcColumnTotalProps = {
  periods: string[];
  database: Record<DatabaseColName, string | number | undefined>[];
};

export const calcColumnTotal =
  ({ periods, database }: CalcColumnTotalProps) =>
  (columnName: DatabaseColName): number => {
    const total = periods
      .map((meals) => {
        if (!meals) return 0;
        const mealItems = (meals ?? "").toString().split("\n");

        return mealItems.reduce((total, item) => {
          const dbItem = database.find(
            (dbEntry) =>
              dbEntry.aliment?.toString().toLowerCase() === item.toLowerCase()
          );

          const itemValue = dbItem !== undefined ? dbItem[columnName] ?? 0 : 0;

          const itemValueFloat = parseFloat(itemValue.toString());

          return total + (isNaN(itemValueFloat) ? 0 : itemValueFloat);
        }, 0);
      })
      .reduce((acc, val) => acc + val, 0);
    return total;
  };
