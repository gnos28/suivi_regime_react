import { useEffect, useState } from "react";
import styles from "./RepasLineModal.module.scss";
import buttonStyles from "../styles/button.module.scss";
import modalStyles from "../styles/modal.module.scss";
import levenshtein from "fast-levenshtein";
import { useSuiviRegime } from "../hooks/useSuiviRegime";
import { globales, type DatabaseColName } from "../types/globales";
import { calcDonutGroups } from "../utils/calcDonutGroups";
import type { DatabaseExtended } from "../types/databaseExtended";
import NutrimentItem from "./NutrimentItem";

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

                if (colName === "Calcium")
                  console.log({ nutrimentByCalorieVsAverage });

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
                Demander à Gemini ?
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

type RepasLineModalProps = {
  setEditing: (editing: boolean) => void;
  handleValidate: (content: string) => void;
  handleDelete?: () => void;
  content: string;
  dayTimeCol: "matin" | "midi" | "goûter" | "soir";
};

const RepasLineModal = ({
  setEditing,
  handleValidate,
  handleDelete,
  content,
  dayTimeCol,
}: RepasLineModalProps) => {
  const [editedContent, setEditedContent] = useState(content);
  const { databaseExtended, suiviDays, selectedSuiviDay, targets } =
    useSuiviRegime();
  const [autocompletion, setAutocompletion] = useState<string[]>([]);
  const [mostUsedAliments, setMostUsedAliments] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<
    "habitudes" | "autocompletion" | "suggestions"
  >("habitudes");
  const [nutrimentsResume, setNutrimentsResume] =
    useState<DatabaseExtended | null>(null);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(e.target.value.replace(/\n/g, ""));
    if (selectedTab !== "autocompletion") setSelectedTab("autocompletion");
  };

  const donutGroups = calcDonutGroups({
    database: databaseExtended,
    selectedSuiviDay,
    targets,
  }).flat();

  useEffect(() => {
    const calcMostUsedAliments = () => {
      const alimentCount: Record<string, number> = {};

      suiviDays.forEach((day) => {
        const repas = day[dayTimeCol];

        if (typeof repas === "string") {
          const aliments = repas.split("\n");
          aliments.forEach((aliment) => {
            const trimmedAliment = aliment.trim();
            if (trimmedAliment.length > 0) {
              if (Object.keys(alimentCount).includes(trimmedAliment) === false)
                alimentCount[trimmedAliment] = 1;
              else alimentCount[trimmedAliment] += 1;
            }
          });
        }
      });

      const sortedAliments = Object.entries(alimentCount)
        .sort((a, b) => b[1] - a[1])
        .map(([aliment]) => aliment);

      setMostUsedAliments(sortedAliments.slice(0, 10));
    };

    calcMostUsedAliments();
  }, [suiviDays, dayTimeCol]);

  useEffect(() => {
    const computeAutocompletion = () => {
      console.log("computeAutocompletion for:", editedContent);

      if (editedContent.trim().length === 0) {
        setAutocompletion([]);
        return;
      }

      const distances: { line: string; distance: number }[] = [
        ...new Set(
          databaseExtended
            .map((item) => item.aliment.toString())
            .filter((name) => name.length > 0 && name !== "-")
        ),
      ]
        .map((name) => {
          const includesEditedContentScore = editedContent
            .toLowerCase()
            .split(/[^a-z]/)
            .filter((str) => str.length > 2)
            .reduce((acc, curr) => {
              const score = name.toLowerCase().includes(curr) ? 100 : 0;

              return acc + score;
            }, 0);

          return {
            line: name,
            distance:
              levenshtein.get(editedContent.toLowerCase(), name.toLowerCase()) -
              includesEditedContentScore,
          };
        })
        .sort((a, b) => a.distance - b.distance);

      console.log({ distances });

      const topAutocompletion = distances
        .filter((item) => item.distance <= 15)
        .map((item) => item.line);

      console.log({ topAutocompletion });

      setAutocompletion(topAutocompletion);
    };

    const updateNutrimentsResume = () => {
      const foundItem = databaseExtended.find(
        (item) =>
          item.aliment.toString().toLowerCase() ===
          editedContent.trim().toLowerCase()
      );

      console.log({ foundItem });

      if (foundItem) {
        setNutrimentsResume(foundItem);
      } else {
        setNutrimentsResume(null);
      }
    };

    updateNutrimentsResume();

    computeAutocompletion();
  }, [editedContent, databaseExtended]);

  return (
    <div
      className={modalStyles.modalBackground}
      onClick={() => {
        console.log("close modal");

        setEditing(false);
      }}
    >
      <div
        className={[modalStyles.modalContainer, styles.modalContainer].join(
          " "
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.suggestionsSection}>
          <div className={styles.tabSelector}>
            <h2
              className={selectedTab === "habitudes" ? styles.selectedTab : ""}
              onClick={() => setSelectedTab("habitudes")}
            >
              Mes habitudes
            </h2>
            <h2
              className={
                selectedTab === "autocompletion" ? styles.selectedTab : ""
              }
              onClick={() => setSelectedTab("autocompletion")}
            >
              Autocompletion
            </h2>
            <h2
              className={
                selectedTab === "suggestions" ? styles.selectedTab : ""
              }
              onClick={() => setSelectedTab("suggestions")}
            >
              Suggestions
            </h2>
          </div>
          {selectedTab === "habitudes" && (
            <div className={styles.suggestionsContainer}>
              <div>
                {mostUsedAliments.slice(0, 7).map((suggestion, index) => (
                  <div
                    key={index}
                    className={[
                      styles.suggestionItem,
                      suggestion === editedContent
                        ? styles.selectedSuggestion
                        : "",
                    ].join(" ")}
                    onClick={() => setEditedContent(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>
          )}
          {selectedTab === "autocompletion" && (
            <div className={styles.suggestionsContainer}>
              <div>
                {autocompletion.slice(0, 10).map((autocompletion, index) => (
                  <div
                    key={index}
                    className={[
                      styles.suggestionItem,
                      autocompletion === editedContent
                        ? styles.selectedSuggestion
                        : "",
                    ].join(" ")}
                    onClick={() => setEditedContent(autocompletion)}
                  >
                    {autocompletion}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <NutrimentsResume
          nutrimentsResume={nutrimentsResume}
          donutGroups={donutGroups}
          editedContent={editedContent}
        />

        <div className={styles.editContainer}>
          <textarea
            name="editedContent"
            id="editedContent"
            value={editedContent}
            onChange={handleTextareaChange}
            className={styles.modalInput}
            rows={4}
          >
            {editedContent}
          </textarea>
          <div className={styles.buttonsContainer}>
            <button
              onClick={() => handleValidate(editedContent)}
              className={[styles.button, styles.validateButton].join(" ")}
            >
              Valider
            </button>
            {handleDelete !== undefined && (
              <button
                onClick={handleDelete}
                className={[styles.button, styles.cancelButton].join(" ")}
              >
                Supprimer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepasLineModal;
