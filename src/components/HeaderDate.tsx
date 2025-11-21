import { useCallback, useContext, useEffect, useState } from "react";
import styles from "./HeaderDate.module.scss";
import { globales } from "../types/globales";
import Donut from "./Donut";
import { useSuiviRegime } from "../hooks/useSuiviRegime";
import { calcDonutGroups } from "../utils/calcDonutGroups";
import DonutGroupIndexContext from "../contexts/donutGroupIndexContext";

const Carence = ({ nutriment }: { nutriment: string }) => {
  return (
    <div className={styles.carence}>
      ⚠️ <strong>{nutriment}</strong>
    </div>
  );
};

type Carence = {
  nutriment: string;
  carence: number | null;
  excess: number | null;
  dayValue: number;
  min: string | undefined;
  max: string | undefined;
};

const HeaderDate = () => {
  const {
    database,
    targets,
    selectedDay,
    selectedSuiviDay,
    goToPreviousDay,
    goToNextDay,
  } = useSuiviRegime();
  const [carences, setCarences] = useState<Carence[]>([]);
  const { donutGroupIndex, setDonutGroupIndex } = useContext(
    DonutGroupIndexContext
  );

  const calcCarences = useCallback(() => {
    const nutrimentsData = globales.nutrimentsColNames.map((nutriment) => {
      const dayValue = selectedSuiviDay?.[nutriment]
        ? parseFloat((selectedSuiviDay?.[nutriment] ?? 0).toString())
        : 0;
      const min = targets.find(
        (target) => target.targetName === nutriment
      )?.min;
      const max = targets.find(
        (target) => target.targetName === nutriment
      )?.max;

      const carence =
        min !== undefined && isNaN(parseFloat(min)) === false
          ? dayValue / parseFloat(min)
          : null;
      const excess =
        max !== undefined && isNaN(parseFloat(max)) === false
          ? dayValue / parseFloat(max)
          : null;

      return { nutriment, carence, excess, dayValue, min, max };
    });

    const carences = nutrimentsData
      .filter((item) => item.carence !== null)
      .filter((item) => (item.carence ?? 0) < 1)
      .sort((a, b) => {
        if (a.carence === null) return 0;
        if (b.carence === null) return 0;
        return a.carence - b.carence;
      });

    setCarences(carences);
  }, [selectedSuiviDay, targets]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    calcCarences();
  }, [calcCarences, selectedSuiviDay]);

  // const excesses = nutrimentsData
  //   .filter((item) => item.excess !== null)
  //   .filter((item) => (item.excess ?? 0) > 1)
  //   .sort((a, b) => {
  //     if (a.excess === null) return 0;
  //     if (b.excess === null) return 0;
  //     return a.excess - b.excess;
  //   });

  const donutGroups = calcDonutGroups({
    selectedSuiviDay,
    database,
    targets,
  });

  const goToNextDonutGroup = () => {
    const newIndex =
      donutGroupIndex + 1 < donutGroups.length ? donutGroupIndex + 1 : 0;

    setDonutGroupIndex(newIndex);
  };

  return (
    <h2 className={styles.headerDate}>
      <span>
        {selectedDay
          .toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
          .toUpperCase()}
        <div
          className={[styles.changeDayIcon, styles.previousDay].join(" ")}
          onClick={goToPreviousDay}
        >
          <img src="/previous.svg" alt="previous day" width="20" height="20" />
        </div>
        <div
          className={[styles.changeDayIcon, styles.nextDay].join(" ")}
          onClick={goToNextDay}
        >
          <img
            src="/previous.svg"
            alt="previous day"
            width="20"
            height="20"
            className={styles.rotate180}
          />
        </div>
      </span>
      <div className={styles.nutritionTotals} onClick={goToNextDonutGroup}>
        {donutGroups[donutGroupIndex].map((donutItem) => (
          <Donut
            key={donutItem.name}
            value={donutItem.value}
            target={donutItem.target}
            colorValue={donutItem.colorValue}
            colorTarget={donutItem.colorTarget}
            textLines={donutItem.textLines}
          />
        ))}
      </div>
      <div className={styles.carencesContainer}>
        {carences
          .filter((_, index) => index < 3)
          .map((carence) => (
            <Carence key={carence.nutriment} {...carence} />
          ))}
      </div>
    </h2>
  );
};

export default HeaderDate;
