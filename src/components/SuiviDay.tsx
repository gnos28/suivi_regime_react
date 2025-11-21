import { useSuiviRegime } from "../hooks/useSuiviRegime";
import RepasSection from "./RepasSection";
import styles from "./SuiviDay.module.scss";

const SuiviDay = () => {
  const { selectedSuiviDay } = useSuiviRegime();

  return (
    <div className={styles.suiviDayContainer}>
      <RepasSection
        title="Matin"
        dayTimeCol="matin"
        content={selectedSuiviDay?.matin}
      />
      <RepasSection
        title="Midi"
        dayTimeCol="midi"
        content={selectedSuiviDay?.midi}
      />
      <RepasSection
        title="Goûter"
        dayTimeCol="goûter"
        content={selectedSuiviDay?.goûter}
      />
      <RepasSection
        title="Soir"
        dayTimeCol="soir"
        content={selectedSuiviDay?.soir}
      />
    </div>
  );
};

export default SuiviDay;
