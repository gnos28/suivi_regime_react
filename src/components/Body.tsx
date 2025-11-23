import RepasSection from "./SuiviDay/RepasSection";
import styles from "./Body.module.scss";
import { useContext } from "react";
import ActiveMenuContext from "../contexts/activeMenuContext";
import Mood from "./Mood/Mood";
import Charts from "./Charts/Charts";

const Body = () => {
  const { activeMenu } = useContext(ActiveMenuContext);

  return (
    <div className={styles.bodyContainer}>
      {activeMenu === "charts" && <Charts />}
      {activeMenu === "repas" && (
        <>
          <RepasSection title="Matin" dayTimeCol="matin" />
          <RepasSection title="Midi" dayTimeCol="midi" />
          <RepasSection title="Goûter" dayTimeCol="goûter" />
          <RepasSection title="Soir" dayTimeCol="soir" />
        </>
      )}
      {activeMenu === "mood" && <Mood />}
    </div>
  );
};

export default Body;
