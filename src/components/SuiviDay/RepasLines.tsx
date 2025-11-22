import EditRepasLine from "./EditRepasLine";
import styles from "./RepasLines.module.scss";
import { useSuiviRegime } from "../../hooks/useSuiviRegime";

type RepasLinesProps = {
  splitText: string[];
  dayTimeCol: "matin" | "midi" | "goûter" | "soir";
};

const RepasLines = ({ splitText, dayTimeCol }: RepasLinesProps) => {
  const { handleEditLine, handleRemoveLine } = useSuiviRegime();

  return (
    <>
      {splitText.map((line, index) => (
        <span key={index} className={styles.repasLine}>
          <EditRepasLine
            line={line}
            handleEditLine={handleEditLine({
              dayTimeCol,
              splitText,
              // setSplitText,
            })(index)}
            handleRemoveLine={handleRemoveLine({
              dayTimeCol,
              splitText,
              // setSplitText,
            })(index)}
            dayTimeCol={dayTimeCol}
          />
        </span>
      ))}
    </>
  );
};

export default RepasLines;
