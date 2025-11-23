import { useEffect, useState } from "react";
import { useSuiviRegime } from "../../hooks/useSuiviRegime";
import styles from "./RepasLineModal.module.scss";

type RecentsProps = {
  dayTimeCol: "matin" | "midi" | "goûter" | "soir";
  setEditedContent: (content: string) => void;
  editedContent: string;
};

const dayTimeRules: Record<
  RecentsProps["dayTimeCol"],
  RecentsProps["dayTimeCol"][]
> = {
  matin: ["matin", "goûter"],
  midi: ["midi", "soir"],
  goûter: ["goûter", "matin"],
  soir: ["soir", "midi"],
};

const NB_DAYS_FOR_RECENT = 3;

const Recents = ({
  dayTimeCol,
  setEditedContent,
  editedContent,
}: RecentsProps) => {
  const [recentAliments, setRecentAliments] = useState<string[]>([]);
  const { suiviDays, selectedDay } = useSuiviRegime();
  useEffect(() => {
    const calcRecentAliments = () => {
      const minDate = selectedDay
        ? new Date(
            selectedDay.getTime() - NB_DAYS_FOR_RECENT * 24 * 60 * 60 * 1000
          )
        : new Date(0);

      const newRecentsAliments = [
        ...new Set(
          dayTimeRules[dayTimeCol]
            .map((col) => {
              return suiviDays
                .reverse()
                .filter(
                  (suiviDay) =>
                    new Date(suiviDay.date).getTime() >= minDate.getTime() &&
                    new Date(suiviDay.date).getTime() <= selectedDay.getTime()
                )
                .map((suiviDay) => suiviDay[col].toString().split("\n"));
            })
            .flat(2)
            .filter((aliment) => aliment.trim() !== "")
        ),
      ];

      setRecentAliments(newRecentsAliments);
    };

    calcRecentAliments();
  }, [suiviDays, dayTimeCol, selectedDay]);

  return (
    <div className={styles.suggestionsContainer}>
      <div>
        {recentAliments.slice(0, 7).map((suggestion, index) => (
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

export default Recents;
