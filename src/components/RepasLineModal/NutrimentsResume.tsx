import { useEffect, useState } from "react";
import { useSuiviRegime } from "../../hooks/useSuiviRegime";
import type { DatabaseExtended } from "../../types/databaseExtended";
import { globales } from "../../types/globales";
import NutrimentItem from "./NutrimentItem";
import buttonStyles from "../../styles/button.module.scss";
import styles from "./NutrimentsResume.module.scss";
import { calcDonutGroups } from "../../utils/calcDonutGroups";
import { isNutrimentRelevant } from "../../utils/displayUtils";

type NutrimentsResumeProps = {
  editedContent: string;
  autoAnalyze?: boolean;
};

const NutrimentsResume = ({
  editedContent,
  autoAnalyze,
}: NutrimentsResumeProps) => {
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

    if (autoAnalyze && editedContent.trim().length > 0) {
      // Don't auto analyze if we already found an item (e.g. from local DB check above)
      // But updateNutrimentsResume is called in the same render cycle effectively (or sync).
      // Actually `nutrimentsResume` state won't be updated immediately.
      // We should check the databaseExtended directly here to decide.
      const foundItem = databaseExtended.find(
        (item) =>
          item.aliment.toString().toLowerCase() ===
          editedContent.trim().toLowerCase()
      );
      if (!foundItem) {
        handleRequestGemini();
      }
    }
  }, [editedContent, databaseExtended /*, autoAnalyze */]); // autoAnalyze is not in dependency because we only want to run this once or effectively when content changes if we want persistent auto functionality, but here it's likely just for the initial load.
  // Ideally, if autoAnalyze is passed, we want it to trigger.
  // However, handleRequestGemini is async.
  // Let's refine the effect.

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
            .filter((colName) => isNutrimentRelevant(colName, nutrimentsResume))
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
