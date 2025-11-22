import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import styles from "./Donut.module.scss";

ChartJS.register(ArcElement, Tooltip, Legend);

type DonutProps = {
  value: number;
  target: number;
  colorValue: string;
  colorTarget: string;
  textLines: string[];
};

const Donut = ({
  value,
  target,
  colorValue,
  colorTarget,
  textLines,
}: DonutProps) => {
  const data: ChartData<"doughnut", number[], string> = {
    labels: ["", ""],
    datasets: [
      {
        data: [value, target - value > 0 ? target - value : 0],
        backgroundColor: [colorValue, colorTarget],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className={styles.donutContainer}>
      <div className={styles.donutTextContainer}>
        {textLines.map((line, index) => (
          <span
            key={index}
            className={
              index === 0
                ? styles.donutTextFirstLine
                : styles.donutTextOtherLines
            }
          >
            {line}
          </span>
        ))}
      </div>

      <Doughnut
        data={data}
        options={{
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: false,
            },
          },
        }}
      />
    </div>
  );
};

export default Donut;
