import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  BarElement,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import styles from "./ChartDisplay.module.scss";
import type { SuiviColName } from "../../types/globales";
import {
  baseDonutGroups,
  type DonutGroupItem,
} from "../../utils/calcDonutGroups";
import { useSuiviRegime } from "../../hooks/useSuiviRegime";
import ChartSelector from "./ChartSelector";
import type { TimeRange } from "./constants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type ChartDisplayProps = {
  dataGroup: SuiviColName[];
  setSelectedDataGroup: (dataGroup: SuiviColName[]) => void;
  timeRange: TimeRange;
};

const avoidNan = (value: number) => {
  if (isNaN(value) || !isFinite(value)) {
    return 0;
  }
  return value;
};

const calcMovingAverage = (
  suiviDays: ReturnType<typeof useSuiviRegime>["suiviDays"],
  dateStr: string,
  colName: SuiviColName,
  windowSize: number
) => {
  const dateIndex = suiviDays.findIndex(
    (suiviDay) => suiviDay.date.toString() === dateStr
  );

  if (dateIndex === -1) return 0;

  const startIndex = Math.max(0, dateIndex - windowSize + 1);
  const relevantDays = suiviDays.slice(startIndex, dateIndex + 1);

  const sum = relevantDays.reduce((acc, day) => {
    const value = parseFloat(day[colName].toString());
    return acc + (isNaN(value) ? 0 : value);
  }, 0);

  const average = sum / relevantDays.length;

  return avoidNan(average);
};

const removeRgbaTransparency = (rgbaString: string | undefined) => {
  if (!rgbaString) return undefined;
  return rgbaString.replace(
    /rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/,
    "rgb($1, $2, $3)"
  );
};

const ChartDisplay = ({
  dataGroup,
  setSelectedDataGroup,
  timeRange,
}: ChartDisplayProps) => {
  const { suiviDays } = useSuiviRegime();

  const ballonnementsDonut: Partial<DonutGroupItem> = {
    name: "ballonnements",
    nameAbbr: "Ballonnements",
    colorValue: "rgba(99, 156, 255, 0.7)",
    colorTarget: "rgba(99, 99, 255, 0.3)",
    unitDecimals: 0,
    unit: "occurrences",
  };

  const sellesDonut: Partial<DonutGroupItem> = {
    name: "selles",
    nameAbbr: "Selles",
    colorValue: "rgba(139, 69, 19, 0.7)",
    colorTarget: "rgba(139, 69, 19, 0.3)",
    unitDecimals: 0,
    unit: "occurrences",
  };

  const nauseesDonut: Partial<DonutGroupItem> = {
    name: "nausées",
    nameAbbr: "Nausées",
    colorValue: "rgba(255, 165, 0, 0.7)",
    colorTarget: "rgba(255, 165, 0, 0.3)",
    unitDecimals: 0,
    unit: "occurrences",
  };

  const nbDays = timeRange === "7D" ? 7 : timeRange === "1M" ? 30 : 30 * 6;
  const movingAverageWindow =
    timeRange === "7D" ? 1 : timeRange === "1M" ? 3 : 7;

  const longLabels = suiviDays
    .filter(
      (suiviDay) =>
        suiviDay.matin !== "" ||
        suiviDay.midi !== "" ||
        suiviDay.goûter !== "" ||
        suiviDay.soir !== ""
    )
    .map((suiviDay) => suiviDay.date.toString())
    .filter((date) => date !== "")
    .slice(-nbDays);

  const labels = longLabels.map((dateStr) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  });

  const lineDatasets: ChartData<"line", number[], string>["datasets"] =
    dataGroup.map((colName) => {
      const donutGroup =
        colName === "ballonnements"
          ? ballonnementsDonut
          : colName === "selles"
          ? sellesDonut
          : colName === "nausées"
          ? nauseesDonut
          : baseDonutGroups.flat().find((item) => item.name === colName);

      return {
        label: colName,
        data: longLabels.map((date) =>
          calcMovingAverage(suiviDays, date, colName, movingAverageWindow)
        ),
        borderColor: removeRgbaTransparency(donutGroup?.colorValue) ?? "black",
        backgroundColor: donutGroup?.colorTarget ?? "black",
        yAxisID: donutGroup?.yAxisID ?? "y",
      };
    });

  const barDatasets: ChartData<"bar", number[], string>["datasets"] =
    dataGroup.map((colName) => {
      const donutGroup =
        colName === "ballonnements"
          ? ballonnementsDonut
          : colName === "selles"
          ? sellesDonut
          : colName === "nausées"
          ? nauseesDonut
          : baseDonutGroups.flat().find((item) => item.name === colName);

      return {
        label: colName,
        data: longLabels.map((date) =>
          parseFloat(
            suiviDays
              .find((suiviDay) => suiviDay.date.toString() === date)
              ?.[colName]?.toString() ?? "0"
          )
        ),
        borderColor: removeRgbaTransparency(donutGroup?.colorValue) ?? "black",
        backgroundColor: donutGroup?.colorTarget ?? "black",
        yAxisID: donutGroup?.yAxisID ?? "y",
      };
    });

  const dataLine: ChartData<"line", number[], string> = {
    labels,
    datasets: lineDatasets,
  };

  const dataBar: ChartData<"bar", number[], string> = {
    labels,
    datasets: barDatasets,
  };

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const aspectRatio = windowWidth / ((windowHeight - 170) / 2);

  return (
    <div className={styles.chartDisplayContainer}>
      {dataGroup.includes("ballonnements") ? (
        <Bar
          options={{
            responsive: true,
            aspectRatio,
            interaction: {
              mode: "index" as const,
              intersect: false,
            },
            plugins: {
              title: {
                display: false,
              },
            },
            scales: {
              x: {
                stacked: true,
              },
              y: {
                stacked: true,
              },
            },
            elements: {
              // line: { backgroundColor: "rgba(0,0,0,1)", tension: 0.4 },
              point: { radius: 0 },
            },
          }}
          data={dataBar}
        />
      ) : (
        <Line
          options={{
            responsive: true,
            aspectRatio,
            interaction: {
              mode: "index" as const,
              intersect: false,
            },
            plugins: {
              title: {
                display: false,
              },
            },
            scales: {
              y: {
                type: "linear" as const,
                display: true,
                position: "left" as const,
              },
              y1: {
                type: "linear" as const,
                display: true,
                position: "right" as const,
                grid: {
                  drawOnChartArea: false,
                },
              },
            },
            elements: {
              // line: { backgroundColor: "rgba(0,0,0,1)", tension: 0.4 },
              point: { radius: 0 },
            },
          }}
          data={dataLine}
        />
      )}

      <ChartSelector
        selectedDataGroup={dataGroup}
        setSelectedDataGroup={setSelectedDataGroup}
      />
    </div>
  );
};

export default ChartDisplay;
