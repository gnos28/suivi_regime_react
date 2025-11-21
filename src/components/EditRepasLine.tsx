import { useState } from "react";
import styles from "./EditRepasLine.module.scss";
import buttonStyles from "../styles/button.module.scss";
import RepasLineModal from "./RepasLineModal";
import { useSuiviRegime } from "../hooks/useSuiviRegime";

type EditRepasLineProps = {
  line: string;
  handleEditLine: (newLine: string) => void;
  handleRemoveLine: () => void;
  dayTimeCol: "matin" | "midi" | "goûter" | "soir";
};

const EditRepasLine = ({
  line,
  handleEditLine,
  handleRemoveLine,
  dayTimeCol,
}: EditRepasLineProps) => {
  const { database } = useSuiviRegime();
  const [editing, setEditing] = useState(false);

  const isInDatabase = database.some(
    (item) => item.aliment.toString().toLowerCase() === line.toLowerCase()
  );

  const handleValidate = (content: string) => {
    setEditing(false);
    handleEditLine(content);
  };

  const handleDelete = () => {
    setEditing(false);
    handleRemoveLine();
  };

  return (
    <div className={styles.editRepasLineContainer}>
      {editing === true && (
        <RepasLineModal
          content={line}
          setEditing={setEditing}
          handleValidate={handleValidate}
          handleDelete={handleDelete}
          dayTimeCol={dayTimeCol}
        />
      )}

      <div
        onClick={() => setEditing(true)}
        className={[buttonStyles.btnGrad, styles.editButton].join(" ")}
      >
        <span>✏️</span>
      </div>
      <span className={styles.repasLine}>{line}</span>
      {isInDatabase === false && (
        <div className={styles.notInDatabase}>
          <img src="/gemini256.webp" width={24} height={24} />
        </div>
      )}
    </div>
  );
};

export default EditRepasLine;
