import type { DatabaseExtended } from "../../types/databaseExtended";
import type { DatabaseColName } from "../../types/globales";
import styles from "./NutrimentItem.module.scss";

type NutrimentItemProps = {
  colName: DatabaseColName;
  nutrimentsResume: DatabaseExtended | null;
  donutGroups: {
    name: DatabaseColName;
    nameAbbr: string;
    colorValue: string;
    unitDecimals?: number;
    unit: string;
  }[];
};

const NutrimentItem = ({
  colName,
  nutrimentsResume,
  donutGroups,
}: NutrimentItemProps) => {
  if (!nutrimentsResume) return null;

  const donutGroupItem = donutGroups.find((item) => item.name === colName);

  const valueFormatted = (value: number | string) => {
    if (!donutGroupItem) return value;

    if (
      typeof value === "number" &&
      donutGroupItem.unitDecimals !== undefined
    ) {
      return value.toFixed(donutGroupItem.unitDecimals);
    }

    return value;
  };

  const calcGrayScale = () => {
    if (
      colName === "aliment" ||
      colName === "soluble / insoluble" ||
      colName === "Ω3 / Ω6" ||
      colName === "Calories"
    )
      return 0;

    const nutrimentByCalorieVsAverage =
      nutrimentsResume.nutrimentByCalorieVsAverage[colName];

    const grayscaleValue = 1 - Math.min(1, nutrimentByCalorieVsAverage);

    return grayscaleValue;
  };

  const backgroundColor = donutGroupItem?.colorValue ?? "transparent";

  const name = donutGroupItem?.nameAbbr ?? colName;
  const value = valueFormatted(nutrimentsResume[colName] ?? "N/A");
  const unit = donutGroupItem?.unit ?? "";

  const grayscale = calcGrayScale();

  return (
    <div
      key={colName}
      className={styles.nutrimentItem}
      style={{
        backgroundColor,
        borderColor: backgroundColor,
        filter: `grayscale(${grayscale})`,
      }}
    >
      <span>{name}</span>
      <span>{value}</span>
      <span>{unit}</span>
    </div>
  );
};

export default NutrimentItem;
