import React, { useContext } from "react";
import styles from "./HeaderDate.module.scss";
import type { SuiviColName } from "../types/globales";
import { calcColumnTotal } from "../utils/calcColumnTotal";
import DatabaseContext from "../contexts/databaseContext";
import Donut from "./Donut";

type HeaderDateProps = {
  today: Date;
  suiviDay: Record<SuiviColName, string | number | undefined> | undefined;
};

const HeaderDate = ({ today, suiviDay }: HeaderDateProps) => {
  const { database } = useContext(DatabaseContext);

  const calcColumnTotalDay = calcColumnTotal({
    periods: [
      suiviDay?.matin?.toString() ?? "",
      suiviDay?.midi?.toString() ?? "",
      suiviDay?.goûter?.toString() ?? "",
      suiviDay?.soir?.toString() ?? "",
    ],
    database: database,
  });

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
          target={2300}
          colorValue="rgba(255, 99, 132, 0.2)"
          colorTarget="rgba(54, 162, 235, 0.2)"
          textLines={[
            "Calories",
            `${calcColumnTotalDay("Calories")} / 2300 kcal`,
          ]}
        />
        <Donut
          value={calcColumnTotalDay("Proteines")}
          target={50}
          colorValue="rgba(75, 192, 192, 0.2)"
          colorTarget="rgba(153, 102, 255, 0.2)"
          textLines={["Proteines", `${calcColumnTotalDay("Proteines")} / 50 g`]}
        />
        <Donut
          value={calcColumnTotalDay("Glucides")}
          target={300}
          colorValue="rgba(255, 206, 86, 0.2)"
          colorTarget="rgba(255, 159, 64, 0.2)"
          textLines={["Glucides", `${calcColumnTotalDay("Glucides")} / 300 g`]}
        />
        <Donut
          value={calcColumnTotalDay("Lipides")}
          target={70}
          colorValue="rgba(54, 162, 235, 0.2)"
          colorTarget="rgba(255, 99, 132, 0.2)"
          textLines={["Lipides", `${calcColumnTotalDay("Lipides")} / 70 g`]}
        />
      </div>
    </h2>
  );
};

export default HeaderDate;
