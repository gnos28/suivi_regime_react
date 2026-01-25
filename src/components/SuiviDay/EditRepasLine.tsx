import { useState } from "react";
import styles from "./EditRepasLine.module.scss";
import buttonStyles from "../../styles/button.module.scss";
import RepasLineModal from "../RepasLineModal/RepasLineModal";
import { useSuiviRegime } from "../../hooks/useSuiviRegime";
import {
  extractQuantityFromText,
  removeBracketsFromText,
} from "../../utils/textUtils";

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
    (item) =>
      item.aliment.toString().toLowerCase() ===
      removeBracketsFromText(line.toLowerCase()),
  );

  const quantity = extractQuantityFromText(line);

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
        <span className={styles.editIconContainer}>
          {quantity !== 1 ? (
            <>
              <span className={styles.editIconWithQuantity}>✏️</span>
              <span className={styles.quantity}>
                {quantity !== 1 ? `x${quantity}` : ""}
              </span>
            </>
          ) : (
            <span>✏️</span>
          )}
        </span>
      </div>
      <span className={styles.repasLine}>{removeBracketsFromText(line)}</span>
      {isInDatabase === false && (
        <div className={styles.notInDatabase}>
          <img src="/gemini256.webp" width={24} height={24} />
        </div>
      )}
    </div>
  );
};

export default EditRepasLine;
