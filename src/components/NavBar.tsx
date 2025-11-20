import styles from "./NavBar.module.scss";

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
  const foodEmoji = foodEmojis[today.getTime() % foodEmojis.length];

  return (
    <div className={styles.navBarContainer}>
      <h1>📊</h1>
      <h1>{foodEmoji}</h1>
      <h1>🔁</h1>
    </div>
  );
};

export default NavBar;
