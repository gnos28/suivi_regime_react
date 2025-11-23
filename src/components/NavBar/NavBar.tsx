import styles from "./NavBar.module.scss";
import { useSuiviRegime } from "../../hooks/useSuiviRegime";
import { useContext, useState } from "react";
import ActiveMenuContext from "../../contexts/activeMenuContext";

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
          styles.pngDropShadow,
        ].join(" ")}
        draggable={false}
      />
      <img
        src="/fork-and-knife.svg"
        alt="Gemini Icon"
        width={34}
        height={34}
        className={styles.forkAndKnife}
        draggable={false}
      />
    </div>
  );
};

const NavBar = () => {
  const { selectedDay, refreshAllData, isLoading } = useSuiviRegime();
  const { activeMenu, setActiveMenu } = useContext(ActiveMenuContext);

  const foodEmoji = foodEmojis[selectedDay.getTime() % foodEmojis.length];

  const callGeminiAndRefresh = async () => {
    await refreshAllData({ callGemini: true });
  };

  return (
    <div className={styles.navBarContainer}>
      <div
        className={[
          styles.circle,
          activeMenu === "charts"
            ? styles.pressedCircle
            : styles.unpressedCircle,
        ].join(" ")}
        onClick={() => setActiveMenu("charts")}
      >
        <h1>📊</h1>
      </div>
      <div
        className={[
          styles.circle,
          activeMenu === "repas"
            ? styles.pressedCircle
            : styles.unpressedCircle,
        ].join(" ")}
        onClick={() => setActiveMenu("repas")}
      >
        <h1 className={styles.foodEmoji}>{foodEmoji}</h1>
      </div>
      <div
        className={[
          styles.circle,
          activeMenu === "mood" ? styles.pressedCircle : styles.unpressedCircle,
        ].join(" ")}
        onClick={() => setActiveMenu("mood")}
      >
        <h1>
          <img
            src="/mood_emoji.webp"
            alt="Mood Icon"
            width={34}
            height={34}
            className={[styles.moodIcon, styles.pngDropShadow].join(" ")}
            draggable={false}
          />
        </h1>
      </div>
      <div
        className={[
          styles.circle,
          activeMenu === "gemini"
            ? styles.pressedCircle
            : styles.unpressedCircle,
        ].join(" ")}
        onClick={() => setActiveMenu("gemini")}
      >
        <h1 onClick={callGeminiAndRefresh}>
          <GeminiIcon isLoading={isLoading} />
          {/* <span className={isLoading ? styles.rotatingIcon : ""}>
          {isLoading ? "⏳" : "🔁"} 
        </span> */}
        </h1>
      </div>
    </div>
  );
};

export default NavBar;
