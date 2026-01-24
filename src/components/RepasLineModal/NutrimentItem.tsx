import type { DatabaseExtended } from "../../types/databaseExtended";
import type { DatabaseColName } from "../../types/globales";
import type { DonutGroupItem } from "../../utils/calcDonutGroups";
import styles from "./NutrimentItem.module.scss";
import { calcNutrimentGrayscale } from "../../utils/displayUtils";

type NutrimentItemProps = {
  colName: DatabaseColName;
  nutrimentsResume: DatabaseExtended | null;
  donutGroups: DonutGroupItem[];
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

  const backgroundColor = donutGroupItem?.colorValue ?? "transparent";

  const name = donutGroupItem?.nameAbbr ?? colName;
  const value = valueFormatted(nutrimentsResume[colName] ?? "N/A");
  const unit = donutGroupItem?.unit ?? "";

  const grayscale = calcNutrimentGrayscale(colName, nutrimentsResume);

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
