import { useState } from "react";
import { useSuiviRegime } from "../../hooks/useSuiviRegime";
import type { DatabaseExtended } from "../../types/databaseExtended";
import { type DatabaseColName, globales } from "../../types/globales";
import NutrimentItem from "./NutrimentItem";
import buttonStyles from "../../styles/button.module.scss";
import styles from "./NutrimentsResume.module.scss";

type NutrimentsResumeProps = {
  nutrimentsResume: DatabaseExtended | null;
  donutGroups: {
    name: DatabaseColName;
    nameAbbr: string;
    colorValue: string;
    unitDecimals: number;
    unit: string;
  }[];
  editedContent: string;
};

const NutrimentsResume = ({
  nutrimentsResume,
  donutGroups,
  editedContent,
}: NutrimentsResumeProps) => {
  const { handleAddToDatabase } = useSuiviRegime();
  const [loadingGemini, setLoadingGemini] = useState(false);

  const handleRequestGemini = async () => {
    if (loadingGemini) return;
    setLoadingGemini(true);
    await handleAddToDatabase(editedContent);
    setLoadingGemini(false);
  };

  return (
    <div
      className={styles.nutrimentsSection}
      style={{
        overflowX: nutrimentsResume === null ? "hidden" : "scroll",
      }}
    >
      {nutrimentsResume ? (
        <div className={styles.nutrimentsContainer}>
          {globales.databaseColNames
            .filter((colName) => colName !== "aliment")
            .filter((colName) => {
              const value = nutrimentsResume[colName];
              return (
                value !== undefined &&
                value !== null &&
                value !== "" &&
                value !== 0
              );
            })
            .filter((colName) => {
              const calcVsAverage = () => {
                if (colName === "Calories") return true;

                const nutrimentVsAverage =
                  nutrimentsResume.nutrimentVsAverage[colName];

                if (nutrimentVsAverage > 0.25) return true;
                return false;
              };

              const calcCalorieVsAverage = () => {
                if (
                  colName === "Calories" ||
                  colName === "soluble / insoluble" ||
                  colName === "Ω3 / Ω6"
                )
                  return true;

                const nutrimentByCalorieVsAverage =
                  nutrimentsResume.nutrimentByCalorieVsAverage[colName];

                if (nutrimentByCalorieVsAverage > 0.8) return true;
                return false;
              };

              const vsAverage = calcVsAverage();
              const CalorieVsAverage = calcCalorieVsAverage();

              return vsAverage && CalorieVsAverage;
            })
            .map((colName) => (
              <NutrimentItem
                key={colName}
                colName={colName}
                nutrimentsResume={nutrimentsResume}
                donutGroups={donutGroups}
              />
            ))}
        </div>
      ) : (
        <div
          className={[styles.nutrimentsContainer, styles.noNutriments].join(
            " "
          )}
        >
          {editedContent.trim().length === 0 ? null : (
            <>
              <span>Aucune information nutritionnelle disponible</span>
              <div
                className={[
                  styles.geminiButton,
                  buttonStyles.btnGrad,
                  loadingGemini ? styles.disabledGeminiButton : "",
                ].join(" ")}
                onClick={handleRequestGemini}
              >
                Demander à Gemini
                <img
                  src="/gemini256.webp"
                  alt="gemini"
                  className={[
                    styles.geminiIcon,
                    loadingGemini ? styles.loading : "",
                  ].join(" ")}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NutrimentsResume;
