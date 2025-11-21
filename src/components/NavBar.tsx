import styles from "./NavBar.module.scss";
import { useSuiviRegime } from "../hooks/useSuiviRegime";

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

const NavBar = () => {
  const { selectedDay, refreshAllData, isLoading } = useSuiviRegime();

  const foodEmoji = foodEmojis[selectedDay.getTime() % foodEmojis.length];

  const callGeminiAndRefresh = async () => {
    await refreshAllData({ callGemini: true });
  };

  return (
    <div className={styles.navBarContainer}>
      <h1>📊</h1>
      <h1>{foodEmoji}</h1>
      <h1 onClick={callGeminiAndRefresh}>
        <span className={isLoading ? styles.rotatingIcon : ""}>
          {isLoading ? "⏳" : "🔁"}
        </span>
      </h1>
    </div>
  );
};

export default NavBar;
