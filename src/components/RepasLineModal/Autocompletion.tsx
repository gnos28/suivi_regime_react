import levenshtein from "fast-levenshtein";
import { useEffect, useState } from "react";
import { useSuiviRegime } from "../../hooks/useSuiviRegime";
import styles from "./RepasLineModal.module.scss";

type AutocompletionProps = {
  editedContent: string;
  setEditedContent: (content: string) => void;
};

const Autocompletion = ({
  editedContent,
  setEditedContent,
}: AutocompletionProps) => {
  const [autocompletion, setAutocompletion] = useState<string[]>([]);

  const { databaseExtended } = useSuiviRegime();

  useEffect(() => {
    const computeAutocompletion = () => {
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

      const topAutocompletion = distances
        .filter((item) => item.distance <= 15)
        .map((item) => item.line);

      setAutocompletion(topAutocompletion);
    };

    computeAutocompletion();
  }, [editedContent, databaseExtended]);

  return (
    <div className={styles.suggestionsContainer}>
      <div>
        {autocompletion.slice(0, 10).map((autocompletion, index) => (
          <div
            key={index}
            className={[
              styles.suggestionItem,
              autocompletion === editedContent ? styles.selectedSuggestion : "",
            ].join(" ")}
            onClick={() => setEditedContent(autocompletion)}
          >
            {autocompletion}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Autocompletion;
