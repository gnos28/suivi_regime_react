/* eslint-disable react-hooks/set-state-in-effect */
import { Suspense, useContext, useEffect, useMemo, useState } from "react";
import styles from "./App.module.scss";
import { convertJsonStringToDate, convertDateToString } from "./utils/utils";
import SuiviDay from "./components/SuiviDay";
import HeaderDate from "./components/HeaderDate";
import NavBar from "./components/NavBar";
import DatabaseContext from "./contexts/databaseContext";
import SuiviDaysContext from "./contexts/suiviDaysContext";
import TargetsContext from "./contexts/targetsContext";
import { fetchTargets } from "./api/fetchTargets";
import { fetchSuiviDays } from "./api/fetchSuiviDays";
import { fetchDatabase } from "./api/fetchDatabase";
import type { SuiviColName } from "./types/globales";

function App() {
  const { setDatabase } = useContext(DatabaseContext);
  const { setSuiviDays, suiviDays } = useContext(SuiviDaysContext);
  const { setTargets } = useContext(TargetsContext);

  const [suiviToday, setSuiviToday] = useState<
    Record<SuiviColName, string | number> | undefined
  >(undefined);

  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    fetchSuiviDays(setSuiviDays);
    fetchDatabase(setDatabase);
    fetchTargets(setTargets);
  }, [setDatabase, setSuiviDays, setTargets]);

  useEffect(() => {
    const suiviToday = suiviDays.find(
      (suiviDay) =>
        convertDateToString(convertJsonStringToDate(suiviDay.date)) ===
        convertDateToString(today)
    );
    setSuiviToday(suiviToday);
  }, [suiviDays, today]);

  return (
    <div className={styles.appContainer}>
      <HeaderDate today={today} suiviDay={suiviToday} />
      <Suspense fallback={<div>Loading...</div>}>
        {suiviToday !== undefined && <SuiviDay suiviDay={suiviToday} />}
      </Suspense>
      <NavBar today={today} />
    </div>
  );
}

export default App;
