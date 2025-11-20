import { useState } from "react";
import styles from "./EditRepasLine.module.scss";
import RepasLineModal from "./RepasLineModal";

type EditRepasLineProps = {
  line: string;
  handleEditLine: (newLine: string) => void;
  dayTimeCol: "matin" | "midi" | "goûter" | "soir";
};

const EditRepasLine = ({
  line,
  handleEditLine,
  dayTimeCol,
}: EditRepasLineProps) => {
  const [editing, setEditing] = useState(false);

  const handleValidate = (content: string) => {
    setEditing(false);
    handleEditLine(content);
  };

  return (
    <div className={styles.editRepasLineContainer}>
      {editing === true && (
        <RepasLineModal
          content={line}
          setEditing={setEditing}
          handleValidate={handleValidate}
          dayTimeCol={dayTimeCol}
        />
      )}

      <div onClick={() => setEditing(true)} className={styles.editButton}>
        ✏️
      </div>
      <span className={styles.repasLine}>{line}</span>
    </div>
  );
};

export default EditRepasLine;
