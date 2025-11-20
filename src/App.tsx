/* eslint-disable react-hooks/set-state-in-effect */
import { useContext, useEffect } from "react";
import styles from "./App.module.scss";
import axios from "axios";
import type { DatabaseColName, SuiviColName } from "./types/globales";
import { convertJsonStringToDate, convertDateToString } from "./utils/utils";
import SuiviDay from "./components/SuiviDay";
import HeaderDate from "./components/HeaderDate";
import NavBar from "./components/NavBar";
import DatabaseContext from "./contexts/databaseContext";
import SuiviDaysContext from "./contexts/suiviDaysContext";

const password = import.meta.env.VITE_SUIVI_PASSWORD || "";

function App() {
  const { setDatabase } = useContext(DatabaseContext);
  const { setSuiviDays, suiviDays } = useContext(SuiviDaysContext);

  const today = new Date();

  const fetchSuiviDays = async () => {
    const response = await axios.post<Record<SuiviColName, string | number>[]>(
      "https://script.google.com/macros/s/AKfycbwfS4pf5wsLEE8gFEdx--1IOOLoMWu-xXOJHtoyG99cqcyzvPGh5c10Fiwk3c7czQQ/exec",
      {
        password,
        method: "getSuiviDays",
      },
      {
        withCredentials: false,
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
      }
    );

    if (response.status === 200) {
      setSuiviDays(response.data);
    }
  };

  const fetchDatabase = async () => {
    const response = await axios.post<
      Record<DatabaseColName, string | number>[]
    >(
      "https://script.google.com/macros/s/AKfycbwfS4pf5wsLEE8gFEdx--1IOOLoMWu-xXOJHtoyG99cqcyzvPGh5c10Fiwk3c7czQQ/exec",
      {
        password,
        method: "getDatabase",
      },
      {
        withCredentials: false,
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
      }
    );

    if (response.status === 200) {
      setDatabase(response.data);
    }
  };

  useEffect(() => {
    fetchSuiviDays();
    fetchDatabase();
  }, []);

  const suiviToday = suiviDays.find(
    (suiviDay) =>
      convertDateToString(convertJsonStringToDate(suiviDay.date)) ===
      convertDateToString(today)
  );

  return (
    <div className={styles.appContainer}>
      <HeaderDate today={today} suiviDay={suiviToday} />
      {suiviToday && <SuiviDay suiviDay={suiviToday} />}
      <NavBar today={today} />
    </div>
  );
}

export default App;
