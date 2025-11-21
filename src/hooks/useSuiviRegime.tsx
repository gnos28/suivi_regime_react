/* eslint-disable react-hooks/set-state-in-effect */
import { useContext, useEffect, useState } from "react";
import SuiviDaysContext from "../contexts/suiviDaysContext";
import DatabaseContext from "../contexts/databaseContext";
import TargetsContext from "../contexts/targetsContext";
import { fetchDatabase } from "../api/fetchDatabase";
import { fetchSuiviDays } from "../api/fetchSuiviDays";
import { fetchTargets } from "../api/fetchTargets";
import type { SuiviColName } from "../types/globales";
import {
  convertDateToString,
  convertJsonStringToDate,
  removeAccents,
} from "../utils/utils";
import { fetchUpdateSuiviDay } from "../api/fetchUpdateSuiviDay";
import { fetchRefresh } from "../api/fetchRefresh";
import PasswordContext from "../contexts/passwordContext";

export const useSuiviRegime = () => {
  const { suiviDays, setSuiviDays } = useContext(SuiviDaysContext);
  const { database, setDatabase } = useContext(DatabaseContext);
  const { targets, setTargets } = useContext(TargetsContext);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [selectedSuiviDay, setSelectedSuiviDay] = useState<
    Record<SuiviColName, string | number> | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setInvalidPassword, setPassword } = useContext(PasswordContext);

  const refreshAllData = async (props?: { callGemini: boolean }) => {
    if (isLoading) return;
    setIsLoading(true);
    console.log("*** hook useEffect");

    try {
      if (props?.callGemini) await fetchRefresh({ setInvalidPassword });
      await fetchSuiviDays({ setSuiviDays, setInvalidPassword });
      await fetchDatabase({ setDatabase, setInvalidPassword });
      await fetchTargets({ setTargets, setInvalidPassword });
    } catch (error) {
      console.error("Invalid password:", error);
      setInvalidPassword(true);
      setPassword("");
      localStorage.removeItem("suivi_regime_password");
    }

    setIsLoading(false);
  };

  type HandleAddLineProps = {
    content: string | number | undefined;
    dayTimeCol: "matin" | "midi" | "goûter" | "soir";
    hideModal: () => void;
  };

  const handleAddLine =
    ({ content, dayTimeCol, hideModal }: HandleAddLineProps) =>
    async (newLine: string) => {
      if (newLine.trim() === "") return;

      const updatedSuiviDays = suiviDays.map((suiviDay) => {
        if (
          convertDateToString(convertJsonStringToDate(suiviDay.date)) ===
          convertDateToString(selectedDay)
        ) {
          const dayTimeMeals = (suiviDay[dayTimeCol] ?? "").toString();
          return {
            ...suiviDay,
            [dayTimeCol]:
              dayTimeMeals.trim() === ""
                ? newLine
                : dayTimeMeals + "\n" + newLine,
          };
        } else return suiviDay;
      });

      setSuiviDays(updatedSuiviDays);
      hideModal();
      await fetchUpdateSuiviDay({
        payload: {
          date: convertDateToString(selectedDay),
          [removeAccents(dayTimeCol)]:
            (content?.toString() ?? "").trim() !== ""
              ? (content?.toString() ?? "") + "\n" + newLine
              : newLine,
        },
        setInvalidPassword,
      });
    };

  type HandleEditLineProps = {
    dayTimeCol: "matin" | "midi" | "goûter" | "soir";
    splitText: string[];
    setSplitText: (lines: string[]) => void;
  };

  const handleEditLine =
    ({ dayTimeCol, splitText, setSplitText }: HandleEditLineProps) =>
    (index: number) =>
    (newLine: string) => {
      if (newLine.trim() === "") return;

      const updatedLines = [...splitText];
      updatedLines[index] = newLine;
      setSplitText(updatedLines);
      fetchUpdateSuiviDay({
        payload: {
          date: convertDateToString(selectedDay),
          [removeAccents(dayTimeCol)]: updatedLines.join("\n"),
        },
        setInvalidPassword,
      });
    };

  useEffect(() => {
    const suiviToday = suiviDays.find(
      (suiviDay) =>
        convertDateToString(convertJsonStringToDate(suiviDay.date)) ===
        convertDateToString(selectedDay)
    );
    setSelectedSuiviDay(suiviToday);
  }, [suiviDays, selectedDay]);

  return {
    suiviDays,
    database,
    targets,
    selectedDay,
    refreshAllData,
    selectedSuiviDay,
    handleAddLine,
    handleEditLine,
    isLoading,
  };
};
