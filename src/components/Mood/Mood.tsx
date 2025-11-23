import styles from "./Mood.module.scss";
import Symptom from "./Symptom";
import MoodComment from "./MoodComment";

const Mood = () => {
  const symptoms = ["ballonnements", "selles", "nausées"] as const;

  return (
    <div className={styles.moodContainer}>
      {symptoms.map((symptom) => (
        <Symptom key={symptom} symptom={symptom} />
      ))}
      <MoodComment />
    </div>
  );
};

export default Mood;
