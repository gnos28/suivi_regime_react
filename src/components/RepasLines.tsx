import { useState } from "react";
import EditRepasLine from "./EditRepasLine";
import style from "./RepasLines.module.scss";
import { fetchUpdateSuiviDay } from "../api/fetchUpdateSuiviDay";
import { convertDateToString, removeAccents } from "../utils/utils";

type RepasLinesProps = {
  text: string | number | undefined;
  dayTimeCol: "matin" | "midi" | "goûter" | "soir";
};

const RepasLines = ({ text, dayTimeCol }: RepasLinesProps) => {
  const today = new Date();

  const [splitText, setSplitText] = useState<string[]>(
    (text ?? "")
      .toString()
      .split("\n")
      .filter((textLine) => textLine.trim() !== "")
  );

  const handleEditLine = (index: number) => (newLine: string) => {
    if (newLine.trim() === "") return;

    const updatedLines = [...splitText];
    updatedLines[index] = newLine;
    setSplitText(updatedLines);
    fetchUpdateSuiviDay({
      date: convertDateToString(today),
      [removeAccents(dayTimeCol)]: updatedLines.join("\n"),
    });
  };

  return (
    <>
      {splitText.map((line, index) => (
        <span key={index} className={style.repasLine}>
          <EditRepasLine
            line={line}
            handleEditLine={handleEditLine(index)}
            dayTimeCol={dayTimeCol}
          />
        </span>
      ))}
    </>
  );
};

export default RepasLines;
