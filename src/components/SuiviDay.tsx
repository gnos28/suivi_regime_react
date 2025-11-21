import RepasSection from "./RepasSection";
import styles from "./SuiviDay.module.scss";

const SuiviDay = () => {
  return (
    <div className={styles.suiviDayContainer}>
      <RepasSection title="Matin" dayTimeCol="matin" />
      <RepasSection title="Midi" dayTimeCol="midi" />
      <RepasSection title="Goûter" dayTimeCol="goûter" />
      <RepasSection title="Soir" dayTimeCol="soir" />
    </div>
  );
};

export default SuiviDay;
