import { useEffect, useState } from "react";
import { useSuiviRegime } from "../../hooks/useSuiviRegime";
import type { DatabaseExtended } from "../../types/databaseExtended";
import { globales } from "../../types/globales";
import NutrimentItem from "./NutrimentItem";
import buttonStyles from "../../styles/button.module.scss";
import styles from "./NutrimentsResume.module.scss";
import { calcDonutGroups } from "../../utils/calcDonutGroups";

type NutrimentsResumeProps = {
  editedContent: string;
};

const NutrimentsResume = ({ editedContent }: NutrimentsResumeProps) => {
  const { handleAddToDatabase, databaseExtended, selectedSuiviDay, targets } =
    useSuiviRegime();
  const [loadingGemini, setLoadingGemini] = useState(false);
  const [nutrimentsResume, setNutrimentsResume] =
    useState<DatabaseExtended | null>(null);

  const donutGroups = calcDonutGroups({
    database: databaseExtended,
    selectedSuiviDay,
    targets,
  }).flat();

  const handleRequestGemini = async () => {
    if (loadingGemini) return;
    setLoadingGemini(true);
    await handleAddToDatabase(editedContent);
    setLoadingGemini(false);
  };

  useEffect(() => {
    const updateNutrimentsResume = () => {
      const foundItem = databaseExtended.find(
        (item) =>
          item.aliment.toString().toLowerCase() ===
          editedContent.trim().toLowerCase()
      );

      if (foundItem) {
        setNutrimentsResume(foundItem);
      } else {
        setNutrimentsResume(null);
      }
    };

    updateNutrimentsResume();
  }, [editedContent, databaseExtended]);

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
