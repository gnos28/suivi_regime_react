import { useEffect, useState } from "react";
import { useSuiviRegime } from "../../hooks/useSuiviRegime";
import styles from "./RepasLineModal.module.scss";
import { extractQuantityFromText, removeBracketsFromText } from "../../utils/textUtils";

type HabitudesProps = {
  dayTimeCol: "matin" | "midi" | "goûter" | "soir";
  setEditedContent: (content: string) => void;
  editedContent: string;
};

const Habitudes = ({
  dayTimeCol,
  setEditedContent,
  editedContent,
}: HabitudesProps) => {
  const [mostUsedAliments, setMostUsedAliments] = useState<string[]>([]);
  const { suiviDays } = useSuiviRegime();
  useEffect(() => {
    const calcMostUsedAliments = () => {
      const alimentCount: Record<string, number> = {};

      suiviDays.forEach((day) => {
        const repas = day[dayTimeCol];

        if (typeof repas === "string") {
          const aliments = repas.split("\n");
          aliments.forEach((aliment) => {
            const trimmedAliment = removeBracketsFromText(aliment);
            const quantity = extractQuantityFromText(aliment);
            if (trimmedAliment.length > 0) {
              if (Object.keys(alimentCount).includes(trimmedAliment) === false)
                alimentCount[trimmedAliment] = quantity;
              else alimentCount[trimmedAliment] += quantity;
            }
          });
        }
      });

      const sortedAliments = Object.entries(alimentCount)
        .sort((a, b) => b[1] - a[1])
        .map(([aliment]) => aliment)
        .filter((aliment) => aliment !== "-");

      setMostUsedAliments(sortedAliments.slice(0, 30));
    };

    calcMostUsedAliments();
  }, [suiviDays, dayTimeCol]);

  return (
    <div className={styles.suggestionsContainer}>
      <div>
        {mostUsedAliments.map((suggestion, index) => (
          <div
            key={index}
            className={[
              styles.suggestionItem,
              suggestion === editedContent ? styles.selectedSuggestion : "",
            ].join(" ")}
            onClick={() => setEditedContent(suggestion)}
          >
            {suggestion}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Habitudes;
