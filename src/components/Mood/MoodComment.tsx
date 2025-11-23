import React, { useEffect } from "react";
import styles from "./MoodComment.module.scss";
import { useSuiviRegime } from "../../hooks/useSuiviRegime";

const MoodComment = () => {
  const { selectedSuiviDay, handleUpdateComment } = useSuiviRegime();
  const [value, setValue] = React.useState("");

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const updateComment = () => {
    if (!selectedSuiviDay) return;
    handleUpdateComment(value);
  };

  useEffect(() => {
    const updateTextareaValue = () => {
      if (
        selectedSuiviDay &&
        (selectedSuiviDay.commentaire || "").toString().length > 0
      ) {
        setValue(selectedSuiviDay.commentaire?.toString() ?? "");
      } else {
        setValue("");
      }
    };
    updateTextareaValue();
  }, [selectedSuiviDay]);

  return (
    <div className={styles.moodCommentContainer}>
      <h3 className={styles.moodCommentTitle}>Commentaire</h3>
      <textarea
        name="moodComment"
        id="moodComment"
        value={value}
        onChange={handleTextareaChange}
        onBlur={updateComment}
        className={styles.textarea}
        rows={4}
      >
        {value}
      </textarea>
    </div>
  );
};

export default MoodComment;
