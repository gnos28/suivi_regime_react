import styles from "./RepasSection.module.scss";
import RepasLines from "./RepasLines";
import { useContext, useState } from "react";
import { calcColumnTotal } from "../utils/calcColumnTotal";
import DatabaseContext from "../contexts/databaseContext";
import RepasLineModal from "./RepasLineModal";
import SuiviDaysContext from "../contexts/suiviDaysContext";
import { convertDateToString, convertJsonStringToDate } from "../utils/utils";

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

  const handleAddLine = (newLine: string) => {
    const updatedSuiviDays = suiviDays.map((suiviDay) => {
      if (
        convertDateToString(convertJsonStringToDate(suiviDay.date)) ===
        convertDateToString(today)
      )
        return {
          ...suiviDay,
          [dayTimeCol]: (suiviDay[dayTimeCol] ?? "") + "\n" + newLine,
        };
      else return suiviDay;
    });
    setSuiviDays(updatedSuiviDays);
    setShowAddModal(false);
  };

  return (
    <div className={styles.repasSectionContainer}>
      <div
        onClick={() => setShowRepas(!showRepas)}
        className={styles.repasSectionTitle}
      >
        <h3>{title}</h3>

        <div className={styles.nutritionTotalsPeriod}>
          Cal: {calcColumnTotalPeriod("Calories").toFixed(0)} kcal | Prot:{" "}
          {calcColumnTotalPeriod("Proteines").toFixed(1)} g | Gluc:{" "}
          {calcColumnTotalPeriod("Glucides").toFixed(1)} g | Lip:{" "}
          {calcColumnTotalPeriod("Lipides").toFixed(1)} g
        </div>
      </div>
      {showRepas === true && (
        <div className={styles.repasSectionContent}>
          <RepasLines text={content} dayTimeCol={dayTimeCol} />
          <span
            className={styles.addButton}
            onClick={() => setShowAddModal(true)}
          >
            +
          </span>
          {showAddModal && (
            <RepasLineModal
              dayTimeCol={dayTimeCol}
              content={""}
              setEditing={() => {}}
              handleValidate={handleAddLine}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default RepasSection;
