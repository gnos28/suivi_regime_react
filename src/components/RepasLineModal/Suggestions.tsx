import React, { useEffect } from "react";
import styles from "./RepasLineModal.module.scss";
import type { DatabaseExtended } from "../../types/databaseExtended";
import { calcCarences } from "../../utils/calcCarences";
import { useSuiviRegime } from "../../hooks/useSuiviRegime";

type SuggestionsProps = {
  dayTimeCol: "matin" | "midi" | "goûter" | "soir";
  editedContent: string;
  setEditedContent: (content: string) => void;
};

const Suggestions = ({
  dayTimeCol,
  editedContent,
  setEditedContent,
}: SuggestionsProps) => {
  const [suggestions, setSuggestions] = React.useState<
    { aliment: DatabaseExtended; score: number }[]
  >([]);
  const { databaseExtended, suiviDays, selectedSuiviDay, targets } =
    useSuiviRegime();

  const carences = calcCarences({ selectedSuiviDay, targets });

  useEffect(() => {
    const dayTimeRules: Record<
      SuggestionsProps["dayTimeCol"],
      SuggestionsProps["dayTimeCol"][]
    > = {
      matin: ["matin"],
      midi: ["midi", "soir", "goûter"],
      goûter: ["goûter"],
      soir: ["soir", "midi", "goûter"],
    };

    const updateSuggestions = () => {
      const aliments = [
        ...new Set(
          suiviDays
            .map((suiviDay) => {
              const aliments = dayTimeRules[dayTimeCol]
                .map((col) => suiviDay[col].toString().split("\n"))
                .flat();

              return aliments;
            })
            .flat()
            .map((aliment) => aliment.trim().toLowerCase())
        ),
      ].map((aliment) => {
        databaseExtended.find(
          (item) =>
            item.aliment.toString().toLowerCase() ===
            aliment.trim().toLowerCase()
        );
        return aliment;
      });

      const alimentScores = (
        aliments
          .map((alimentString) => {
            const aliment = databaseExtended.find(
              (item) =>
                item.aliment.toString().toLowerCase() ===
                alimentString.trim().toLowerCase()
            );

            if (!aliment) {
              return { aliment: alimentString, score: 0 };
            }

            const score = carences.reduce((acc: number, carence) => {
              const carenceMultiplier = 1 - (carence.carence ?? 1);

              if (
                carence.nutriment === "Calories" ||
                carence.nutriment === "soluble / insoluble" ||
                carence.nutriment === "Ω3 / Ω6"
              ) {
                const nutrimentScore =
                  carenceMultiplier *
                  aliment.nutrimentVsAverage[carence.nutriment];

                return acc + nutrimentScore;
              }

              const nutrimentScore =
                carenceMultiplier *
                aliment.nutrimentByCalorieVsAverage[carence.nutriment];
              return acc + nutrimentScore;
            }, 0);

            return { aliment, score };
          })
          .filter((aliment) => typeof aliment.aliment !== "string") as {
          aliment: DatabaseExtended;
          score: number;
        }[]
      ).sort((a, b) => b.score - a.score);

      setSuggestions(alimentScores);
    };

    updateSuggestions();
  }, []);

  return (
    <div className={styles.suggestionsContainer}>
      <div>
        {suggestions.slice(0, 10).map((suggestion, index) => (
          <div
            key={index}
            className={[
              styles.suggestionItem,
              suggestion.aliment.aliment === editedContent
                ? styles.selectedSuggestion
                : "",
            ].join(" ")}
            onClick={() => setEditedContent(suggestion.aliment.toString())}
          >
            {suggestion.aliment.aliment}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;
