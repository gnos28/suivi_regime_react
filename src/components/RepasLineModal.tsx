import { useEffect, useState } from "react";
import styles from "./RepasLineModal.module.scss";
import modalStyles from "../styles/modal.module.scss";
import levenshtein from "fast-levenshtein";
import { useSuiviRegime } from "../hooks/useSuiviRegime";
import { globales, type DatabaseColName } from "../types/globales";
import { calcDonutGroups } from "../utils/calcDonutGroups";
import type { DatabaseExtended } from "../types/databaseExtended";

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
    setEditedContent(e.target.value);
    if (selectedTab !== "autocompletion") setSelectedTab("autocompletion");
  };

  const donutGroups = calcDonutGroups({
    database: databaseExtended,
    selectedSuiviDay,
    targets,
  }).flat();

  const NutrimentItem = ({ colName }: { colName: DatabaseColName }) => {
    if (!nutrimentsResume) return null;

    const donutGroupItem = donutGroups.find((item) => item.name === colName);

    const valueFormatted = (value: number | string) => {
      if (!donutGroupItem) return value;

      if (
        typeof value === "number" &&
        donutGroupItem.unitDecimals !== undefined
      ) {
        return value.toFixed(donutGroupItem.unitDecimals);
      }

      return value;
    };

    const backgroundColor = donutGroupItem?.colorValue ?? "transparent";
    const name = donutGroupItem?.nameAbbr ?? colName;
    const value = valueFormatted(nutrimentsResume[colName] ?? "N/A");

    return (
      <div
        key={colName}
        className={styles.nutrimentItem}
        style={{ backgroundColor }}
      >
        <span>{name}</span>
        <span>{value}</span>
      </div>
    );
  };

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
          const includesEditedContent = name
            .toLowerCase()
            .includes(editedContent.toLowerCase());

          return {
            line: name,
            distance:
              (includesEditedContent ? -20 : 0) +
              levenshtein.get(editedContent.toLowerCase(), name.toLowerCase()),
          };
        })
        .sort((a, b) => a.distance - b.distance);

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
                {autocompletion.slice(0, 7).map((autocompletion, index) => (
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

        <div className={styles.nutrimentsSection}>
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
                  <NutrimentItem key={colName} colName={colName} />
                ))}
            </div>
          ) : (
            <div className={styles.nutrimentsContainer}>
              <h3>Aucune information nutritionnelle disponible</h3>
            </div>
          )}
        </div>

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
