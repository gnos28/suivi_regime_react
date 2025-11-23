import { useState } from "react";
import styles from "./RepasLineModal.module.scss";
import modalStyles from "../../styles/modal.module.scss";
import NutrimentsResume from "./NutrimentsResume";
import Autocompletion from "./Autocompletion";
import Habitudes from "./Habitudes";
import Suggestions from "./Suggestions";
import Recents from "./Recents";

type RepasLineModalProps = {
  setEditing: (editing: boolean) => void;
  handleValidate: (content: string) => void;
  handleDelete?: () => void;
  content: string;
  dayTimeCol: "matin" | "midi" | "goûter" | "soir";
};

const RepasLineModal = ({
  setEditing,
  handleValidate,
  handleDelete,
  content,
  dayTimeCol,
}: RepasLineModalProps) => {
  const [editedContent, setEditedContent] = useState(content);
  const [selectedTab, setSelectedTab] = useState<
    "habitudes" | "recent" | "suggestions"
  >("habitudes");

  const [showAutocompletion, setShowAutocompletion] = useState(false);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newEditedContent = e.target.value.replace(/\n/g, "");
    setEditedContent(newEditedContent);
    if (showAutocompletion == false && newEditedContent.length > 0)
      setShowAutocompletion(true);
    if (showAutocompletion == true && newEditedContent.length === 0)
      setShowAutocompletion(false);
  };

  const closeAutocompletion = () => {
    setShowAutocompletion(false);
  };

  return (
    <div
      className={modalStyles.modalBackground}
      onClick={() => {
        setEditing(false);
      }}
    >
      <div
        className={[modalStyles.modalContainer, styles.modalContainer].join(
          " "
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.suggestionsSection}>
          <div className={styles.tabSelector}>
            <h2
              className={selectedTab === "habitudes" ? styles.selectedTab : ""}
              onClick={() => setSelectedTab("habitudes")}
            >
              📋 Mes habitudes
            </h2>
            <h2
              className={selectedTab === "recent" ? styles.selectedTab : ""}
              onClick={() => setSelectedTab("recent")}
            >
              ⏰ Récents
            </h2>
            <h2
              className={
                selectedTab === "suggestions" ? styles.selectedTab : ""
              }
              onClick={() => setSelectedTab("suggestions")}
            >
              ✨ Suggestions
            </h2>
          </div>
          {selectedTab === "habitudes" && (
            <Habitudes
              dayTimeCol={dayTimeCol}
              setEditedContent={setEditedContent}
              editedContent={editedContent}
            />
          )}
          {selectedTab === "recent" && (
            <Recents
              dayTimeCol={dayTimeCol}
              editedContent={editedContent}
              setEditedContent={setEditedContent}
            />
          )}
          {selectedTab === "suggestions" && (
            <Suggestions
              dayTimeCol={dayTimeCol}
              editedContent={editedContent}
              setEditedContent={setEditedContent}
            />
          )}
        </div>
        <NutrimentsResume editedContent={editedContent} />
        {showAutocompletion && (
          <Autocompletion
            editedContent={editedContent}
            setEditedContent={setEditedContent}
            closeAutocompletion={closeAutocompletion}
          />
        )}

        <div className={styles.editContainer}>
          <textarea
            name="editedContent"
            id="editedContent"
            value={editedContent}
            onChange={handleTextareaChange}
            className={styles.modalInput}
            rows={4}
          >
            {editedContent}
          </textarea>
          <div className={styles.buttonsContainer}>
            <button
              onClick={() => handleValidate(editedContent)}
              className={[styles.button, styles.validateButton].join(" ")}
            >
              Valider
            </button>
            {handleDelete !== undefined && (
              <button
                onClick={handleDelete}
                className={[styles.button, styles.cancelButton].join(" ")}
              >
                Supprimer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepasLineModal;
