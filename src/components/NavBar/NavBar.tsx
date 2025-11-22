import styles from "./NavBar.module.scss";
import { useSuiviRegime } from "../../hooks/useSuiviRegime";

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

const GeminiIcon = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <div className={styles.geminiIconContainer}>
      <img
        src="/gemini256.webp"
        alt="Gemini Icon"
        width={34}
        height={34}
        className={[
          styles.geminiIcon,
          isLoading ? styles.rotatingIcon : "",
        ].join(" ")}
      />
      <img
        src="/fork-and-knife.svg"
        alt="Gemini Icon"
        width={34}
        height={34}
        className={styles.forkAndKnife}
      />
    </div>
  );
};

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
        <GeminiIcon isLoading={isLoading} />
        {/* <span className={isLoading ? styles.rotatingIcon : ""}>
          {isLoading ? "⏳" : "🔁"} 
        </span> */}
      </h1>
    </div>
  );
};

export default NavBar;
