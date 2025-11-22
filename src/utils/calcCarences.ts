import { globales, type SuiviColName } from "../types/globales";

type CalcCarencesProps = {
  selectedSuiviDay:
    | Record<SuiviColName, string | number | undefined>
    | undefined;
  targets: { targetName: string; min?: string; max?: string }[];
};

export const calcCarences = ({
  selectedSuiviDay,
  targets,
}: CalcCarencesProps) => {
  const nutrimentsData = globales.nutrimentsColNames.map((nutriment) => {
    const dayValue = selectedSuiviDay?.[nutriment]
      ? parseFloat((selectedSuiviDay?.[nutriment] ?? 0).toString())
      : 0;
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
