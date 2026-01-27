import { useState } from "react";
import styles from "./RepasLineModal.module.scss";
import modalStyles from "../../styles/modal.module.scss";
import NutrimentsResume from "./NutrimentsResume";
import Autocompletion from "./Autocompletion";
import Habitudes from "./Habitudes";
import Suggestions from "./Suggestions";
import Recents from "./Recents";
import { parseMealLine } from "../../utils/utils";

type RepasLineModalProps = {
  setEditing: (editing: boolean) => void;
  handleValidate: (content: string) => void;
  handleDelete?: () => void;
  content: string;
  dayTimeCol: "matin" | "midi" | "goûter" | "soir";
  autoAnalyze?: boolean;
};

const quantities = [0.25, 0.33, 0.5, 0.66, 0.75, 1, 1.25, 1.5, 2, 3, 4, 5];

// Helper function to format the meal line
const formatMealLine = (quantity: number, text: string) => {
  if (quantity === 1) {
    return text;
  }
  // Special handling for 1/3 and 2/3 for display consistency
  const quantityString = quantity.toString();

  return `[${quantityString}] ${text}`;
};

const RepasLineModal = ({
  content,
  handleDelete,
  setEditing,
  handleValidate,
  dayTimeCol,
  autoAnalyze,
}: RepasLineModalProps) => {
  const initialData = parseMealLine(content);
  const [editedContent, setEditedContent] = useState(initialData.text);
  const [quantity, setQuantity] = useState(initialData.quantity);
  const [selectedTab, setSelectedTab] = useState<
    "habitudes" | "recent" | "suggestions" | null
  >("habitudes");

  const [showAutocompletion, setShowAutocompletion] = useState(false);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Block [ and ]
    const newEditedContent = e.target.value.replace(/[\n[\]]/g, "");
    setEditedContent(newEditedContent);
    if (showAutocompletion == false && newEditedContent.length > 0)
      setShowAutocompletion(true);
  };

  const handleAutocompletionClick = (aliment: string) => {
    setEditedContent(aliment);
    setShowAutocompletion(false);
  };

  const handleTabClick = (tab: "habitudes" | "recent" | "suggestions") => {
    setSelectedTab(selectedTab === tab ? null : tab);
  };

  const setEditedContentAndCloseTab = (content: string) => {
    setEditedContent(content);
    setSelectedTab(null);
    setShowAutocompletion(false);
  };

  return (
    <div
      className={modalStyles.modalBackground}
      onClick={() => setEditing(false)}
    >
      <div
        className={[modalStyles.modalContainer, styles.modalContainer].join(
          " ",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.tabSelector}>
          <h2
            className={[
              styles.tabItem,
              selectedTab === "habitudes" ? styles.selectedTab : "",
            ].join(" ")}
            onClick={() => handleTabClick("habitudes")}
          >
            <span className={styles.tabIcon}>📋</span>
            <span className={styles.tabLabel}>Mes habitudes</span>
          </h2>

          <h2
            className={[
              styles.tabItem,
              selectedTab === "recent" ? styles.selectedTab : "",
            ].join(" ")}
            onClick={() => handleTabClick("recent")}
          >
            <span className={styles.tabIcon}>⏰</span>
            <span className={styles.tabLabel}>Récents</span>
          </h2>

          <h2
            className={[
              styles.tabItem,
              selectedTab === "suggestions" ? styles.selectedTab : "",
            ].join(" ")}
            onClick={() => handleTabClick("suggestions")}
          >
            <span className={styles.tabIcon}>✨</span>
            <span className={styles.tabLabel}>Suggestions</span>
          </h2>
        </div>

        <div className={styles.contentSection}>
          <NutrimentsResume
            editedContent={editedContent}
            autoAnalyze={autoAnalyze}
            quantity={quantity}
          />

          <div className={styles.quantitySection}>
            <div className={styles.quantityHeader}>
              <span className={styles.quantityLabel}>Quantité</span>
              <span className={styles.quantityValue}>{quantity}</span>
            </div>
            <input
              type="range"
              min="0"
              max={quantities.length - 1}
              step="1"
              value={quantities.indexOf(quantity)}
              onChange={(e) =>
                setQuantity(quantities[parseInt(e.target.value)])
              }
              className={styles.quantitySlider}
            />
          </div>

          <div className={styles.editContainer}>
            <textarea
              name="editedContent"
              id="editedContent"
              value={editedContent}
              onChange={handleTextareaChange}
              className={styles.modalInput}
              rows={3}
              placeholder="Saisissez votre repas..."
            />
          </div>
        </div>

        {selectedTab !== null && (
          <div className={styles.expandedTabContent}>
            {selectedTab === "habitudes" && (
              <Habitudes
                dayTimeCol={dayTimeCol}
                setEditedContent={setEditedContentAndCloseTab}
                editedContent={editedContent}
              />
            )}
            {selectedTab === "recent" && (
              <Recents
                dayTimeCol={dayTimeCol}
                editedContent={editedContent}
                setEditedContent={setEditedContentAndCloseTab}
              />
            )}
            {selectedTab === "suggestions" && (
              <Suggestions
                dayTimeCol={dayTimeCol}
                editedContent={editedContent}
                setEditedContent={setEditedContentAndCloseTab}
              />
            )}
          </div>
        )}

        {showAutocompletion && (
          <Autocompletion
            editedContent={editedContent}
            onSelect={handleAutocompletionClick}
          />
        )}

        <div className={styles.buttonsContainer}>
          <button
            onClick={() =>
              handleValidate(formatMealLine(quantity, editedContent))
            }
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
  );
};

export default RepasLineModal;
