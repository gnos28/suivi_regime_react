import React, { useContext, useEffect, useState } from "react";
import styles from "./RepasLineModal.module.scss";
import DatabaseContext from "../contexts/databaseContext";
import levenshtein from "fast-levenshtein";
import SuiviDaysContext from "../contexts/suiviDaysContext";

type RepasLineModalProps = {
  setEditing: (editing: boolean) => void;
  handleValidate: (content: string) => void;
  content: string;
  dayTimeCol: "matin" | "midi" | "goûter" | "soir";
};

const RepasLineModal = ({
  setEditing,
  handleValidate,
  content,
  dayTimeCol,
}: RepasLineModalProps) => {
  const [editedContent, setEditedContent] = useState(content);
  const { database } = useContext(DatabaseContext);
  const { suiviDays } = useContext(SuiviDaysContext);
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
      const distances: { line: string; distance: number }[] = [
        ...new Set(
          database
            .map((item) => item.aliment.toString())
            .filter((name) => name.length > 0)
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
      className={styles.modalBackground}
      onClick={() => {
        console.log("close modal");
        
        setEditing(false);
      }}
    >
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.suggestionsContainer}>
          <h2>Mes habitudes</h2>
          {mostUsedAliments.slice(0, 5).map((suggestion, index) => (
            <div
              key={index}
              className={styles.suggestionItem}
              onClick={() => setEditedContent(suggestion)}
            >
              {suggestion}
            </div>
          ))}
          <h2>Suggestions</h2>
          {suggestions.slice(0, 5).map((suggestion, index) => (
            <div
              key={index}
              className={styles.suggestionItem}
              onClick={() => setEditedContent(suggestion)}
            >
              {suggestion}
            </div>
          ))}
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
            <button
              onClick={() => setEditing(false)}
              className={[styles.button, styles.cancelButton].join(" ")}
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepasLineModal;
