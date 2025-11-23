import { useSuiviRegime } from "../../hooks/useSuiviRegime";
import styles from "./Symptom.module.scss";

type SymptomProps = {
  symptom: "ballonnements" | "selles" | "nausées";
};

const Symptom = ({ symptom }: SymptomProps) => {
  const { selectedSuiviDay, handleUpdateSymptom } = useSuiviRegime();

  const symptomValue = parseInt(
    (selectedSuiviDay?.[symptom] ?? 0).toString(),
    10
  );

  const symptomEmoji =
    symptom === "ballonnements" ? "💨" : symptom === "selles" ? "💩" : "🤢";

  const changeSymptomValue = (value: number) => () => {
    if (!selectedSuiviDay) return;

    handleUpdateSymptom({ symptom, value });
  };

  return (
    <div className={styles.symptomContainer}>
      <h3 className={styles.symptomTitle}>{symptom}</h3>
      <span className={styles.symptomEmoji}>{symptomEmoji}</span>
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          onClick={changeSymptomValue(index + 1)}
          className={styles.starContainer}
        >
          {symptomValue >= index + 1 ? (
            <>
              <img
                src="/star_empty.svg"
                alt="star empty"
                className={[styles.star, styles.starEmpty].join(" ")}
              />
              <img
                src="/star.svg"
                alt="star"
                className={[styles.star, styles.starYellow].join(" ")}
              />
            </>
          ) : (
            <img
              src="/star_empty.svg"
              alt="star empty"
              className={[styles.star, styles.starEmpty].join(" ")}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Symptom;
