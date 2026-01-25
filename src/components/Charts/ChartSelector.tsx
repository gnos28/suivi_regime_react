import { dataGroups, type SuiviColName } from "../../types/globales";
import styles from "./ChartSelector.module.scss";

type ChartSelectorProps = {
  selectedDataGroup: SuiviColName[];
  setSelectedDataGroup: (dataGroup: SuiviColName[]) => void;
};

const ChartSelector = ({
  selectedDataGroup,
  setSelectedDataGroup,
}: ChartSelectorProps) => {
  const goToPreviousGroup = () => {
    const currentIndex = dataGroups.findIndex(
      (group) =>
        group.length === selectedDataGroup.length &&
        group.every((colName, index) => colName === selectedDataGroup[index]),
    );
    const previousIndex =
      (currentIndex - 1 + dataGroups.length) % dataGroups.length;
    setSelectedDataGroup(dataGroups[previousIndex]);
  };

  const goToNextGroup = () => {
    const currentIndex = dataGroups.findIndex(
      (group) =>
        group.length === selectedDataGroup.length &&
        group.every((colName, index) => colName === selectedDataGroup[index]),
    );
    const nextIndex = (currentIndex + 1) % dataGroups.length;
    setSelectedDataGroup(dataGroups[nextIndex]);
  };

  return (
    <>
      <div
        className={[styles.changeGroupIcon, styles.previousGroup].join(" ")}
        onClick={goToPreviousGroup}
      >
        <img src="/arrowLeft.svg" alt="previous Group" width="30" height="30" />
      </div>
      <div
        className={[styles.changeGroupIcon, styles.nextGroup].join(" ")}
        onClick={goToNextGroup}
      >
        <img
          src="/arrowLeft.svg"
          alt="previous Group"
          width="30"
          height="30"
          className={styles.rotate180}
        />
      </div>
    </>
  );
};

export default ChartSelector;
