import { useState } from "react";
import ChartDisplay from "./ChartDisplay";
import styles from "./Charts.module.scss";
import TimeSelector from "./TimeSelector";
import type { SuiviColName } from "../../types/globales";
import ChartSelector from "./ChartSelector";

export const timeRanges = ["7D", "1M", "6M"] as const;
export type TimeRange = (typeof timeRanges)[number];

export const dataGroups: SuiviColName[][] = [
  ["ballonnements", "selles", "nausées"],
  ["Calories", "Proteines", "Glucides", "Lipides"],
  ["fibre solubles", "fibres insolubles", "fibre total", "soluble / insoluble"],
  ["Sodium", "Potassium", "Calcium", "Magnésium", "Fer", "Zinc"],
  ["Vitamine D", "Vitamine B9", "Vitamine B12", "Vitamine C"],
  ["Oméga-3", "Oméga-6", "Ω3 / Ω6"],
] as const;

const Charts = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>(
    timeRanges[0]
  );
  const [selectedDataGroup1, setSelectedDataGroup1] = useState<SuiviColName[]>(
    dataGroups[0]
  );
  const [selectedDataGroup2, setSelectedDataGroup2] = useState<SuiviColName[]>(
    dataGroups[1]
  );

  return (
    <div className={styles.chartsContainer}>
      <TimeSelector
        selectedTimeRange={selectedTimeRange}
        setSelectedTimeRange={setSelectedTimeRange}
      />
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
    </div>
  );
};

export default Charts;
