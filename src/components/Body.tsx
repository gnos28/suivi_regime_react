import RepasSection from "./SuiviDay/RepasSection";
import styles from "./Body.module.scss";
import { useContext } from "react";
import ActiveMenuContext from "../contexts/activeMenuContext";
import Mood from "./Mood/Mood";

const Body = () => {
  const { activeMenu } = useContext(ActiveMenuContext);

  return (
    <div className={styles.bodyContainer}>
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
