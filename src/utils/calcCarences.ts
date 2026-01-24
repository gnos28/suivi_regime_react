import {
  globales,
  type DatabaseColName,
  type SuiviColName,
} from "../types/globales";
import { parseMealLine } from "./utils";

type CalcCarencesProps = {
  selectedSuiviDay:
    | Partial<Record<SuiviColName, string | number | undefined>>
    | undefined;
  targets: { targetName: string; min?: string; max?: string }[];
  database: Partial<Record<DatabaseColName, string | number | undefined>>[];
  dayTimes?: ("matin" | "midi" | "goûter" | "soir")[];
};

const allDayTimes = ["matin", "midi", "goûter", "soir"] as const;

export const calcCarences = ({
  selectedSuiviDay,
  targets,
  database,
  dayTimes,
}: CalcCarencesProps) => {
  const meats = (dayTimes === undefined ? allDayTimes : dayTimes)
    .map((dayTime) =>
      (selectedSuiviDay?.[dayTime]?.toString() || "")
        .split("\n")
        .filter((item) => item.trim() !== "" && item.trim() !== "-")
    )
    .flat();

  const nutrimentsData = globales.nutrimentsColNames.map((nutriment) => {
    const dayValue = meats.reduce((acc, meat) => {
      const { quantity, text } = parseMealLine(meat);
      const dbItem = database.find(
        (dbEntry) =>
          dbEntry.aliment?.toString().toLowerCase() === text.toLowerCase()
      );

      const itemValue = dbItem !== undefined ? dbItem[nutriment] ?? 0 : 0;

      const itemValueFloat = parseFloat(itemValue.toString());

      return acc + (isNaN(itemValueFloat) ? 0 : itemValueFloat) * quantity;
    }, 0);

    // const dayValue = selectedSuiviDay?.[nutriment]
    //   ? parseFloat((selectedSuiviDay?.[nutriment] ?? 0).toString())
    //   : 0;

    const min = targets.find((target) => target.targetName === nutriment)?.min;
    const max = targets.find((target) => target.targetName === nutriment)?.max;

    const carence =
      min !== undefined && isNaN(parseFloat(min)) === false
        ? dayValue / parseFloat(min)
        : null;
    const excess =
      max !== undefined && isNaN(parseFloat(max)) === false
        ? dayValue / parseFloat(max)
        : null;

    return { nutriment, carence, excess, dayValue, min, max };
  });

  const carences = nutrimentsData
    .filter((item) => item.carence !== null)
    .filter((item) => (item.carence ?? 0) < 1)
    .sort((a, b) => {
      if (a.carence === null) return 0;
      if (b.carence === null) return 0;
      return a.carence - b.carence;
    });
  return carences;
};
