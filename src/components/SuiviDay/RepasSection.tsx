import styles from "./RepasSection.module.scss";
import buttonStyles from "../../styles/button.module.scss";
import RepasLines from "./RepasLines";
import { useContext, useState } from "react";
import { calcColumnTotal } from "../../utils/calcColumnTotal";
import RepasLineModal from "../RepasLineModal/RepasLineModal";
import { calcColumnAverage } from "../../utils/calcColumnAverage";
import { useSuiviRegime } from "../../hooks/useSuiviRegime";
import DonutGroupIndexContext from "../../contexts/donutGroupIndexContext";
import { calcDonutGroups } from "../../utils/calcDonutGroups";
import AverageBar from "./AverageBar";

import PhotoModal from "../PhotoModal/PhotoModal";

type RepasSectionProps = {
  title: string;
  dayTimeCol: "matin" | "midi" | "goûter" | "soir";
};

const RepasSection = ({ title, dayTimeCol }: RepasSectionProps) => {
  const [showRepas, setShowRepas] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [modalInitialContent, setModalInitialContent] = useState("");
  const [autoAnalyze, setAutoAnalyze] = useState(false);
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
              calcColumnTotalPeriod={calcColumnTotalPeriod}
              calcColumnAveragePeriod={calcColumnAveragePeriod}
              nutrient={nutrient}
            />
          ))}
        </div>
      </div>
      {showRepas === true && (
        <div className={styles.repasSectionContent}>
          <RepasLines splitText={splitText} dayTimeCol={dayTimeCol} />
          <div className={styles.actionsContainer}>
            <div
              className={[buttonStyles.btnGrad, styles.addButton].join(" ")}
              onClick={() => {
                setModalInitialContent("");
                setAutoAnalyze(false);
                setShowAddModal(true);
              }}
            >
              <span>➕</span>
            </div>
            <div
              className={[buttonStyles.btnGrad, styles.addButton].join(" ")}
              onClick={() => setShowPhotoModal(true)}
            >
              <span>📸</span>
            </div>
          </div>
          {showAddModal && (
            <RepasLineModal
              dayTimeCol={dayTimeCol}
              content={modalInitialContent}
              setEditing={setShowAddModal}
              autoAnalyze={autoAnalyze}
              handleValidate={handleAddLine({
                content: selectedSuiviDay?.[dayTimeCol],
                dayTimeCol,
                hideModal,
              })}
            />
          )}
          {showPhotoModal && (
            <PhotoModal
              closeModal={() => setShowPhotoModal(false)}
              onPhotoAnalyzed={(description) => {
                setShowPhotoModal(false);
                setModalInitialContent(description);
                setAutoAnalyze(true);
                setShowAddModal(true);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default RepasSection;
