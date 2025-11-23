import buttonStyles from "../../styles/button.module.scss";
import { type TimeRange, timeRanges } from "./constants";
import styles from "./TimeSelector.module.scss";

type TimeSelectorProps = {
  selectedTimeRange: TimeRange;
  setSelectedTimeRange: (timeRange: TimeRange) => void;
};

const TimeSelector = ({
  selectedTimeRange,
  setSelectedTimeRange,
}: TimeSelectorProps) => {
  const isSelected = (timeRange: TimeRange) => selectedTimeRange === timeRange;

  return (
    <div className={styles.timeSelectorContainer}>
      {timeRanges.map((timeRange) => (
        <div
          key={timeRange}
          onClick={() => setSelectedTimeRange(timeRange as TimeRange)}
          className={[
            buttonStyles.btnGrad,
            styles.button,
            isSelected(timeRange) ? styles.active : "",
          ].join(" ")}
        >
          {timeRange}
        </div>
      ))}
    </div>
  );
};

export default TimeSelector;
