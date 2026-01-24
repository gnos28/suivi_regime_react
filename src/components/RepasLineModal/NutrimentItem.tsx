import type { DatabaseExtended } from "../../types/databaseExtended";
import type { DatabaseColName } from "../../types/globales";
import type { DonutGroupItem } from "../../utils/calcDonutGroups";
import styles from "./NutrimentItem.module.scss";

type NutrimentItemProps = {
  colName: DatabaseColName;
  nutrimentsResume: DatabaseExtended | null;
  donutGroups: DonutGroupItem[];
  quantity: number;
};

const NutrimentItem = ({
  colName,
  nutrimentsResume,
  donutGroups,
  quantity,
}: NutrimentItemProps) => {
  if (!nutrimentsResume) return null;

  const donutGroupItem = donutGroups.find((item) => item.name === colName);

  const valueFormatted = (value: string | number) => {
    if (typeof value === "number") {
      return value.toFixed(donutGroupItem?.unitDecimals ?? 0);
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

  const grayscale = calcGrayScale();
  const name = donutGroupItem?.nameAbbr ?? colName;
  const valueRaw = nutrimentsResume[colName];
  const valueProcessed =
    typeof valueRaw === "number" &&
    !["soluble / insoluble", "Ω3 / Ω6"].includes(colName)
      ? valueRaw * quantity
      : valueRaw;
  const value = valueFormatted(valueProcessed ?? "N/A");
  const unit = donutGroupItem?.unit ?? "";

  return (
    <div
      key={colName}
      className={styles.nutrimentItem}
      style={
        {
          "--bg-color": backgroundColor,
          "--grayscale": grayscale,
        } as React.CSSProperties
      }
    >
      <span>{name}</span>
      <span>{value}</span>
      <span>{unit}</span>
    </div>
  );
};

export default NutrimentItem;
