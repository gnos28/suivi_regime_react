import type { DatabaseColName } from "../../types/globales";
import type { DonutGroupItem } from "../../utils/calcDonutGroups";
import styles from "./AverageBar.module.scss";

type AverageBarProps = {
  nutrient: DonutGroupItem;
  calcColumnTotalPeriod: (columnName: DatabaseColName) => number;
  calcColumnAveragePeriod: (columnName: DatabaseColName) => number;
};

const AverageBar = ({
  nutrient,
  calcColumnTotalPeriod,
  calcColumnAveragePeriod,
}: AverageBarProps) => {
  const total = calcColumnTotalPeriod(nutrient.name as DatabaseColName);
  const average = calcColumnAveragePeriod(nutrient.name as DatabaseColName);

  const BAR_WIDTH = 70;
  const BAR_HEIGHT = 12;

  const totalWidth = Math.min((total / average) * BAR_WIDTH, BAR_WIDTH);
  const remainingWidth =
    average - total > 0 ? ((average - total) / average) * BAR_WIDTH : 0;

  const isOverflowing = total > average;

  const overFlowRatio = (average / total) * BAR_WIDTH;

  return (
    <div className={styles.averageBarContainer}>
      <span className={styles.averageBarLabel}>
        {total.toFixed(nutrient.unitDecimals)} {nutrient.unit}
      </span>
      <div
        className={styles.barWrapper}
        style={{
          height: `${BAR_HEIGHT}px`,
          width: `${BAR_WIDTH}px` /* Set width based on remaining amount to reach average */,
        }}
      >
        <div
          className={styles.bar}
          style={{
            height: `${BAR_HEIGHT}px`,
            width: `${BAR_WIDTH}px` /* Set width based on remaining amount to reach average */,
            backgroundColor: nutrient.colorTarget,
          }}
        ></div>
        <div
          className={styles.bar}
          style={{
            height: `${BAR_HEIGHT}px`,
            width: `${totalWidth}px`,
            backgroundColor: "#ffffff00",
          }}
        >
          <div
            className={[styles.bar, styles.barValue].join(" ")}
            style={{
              height: `${BAR_HEIGHT}px`,
              width: `${totalWidth}px`,
              backgroundColor: nutrient.colorValue,
            }}
          ></div>
        </div>
        {isOverflowing && (
          <div
            className={styles.barOverflowContainer}
            style={{
              height: `${BAR_HEIGHT}px`,
              width: `${totalWidth}px`,
              backgroundColor: nutrient.colorValue,
            }}
          >
            <div
              className={styles.barOverflowSymbol}
              style={{ left: `${overFlowRatio}px` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AverageBar;
