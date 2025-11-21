import { useState } from "react";
import EditRepasLine from "./EditRepasLine";
import style from "./RepasLines.module.scss";
import { useSuiviRegime } from "../hooks/useSuiviRegime";

type RepasLinesProps = {
  text: string | number | undefined;
  dayTimeCol: "matin" | "midi" | "goûter" | "soir";
};

const RepasLines = ({ text, dayTimeCol }: RepasLinesProps) => {
  const { handleEditLine } = useSuiviRegime();

  const [splitText, setSplitText] = useState<string[]>(
    (text ?? "")
      .toString()
      .split("\n")
      .filter((textLine) => textLine.trim() !== "")
  );

  return (
    <>
      {splitText.map((line, index) => (
        <span key={index} className={style.repasLine}>
          <EditRepasLine
            line={line}
            handleEditLine={handleEditLine({
              dayTimeCol,
              splitText,
              setSplitText,
            })(index)}
            dayTimeCol={dayTimeCol}
          />
        </span>
      ))}
    </>
  );
};

export default RepasLines;
