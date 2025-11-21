import { useEffect, useState } from "react";
import styles from "./RepasLineModal.module.scss";
import modalStyles from "../styles/modal.module.scss";
import levenshtein from "fast-levenshtein";
import { useSuiviRegime } from "../hooks/useSuiviRegime";

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
  const { database, suiviDays } = useSuiviRegime();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [mostUsedAliments, setMostUsedAliments] = useState<string[]>([]);

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
    const computeSuggestions = () => {
      if (editedContent.trim().length === 0) {
        setSuggestions([]);
        return;
      }

      const distances: { line: string; distance: number }[] = [
        ...new Set(
          database
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

      const topSuggestions = distances
        .filter((item) => item.distance <= 15)
        .map((item) => item.line);

      setSuggestions(topSuggestions);
    };

    computeSuggestions();
  }, [editedContent, database]);

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
        <div className={styles.suggestionsContainer}>
          <h2>Mes habitudes</h2>
          <div>
            {mostUsedAliments.slice(0, 7).map((suggestion, index) => (
              <div
                key={index}
                className={styles.suggestionItem}
                onClick={() => setEditedContent(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.suggestionsContainer}>
          <h2>Suggestions</h2>
          <div>
            {suggestions.slice(0, 7).map((suggestion, index) => (
              <div
                key={index}
                className={styles.suggestionItem}
                onClick={() => setEditedContent(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.editContainer}>
          <textarea
            name="editedContent"
            id="editedContent"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
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
