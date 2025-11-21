import React, { useContext, useEffect, useState } from "react";
import styles from "./HeaderDate.module.scss";
import { globales, type SuiviColName } from "../types/globales";
import { calcColumnTotal } from "../utils/calcColumnTotal";
import DatabaseContext from "../contexts/databaseContext";
import Donut from "./Donut";
import TargetsContext from "../contexts/targetsContext";

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

type HeaderDateProps = {
  today: Date;
  suiviDay: Record<SuiviColName, string | number | undefined> | undefined;
};

const HeaderDate = ({ today, suiviDay }: HeaderDateProps) => {
  const { database } = useContext(DatabaseContext);
  const { targets } = useContext(TargetsContext);
  const [carences, setCarences] = useState<Carence[]>([]);

  const calcCarences = () => {
    const nutrimentsData = globales.nutrimentsColNames.map((nutriment) => {
      const dayValue = suiviDay?.[nutriment]
        ? parseFloat((suiviDay?.[nutriment] ?? 0).toString())
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
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    calcCarences();
  }, [suiviDay]);

  // const excesses = nutrimentsData
  //   .filter((item) => item.excess !== null)
  //   .filter((item) => (item.excess ?? 0) > 1)
  //   .sort((a, b) => {
  //     if (a.excess === null) return 0;
  //     if (b.excess === null) return 0;
  //     return a.excess - b.excess;
  //   });

  const calcColumnTotalDay = calcColumnTotal({
    periods: [
      suiviDay?.matin?.toString() ?? "",
      suiviDay?.midi?.toString() ?? "",
      suiviDay?.goûter?.toString() ?? "",
      suiviDay?.soir?.toString() ?? "",
    ],
    database: database,
  });

  const targetCalories = parseFloat(
    targets.find((target) => target.targetName === "Calories")?.min ?? "0"
  );

  const targetProteines = parseFloat(
    targets.find((target) => target.targetName === "Proteines")?.min ?? "0"
  );

  const targetGlucides = parseFloat(
    targets.find((target) => target.targetName === "Glucides")?.min ?? "0"
  );

  const targetLipides = parseFloat(
    targets.find((target) => target.targetName === "Lipides")?.min ?? "0"
  );

  return (
    <h2 className={styles.headerDate}>
      {today.toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
      <div className={styles.nutritionTotals}>
        <Donut
          value={calcColumnTotalDay("Calories")}
          target={targetCalories}
          colorValue="rgba(44, 44, 44, 0.2)"
          colorTarget="rgba(172, 172, 172, 0.2)"
          textLines={[
            "Calories",
            `${calcColumnTotalDay("Calories").toFixed(
              0
            )} / ${targetCalories} kcal`,
          ]}
        />
        <Donut
          value={calcColumnTotalDay("Proteines")}
          target={targetProteines}
          colorValue="rgba(70, 92, 255, 0.2)"
          colorTarget="rgba(167, 178, 255, 0.2)"
          textLines={[
            "Proteines",
            `${calcColumnTotalDay("Proteines").toFixed(
              1
            )} / ${targetProteines} g`,
          ]}
        />
        <Donut
          value={calcColumnTotalDay("Glucides")}
          target={targetGlucides}
          colorValue="rgba(255, 217, 45, 0.35)"
          colorTarget="rgba(255, 233, 161, 0.2)"
          textLines={[
            "Glucides",
            `${calcColumnTotalDay("Glucides").toFixed(
              1
            )} / ${targetGlucides} g`,
          ]}
        />
        <Donut
          value={calcColumnTotalDay("Lipides")}
          target={targetLipides}
          colorValue="rgba(235, 54, 54, 0.2)"
          colorTarget="rgba(255, 192, 192, 0.2)"
          textLines={[
            "Lipides",
            `${calcColumnTotalDay("Lipides").toFixed(1)} / ${targetLipides} g`,
          ]}
        />
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
