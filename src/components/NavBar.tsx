import { useContext, useState } from "react";
import { fetchDatabase } from "../api/fetchDatabase";
import { fetchSuiviDays } from "../api/fetchSuiviDays";
import { fetchTargets } from "../api/fetchTargets";
import styles from "./NavBar.module.scss";
import DatabaseContext from "../contexts/databaseContext";
import SuiviDaysContext from "../contexts/suiviDaysContext";
import TargetsContext from "../contexts/targetsContext";
import { fetchRefresh } from "../api/fetchRefresh";

const foodEmojis = [
  "🥖",
  "🍎",
  "🍗",
  "🥦",
  "🍳",
  "🍲",
  "🍰",
  "🍩",
  "🍿",
  "🍔",
  "🍜",
  "🧇",
  "🍣",
];

type NavBarProps = {
  today: Date;
};

const NavBar = ({ today }: NavBarProps) => {
  const { setDatabase } = useContext(DatabaseContext);
  const { setSuiviDays } = useContext(SuiviDaysContext);
  const { setTargets } = useContext(TargetsContext);

  const [pendingRefresh, setPendingRefresh] = useState(false);

  const foodEmoji = foodEmojis[today.getTime() % foodEmojis.length];

  const refresh = async () => {
    if (pendingRefresh) return;
    setPendingRefresh(true);
    const result = await fetchRefresh();

    if (result !== "OK") {
      console.error("Refresh failed");
      return;
    }
    await fetchSuiviDays(setSuiviDays);
    await fetchDatabase(setDatabase);
    await fetchTargets(setTargets);
    setPendingRefresh(false);
  };

  return (
    <div className={styles.navBarContainer}>
      <h1>📊</h1>
      <h1>{foodEmoji}</h1>
      <h1 onClick={refresh}>
        <span className={pendingRefresh ? styles.rotatingIcon : ""}>
          {pendingRefresh ? "⏳" : "🔁"}
        </span>
      </h1>
    </div>
  );
};

export default NavBar;
