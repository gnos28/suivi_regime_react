import styles from "./RepasSection.module.scss";
import buttonStyles from "../styles/button.module.scss";
import RepasLines from "./RepasLines";
import { useContext, useState } from "react";
import { calcColumnTotal } from "../utils/calcColumnTotal";
import DatabaseContext from "../contexts/databaseContext";
import RepasLineModal from "./RepasLineModal";
import SuiviDaysContext from "../contexts/suiviDaysContext";
import {
  convertDateToString,
  convertJsonStringToDate,
  removeAccents,
} from "../utils/utils";
import { calcColumnAverage } from "../utils/calcColumnAverage";
import type { DatabaseColName } from "../types/globales";
import { fetchUpdateSuiviDay } from "../api/fetchUpdateSuiviDay";

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
  content: string | number | undefined;
  dayTimeCol: "matin" | "midi" | "goûter" | "soir";
};

const RepasSection = ({ title, content, dayTimeCol }: RepasSectionProps) => {
  const [showRepas, setShowRepas] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const { database } = useContext(DatabaseContext);
  const { suiviDays, setSuiviDays } = useContext(SuiviDaysContext);
  const today = new Date();

  const calcColumnTotalPeriod = calcColumnTotal({
    periods: [content?.toString() ?? ""],
    database: database,
  });

  const calcColumnAveragePeriod = calcColumnAverage({
    dayTimeCol,
    database,
    suiviDays,
  });

  const handleAddLine = async (newLine: string) => {
    if (newLine.trim() === "") return;

    const updatedSuiviDays = suiviDays.map((suiviDay) => {
      if (
        convertDateToString(convertJsonStringToDate(suiviDay.date)) ===
        convertDateToString(today)
      ) {
        const dayTimeMeals = (suiviDay[dayTimeCol] ?? "").toString();
        return {
          ...suiviDay,
          [dayTimeCol]:
            dayTimeMeals.trim() === ""
              ? newLine
              : dayTimeMeals + "\n" + newLine,
        };
      } else return suiviDay;
    });

    setSuiviDays(updatedSuiviDays);
    setShowAddModal(false);
    await fetchUpdateSuiviDay({
      date: convertDateToString(today),
      [removeAccents(dayTimeCol)]:
        (content?.toString() ?? "").trim() !== ""
          ? (content?.toString() ?? "") + "\n" + newLine
          : newLine,
    });
  };

  const imageSrc =
    dayTimeCol === "matin"
      ? "/public/matin.webp"
      : dayTimeCol === "midi"
      ? "/public/midi.webp"
      : dayTimeCol === "goûter"
      ? "/public/aprem.webp"
      : "/public/soir.webp";

  return (
    <div className={styles.repasSectionContainer}>
      <div
        onClick={() => setShowRepas(!showRepas)}
        className={styles.repasSectionTitle}
      >
        <img src={imageSrc} alt="" className={styles.repasSectionImage} />
        <h3>{title}</h3>

        <div className={styles.nutritionTotalsPeriod}>
          <AverageBar
            columnName="Calories"
            calcColumnTotalPeriod={calcColumnTotalPeriod}
            calcColumnAveragePeriod={calcColumnAveragePeriod}
            unit="kcal"
            color="rgba(44, 44, 44, 0.2)"
            colorRemaining="rgba(172, 172, 172, 0.2)"
          />
          <AverageBar
            columnName="Proteines"
            calcColumnTotalPeriod={calcColumnTotalPeriod}
            calcColumnAveragePeriod={calcColumnAveragePeriod}
            unit="g"
            color="rgba(70, 92, 255, 0.2)"
            colorRemaining="rgba(167, 178, 255, 0.2)"
          />
          <AverageBar
            columnName="Glucides"
            calcColumnTotalPeriod={calcColumnTotalPeriod}
            calcColumnAveragePeriod={calcColumnAveragePeriod}
            unit="g"
            color="rgba(255, 217, 45, 0.35)"
            colorRemaining="rgba(255, 233, 161, 0.2)"
          />
          <AverageBar
            columnName="Lipides"
            calcColumnTotalPeriod={calcColumnTotalPeriod}
            calcColumnAveragePeriod={calcColumnAveragePeriod}
            unit="g"
            color="rgba(235, 54, 54, 0.2)"
            colorRemaining="rgba(255, 192, 192, 0.2)"
          />
          {/* Cal: {calcColumnTotalPeriod("Calories").toFixed(0)} kcal | Prot:{" "}
          {calcColumnTotalPeriod("Proteines").toFixed(1)} g | Gluc:{" "}
          {calcColumnTotalPeriod("Glucides").toFixed(1)} g | Lip:{" "}
          {calcColumnTotalPeriod("Lipides").toFixed(1)} g */}
        </div>
      </div>
      {showRepas === true && (
        <div className={styles.repasSectionContent}>
          <RepasLines text={content} dayTimeCol={dayTimeCol} />
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
              handleValidate={handleAddLine}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default RepasSection;
