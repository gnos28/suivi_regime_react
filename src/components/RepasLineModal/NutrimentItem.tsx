import type { DatabaseExtended } from "../../types/databaseExtended";
import type { NutrimentsColName } from "../../types/globales";
import type { DonutGroupItem } from "../../utils/calcDonutGroups";
import styles from "./NutrimentItem.module.scss";

type NutrimentItemProps = {
  colName: NutrimentsColName;
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
      const unitDecimals = value >= 1000 ? 0 : donutGroupItem?.unitDecimals;

      return value.toFixed(unitDecimals ?? 0);
    }
    return value;
  };

  const valueShouldBeShrinked = (value: string | number) => {
    if (typeof value === "number") {
      return value >= 10000;
    }
    return false;
  };

  const calcGrayScale = () => {
    if (
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

  const isBigger =
    colName === "Calories" ||
    colName === "Proteines" ||
    colName === "Lipides" ||
    colName === "Glucides";

  const shrinkValue = valueShouldBeShrinked(valueProcessed ?? 0);

  return (
    <div
      key={colName}
      className={`${styles.nutrimentItem} ${isBigger ? styles.bigNutriment : ""}`}
      style={
        {
          "--bg-color": backgroundColor,
          "--grayscale": grayscale,
        } as React.CSSProperties
      }
    >
      <span>{name}</span>
      <span className={shrinkValue ? styles.shrinkValue : ""}>{value}</span>
      <span>{unit}</span>
    </div>
  );
};

export default NutrimentItem;
