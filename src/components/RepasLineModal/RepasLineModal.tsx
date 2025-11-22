import { useEffect, useState } from "react";
import styles from "./RepasLineModal.module.scss";
import modalStyles from "../../styles/modal.module.scss";
import { useSuiviRegime } from "../../hooks/useSuiviRegime";
import { calcDonutGroups } from "../../utils/calcDonutGroups";
import type { DatabaseExtended } from "../../types/databaseExtended";
import NutrimentsResume from "./NutrimentsResume";
import Autocompletion from "./Autocompletion";
import Habitudes from "./Habitudes";

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
  const { databaseExtended, selectedSuiviDay, targets } = useSuiviRegime();
  const [selectedTab, setSelectedTab] = useState<
    "habitudes" | "autocompletion" | "suggestions"
  >("habitudes");
  const [nutrimentsResume, setNutrimentsResume] =
    useState<DatabaseExtended | null>(null);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(e.target.value.replace(/\n/g, ""));
    if (selectedTab !== "autocompletion") setSelectedTab("autocompletion");
  };

  const donutGroups = calcDonutGroups({
    database: databaseExtended,
    selectedSuiviDay,
    targets,
  }).flat();

  useEffect(() => {
    const updateNutrimentsResume = () => {
      const foundItem = databaseExtended.find(
        (item) =>
          item.aliment.toString().toLowerCase() ===
          editedContent.trim().toLowerCase()
      );

      if (foundItem) {
        setNutrimentsResume(foundItem);
      } else {
        setNutrimentsResume(null);
      }
    };

    updateNutrimentsResume();
  }, [editedContent, databaseExtended]);

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
              Mes habitudes
            </h2>
            <h2
              className={
                selectedTab === "autocompletion" ? styles.selectedTab : ""
              }
              onClick={() => setSelectedTab("autocompletion")}
            >
              Autocompletion
            </h2>
            <h2
              className={
                selectedTab === "suggestions" ? styles.selectedTab : ""
              }
              onClick={() => setSelectedTab("suggestions")}
            >
              Suggestions
            </h2>
          </div>
          {selectedTab === "habitudes" && (
            <Habitudes
              dayTimeCol={dayTimeCol}
              setEditedContent={setEditedContent}
              editedContent={editedContent}
            />
          )}
          {selectedTab === "autocompletion" && (
            <Autocompletion
              editedContent={editedContent}
              setEditedContent={setEditedContent}
            />
          )}
        </div>
        <NutrimentsResume
          nutrimentsResume={nutrimentsResume}
          donutGroups={donutGroups}
          editedContent={editedContent}
        />

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
