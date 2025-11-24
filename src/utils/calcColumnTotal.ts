import type { DatabaseColName } from "../types/globales";

type CalcColumnTotalProps = {
  periods: string[];
  database: Record<DatabaseColName, string | number | undefined>[];
};

const avoidNaN = (value: number): number => (isNaN(value) ? 0 : value);

export const calcColumnTotal =
  ({ periods, database }: CalcColumnTotalProps) =>
  (columnName: DatabaseColName): number => {
    if (columnName === "soluble / insoluble")
      return avoidNaN(
        calcColumnTotal({ periods, database })("fibre solubles") /
          calcColumnTotal({ periods, database })("fibres insolubles")
      );

    if (columnName === "Ω3 / Ω6")
      return avoidNaN(
        calcColumnTotal({ periods, database })("Oméga-3") /
          calcColumnTotal({ periods, database })("Oméga-6")
      );

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

          const itemValueFloat = avoidNaN(parseFloat(itemValue.toString()));

          return total + itemValueFloat;
        }, 0);
      })
      .reduce((acc, val) => acc + val, 0);
    return total;
  };
