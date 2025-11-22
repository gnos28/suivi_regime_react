import styles from "./RepasSection.module.scss";
import buttonStyles from "../../styles/button.module.scss";
import RepasLines from "./RepasLines";
import { useContext, useState } from "react";
import { calcColumnTotal } from "../../utils/calcColumnTotal";
import RepasLineModal from "../RepasLineModal/RepasLineModal";
import { calcColumnAverage } from "../../utils/calcColumnAverage";
import type { DatabaseColName } from "../../types/globales";
import { useSuiviRegime } from "../../hooks/useSuiviRegime";
import DonutGroupIndexContext from "../../contexts/donutGroupIndexContext";
import { calcDonutGroups } from "../../utils/calcDonutGroups";

type AverageBarProps = {
  columnName: DatabaseColName;
  calcColumnTotalPeriod: (columnName: DatabaseColName) => number;
  calcColumnAveragePeriod: (columnName: DatabaseColName) => number;
  unit: string;
  color: string;
  colorRemaining: string;
};

const AverageBar = ({
  columnName,
  calcColumnTotalPeriod,
  calcColumnAveragePeriod,
  unit,
  color,
  colorRemaining,
}: AverageBarProps) => {
  const total = calcColumnTotalPeriod(columnName);
  const average = calcColumnAveragePeriod(columnName);

  const BAR_WIDTH = 70;
  const BAR_HEIGHT = 12;

  const totalWidth = Math.min((total / average) * BAR_WIDTH, BAR_WIDTH);
  const remainingWidth =
    average - total > 0 ? ((average - total) / average) * BAR_WIDTH : 0;

  return (
    <div className={styles.averageBarContainer}>
      <span className={styles.averageBarLabel}>
        {total.toFixed(0)} {unit}
      </span>
      <div
        style={{
          height: `${BAR_HEIGHT}px`,
          width: `${totalWidth}px`,
          backgroundColor: color,
        }}
      ></div>
      <div
        style={{
          height: `${BAR_HEIGHT}px`,
          width: `${remainingWidth}px` /* Set width based on remaining amount to reach average */,
          backgroundColor: colorRemaining,
        }}
      ></div>
    </div>
  );
};

type RepasSectionProps = {
  title: string;
  dayTimeCol: "matin" | "midi" | "goûter" | "soir";
};

const RepasSection = ({ title, dayTimeCol }: RepasSectionProps) => {
  const [showRepas, setShowRepas] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const { donutGroupIndex } = useContext(DonutGroupIndexContext);

  const { database, suiviDays, handleAddLine, selectedSuiviDay, targets } =
    useSuiviRegime();

  const hideModal = () => {
    setShowAddModal(false);
  };

  const calcColumnTotalPeriod = calcColumnTotal({
    periods: [selectedSuiviDay?.[dayTimeCol]?.toString() ?? ""],
    database: database,
  });

  const calcColumnAveragePeriod = calcColumnAverage({
    dayTimeCol,
    database,
    suiviDays,
  });

  const imageSrc =
    dayTimeCol === "matin"
      ? "/matin.webp"
      : dayTimeCol === "midi"
      ? "/midi.webp"
      : dayTimeCol === "goûter"
      ? "/aprem.webp"
      : "/soir.webp";

  const splitText = (selectedSuiviDay?.[dayTimeCol] ?? "")
    .toString()
    .split("\n")
    .filter((textLine) => textLine.trim() !== "");

  const hasNotInDatabaseItems = splitText.some(
    (line) =>
      database.some(
        (item) => item.aliment.toString().toLowerCase() === line.toLowerCase()
      ) === false
  );

  const donutGroups = calcDonutGroups({
    database,
    selectedSuiviDay,
    targets,
  });

  return (
    <div className={styles.repasSectionContainer}>
      <div
        onClick={() => setShowRepas(!showRepas)}
        className={styles.repasSectionTitle}
      >
        <img src={imageSrc} alt="" className={styles.repasSectionImage} />
        <h3>{title}</h3>
        {hasNotInDatabaseItems === true && (
          <div className={styles.notInDatabase}>
            <img src="/gemini256.webp" width={24} height={24} />
          </div>
        )}

        <div
          className={styles.nutritionTotalsPeriod}
          style={{
            top: donutGroups[donutGroupIndex]?.length === 4 ? "12px" : "18px",
          }}
        >
          {donutGroups[donutGroupIndex]?.map((nutrient) => (
            <AverageBar
              key={nutrient.name}
              columnName={nutrient.name}
              calcColumnTotalPeriod={calcColumnTotalPeriod}
              calcColumnAveragePeriod={calcColumnAveragePeriod}
              unit={nutrient.unit}
              color={nutrient.colorValue}
              colorRemaining={nutrient.colorTarget}
            />
          ))}
        </div>
      </div>
      {showRepas === true && (
        <div className={styles.repasSectionContent}>
          <RepasLines splitText={splitText} dayTimeCol={dayTimeCol} />
          <div
            className={[buttonStyles.btnGrad, styles.addButton].join(" ")}
            onClick={() => setShowAddModal(true)}
          >
            <span>➕</span>
          </div>
          {showAddModal && (
            <RepasLineModal
              dayTimeCol={dayTimeCol}
              content={""}
              setEditing={setShowAddModal}
              handleValidate={handleAddLine({
                content: selectedSuiviDay?.[dayTimeCol],
                dayTimeCol,
                hideModal,
              })}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default RepasSection;
