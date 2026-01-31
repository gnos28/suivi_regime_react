import levenshtein from "fast-levenshtein";
import { useEffect, useState } from "react";
import { useSuiviRegime } from "../../hooks/useSuiviRegime";
import styles from "./Autocompletion.module.scss";

type AutocompletionProps = {
  editedContent: string;
  onSelect: (content: string) => void;
};

const normalize = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const Autocompletion = ({ editedContent, onSelect }: AutocompletionProps) => {
  const [autocompletion, setAutocompletion] = useState<string[]>([]);

  const { databaseExtended } = useSuiviRegime();

  const handleSuggestionClick = (suggestion: string) => {
    onSelect(suggestion);
  };

  useEffect(() => {
    const computeAutocompletion = () => {
      if (editedContent.trim().length === 0) {
        setAutocompletion([]);
        return;
      }

      const splitedEditedContent = normalize(editedContent)
        .toLowerCase()
        .split(/[^a-z0-9]/)
        .filter((str) => str.length > 2);

      const distances: { line: string; distance: number }[] = [
        ...new Set(
          databaseExtended
            .map((item) => item.aliment.toString())
            .filter((name) => name.length > 0 && name !== "-"),
        ),
      ]
        .map((name) => {
          const includesEditedContentScore = splitedEditedContent.reduce(
            (acc, curr) => {
              const score = normalize(name).toLowerCase().includes(curr)
                ? 200
                : 0;

              return acc + score;
            },
            0,
          );

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
    <>
      <div
        className={styles.overtopMask}
        onClick={() => onSelect(editedContent)}
      />
      <div className={styles.topMask} onClick={() => onSelect(editedContent)} />
      <div
        className={styles.bottomMask}
        onClick={() => onSelect(editedContent)}
      />
      <div
        className={styles.leftMask}
        onClick={() => onSelect(editedContent)}
      />
      <div
        className={styles.rightMask}
        onClick={() => onSelect(editedContent)}
      />
      <div className={styles.autocompletionsContainer}>
        <div>
          {autocompletion
            .slice(0, 20)
            .reverse()
            .map((autocompletion, index) => (
              <div
                key={index}
                className={[
                  styles.autocompletionItem,
                  autocompletion === editedContent
                    ? styles.selectedAutocompletion
                    : "",
                ].join(" ")}
                onClick={() => handleSuggestionClick(autocompletion)}
              >
                {autocompletion}
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Autocompletion;
