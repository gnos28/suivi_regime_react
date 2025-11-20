import type { SuiviColName } from "../types/globales";
import RepasSection from "./RepasSection";
import styles from "./SuiviDay.module.scss";

type SuiviDayProps = {
  suiviDay: Record<SuiviColName, string | number>;
};

const SuiviDay = ({ suiviDay }: SuiviDayProps) => {
  return (
    <div className={styles.suiviDayContainer}>
      <RepasSection title="Matin" dayTimeCol="matin" content={suiviDay.matin} />
      <RepasSection title="Midi" dayTimeCol="midi" content={suiviDay.midi} />
      <RepasSection
        title="Goûter"
        dayTimeCol="goûter"
        content={suiviDay.goûter}
      />
      <RepasSection title="Soir" dayTimeCol="soir" content={suiviDay.soir} />
    </div>
  );
};

export default SuiviDay;
