import { useState } from "react";
import ChartDisplay from "./ChartDisplay";
import styles from "./Charts.module.scss";
import TimeSelector from "./TimeSelector";
import { dataGroups, type SuiviColName } from "../../types/globales";
import { type TimeRange, timeRanges } from "./constants";

const Charts = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>(
    timeRanges[0],
  );
  const [selectedDataGroup1, setSelectedDataGroup1] = useState<SuiviColName[]>(
    dataGroups[0],
  );
  const [selectedDataGroup2, setSelectedDataGroup2] = useState<SuiviColName[]>(
    dataGroups[1],
  );

  return (
    <div className={styles.chartsContainer}>
      <ChartDisplay
        dataGroup={selectedDataGroup1}
        setSelectedDataGroup={setSelectedDataGroup1}
        timeRange={selectedTimeRange}
      />
      <ChartDisplay
        dataGroup={selectedDataGroup2}
        setSelectedDataGroup={setSelectedDataGroup2}
        timeRange={selectedTimeRange}
      />
      <TimeSelector
        selectedTimeRange={selectedTimeRange}
        setSelectedTimeRange={setSelectedTimeRange}
      />
    </div>
  );
};

export default Charts;
