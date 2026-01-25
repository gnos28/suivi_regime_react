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
  autoAnalyze?: boolean;
  quantity: number;
};

const NutrimentsResume = ({
  editedContent,
  autoAnalyze,
  quantity,
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
          editedContent.trim().toLowerCase(),
      );

      if (foundItem) {
        setNutrimentsResume(foundItem);
      } else {
        setNutrimentsResume(null);
      }
    };

    updateNutrimentsResume();

    if (autoAnalyze && editedContent.trim().length > 0) {
      const foundItem = databaseExtended.find(
        (item) =>
          item.aliment.toString().toLowerCase() ===
          editedContent.trim().toLowerCase(),
      );
      if (!foundItem) {
        handleRequestGemini();
      }
    }
  }, [editedContent, databaseExtended /*, autoAnalyze */]);

  return (
    <div
      className={styles.nutrimentsSection}
      style={{
        overflowX: nutrimentsResume === null ? "hidden" : "scroll",
      }}
    >
      {nutrimentsResume ? (
        <div className={styles.nutrimentsContainer}>
          {globales.nutrimentGroups.map((nutrimentGroup) => (
            <div className={styles.nutrimentsGroupContainer}>
              {nutrimentGroup.map((colName) => (
                <NutrimentItem
                  key={colName}
                  colName={colName}
                  nutrimentsResume={nutrimentsResume}
                  donutGroups={donutGroups}
                  quantity={quantity}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div
          className={[styles.nutrimentsContainer, styles.noNutriments].join(
            " ",
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
