import { useContext, useState, useMemo, useEffect } from "react";
import SuiviDaysContext from "../contexts/suiviDaysContext";
import DatabaseContext from "../contexts/databaseContext";
import TargetsContext from "../contexts/targetsContext";
import { fetchDatabase } from "../api/fetchDatabase";
import { fetchSuiviDays } from "../api/fetchSuiviDays";
import { fetchTargets } from "../api/fetchTargets";
import {
  convertDateToString,
  convertJsonStringToDate,
  removeAccents,
} from "../utils/utils";
import { fetchUpdateSuiviDay } from "../api/fetchUpdateSuiviDay";
import { fetchRefresh } from "../api/fetchRefresh";
import PasswordContext from "../contexts/passwordContext";
import SelectedDayContext from "../contexts/selectedDayContext";
import { globales } from "../types/globales";
import type {
  AverageNutriment,
  AverageNutrimentByCalorie,
  DatabaseExtended,
} from "../types/databaseExtended";

const secureParseFloat = (value: string | number | undefined) => {
  if (value === undefined || value === null) return 0;
  const parsed = parseFloat(value.toString().replace(",", "."));
  return isNaN(parsed) ? 0 : parsed;
};

export const useSuiviRegime = () => {
  const { suiviDays, setSuiviDays } = useContext(SuiviDaysContext);
  const {
    database,
    setDatabase,
    databaseExtended,
    setDatabaseExtended,
    averageNutrimentByCalorie,
    setAverageNutrimentByCalorie,
    averageNutriment,
    setAverageNutriment,
  } = useContext(DatabaseContext);
  const { targets, setTargets } = useContext(TargetsContext);
  const { selectedDay, setSelectedDay } = useContext(SelectedDayContext);

  const selectedSuiviDay = useMemo(() => {
    return suiviDays.find(
      (suiviDay) =>
        convertDateToString(convertJsonStringToDate(suiviDay.date)) ===
        convertDateToString(selectedDay)
    );
  }, [suiviDays, selectedDay]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setInvalidPassword, setPassword } = useContext(PasswordContext);

  const refreshAllData = async (props?: { callGemini: boolean }) => {
    if (isLoading) return;
    setIsLoading(true);

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
    // setSplitText: (lines: string[]) => void;
  };

  const handleEditLine =
    ({ dayTimeCol, splitText }: HandleEditLineProps) =>
    (index: number) =>
    (newLine: string) => {
      if (newLine.trim() === "") return;

      const updatedLines = [...splitText];
      updatedLines[index] = newLine;

      setSuiviDays(
        suiviDays.map((suiviDay) => {
          if (
            convertDateToString(convertJsonStringToDate(suiviDay.date)) ===
            convertDateToString(selectedDay)
          ) {
            return {
              ...suiviDay,
              [dayTimeCol]: updatedLines.join("\n"),
            };
          } else return suiviDay;
        })
      );

      // setSplitText(updatedLines);
      fetchUpdateSuiviDay({
        payload: {
          date: convertDateToString(selectedDay),
          [removeAccents(dayTimeCol)]: updatedLines.join("\n"),
        },
        setInvalidPassword,
      });
    };

  type HandleRemoveLineProps = {
    dayTimeCol: "matin" | "midi" | "goûter" | "soir";
    splitText: string[];
    // setSplitText: (lines: string[]) => void;
  };

  const handleRemoveLine =
    ({ dayTimeCol, splitText }: HandleRemoveLineProps) =>
    (index: number) =>
    () => {
      const updatedLines = splitText.filter((_, i) => i !== index);

      setSuiviDays(
        suiviDays.map((suiviDay) => {
          if (
            convertDateToString(convertJsonStringToDate(suiviDay.date)) ===
            convertDateToString(selectedDay)
          ) {
            return {
              ...suiviDay,
              [dayTimeCol]: updatedLines.join("\n"),
            };
          } else return suiviDay;
        })
      );

      fetchUpdateSuiviDay({
        payload: {
          date: convertDateToString(selectedDay),
          [removeAccents(dayTimeCol)]: updatedLines.join("\n"),
        },
        setInvalidPassword,
      });
    };

  const goToPreviousDay = () => {
    setSelectedDay((prevDay) => {
      const newDate = new Date(prevDay);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const goToNextDay = () => {
    setSelectedDay((prevDay) => {
      const newDate = new Date(prevDay);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  useEffect(() => {
    const newAverageNutriment: AverageNutriment = Object.fromEntries(
      globales.nutrimentsColNames.map((nutriment) => {
        const total = database.reduce(
          (sum, item) => sum + secureParseFloat(item[nutriment]),
          0
        );
        return [nutriment, database.length > 0 ? total / database.length : 0];
      })
    ) as AverageNutriment;

    const databaseWithNutrimentByCalorie = database.map((item) => {
      const nutrimentByCalorie: Partial<
        DatabaseExtended["nutrimentByCalorie"]
      > = {};

      globales.nutrimentsColNames.forEach((nutriment) => {
        if (
          nutriment !== "Calories" &&
          nutriment !== "soluble / insoluble" &&
          nutriment !== "Ω3 / Ω6"
        ) {
          const calories = secureParseFloat(item["Calories"]);
          nutrimentByCalorie[nutriment] =
            calories > 0
              ? secureParseFloat(item[nutriment]) / calories
              : secureParseFloat(item[nutriment]);
        }
      });
      return {
        ...item,
        nutrimentByCalorie:
          nutrimentByCalorie as DatabaseExtended["nutrimentByCalorie"],
      };
    });

    const newAverageNutrimentByCalorie = Object.fromEntries(
      globales.nutrimentsColNames
        .filter(
          (nutriment) =>
            nutriment !== "Calories" &&
            nutriment !== "soluble / insoluble" &&
            nutriment !== "Ω3 / Ω6"
        )
        .map((nutriment) => {
          const total = databaseWithNutrimentByCalorie.reduce(
            (sum, item) =>
              sum +
              secureParseFloat(
                item.nutrimentByCalorie[
                  nutriment as keyof typeof item.nutrimentByCalorie
                ]
              ),
            0
          );
          return [
            nutriment,
            databaseWithNutrimentByCalorie.length > 0
              ? total / databaseWithNutrimentByCalorie.length
              : 0,
          ];
        })
    ) as AverageNutrimentByCalorie;

    const newDatabaseExtended = databaseWithNutrimentByCalorie.map(
      (databaseItem) => {
        const nutrimentByCalorieVsAverage = Object.fromEntries(
          globales.nutrimentsColNames.map((nutriment) => {
            if (
              nutriment !== "Calories" &&
              nutriment !== "soluble / insoluble" &&
              nutriment !== "Ω3 / Ω6"
            ) {
              const itemValue = secureParseFloat(
                databaseItem.nutrimentByCalorie[
                  nutriment as keyof typeof databaseItem.nutrimentByCalorie
                ]
              );
              const averageValue =
                newAverageNutrimentByCalorie[
                  nutriment as keyof typeof newAverageNutrimentByCalorie
                ];
              return [
                nutriment,
                averageValue > 0 ? itemValue / averageValue : 0,
              ];
            } else {
              return [nutriment, 0];
            }
          })
        ) as DatabaseExtended["nutrimentByCalorieVsAverage"];

        const nutrimentVsAverage = Object.fromEntries(
          globales.nutrimentsColNames.map((nutriment) => {
            const itemValue = secureParseFloat(databaseItem[nutriment]);
            const averageValue =
              newAverageNutriment[
                nutriment as keyof typeof newAverageNutriment
              ];
            return [nutriment, averageValue > 0 ? itemValue / averageValue : 0];
          })
        ) as DatabaseExtended["nutrimentVsAverage"];

        return {
          ...databaseItem,
          nutrimentByCalorieVsAverage,
          nutrimentVsAverage,
        };
      }
    );

    setAverageNutriment(newAverageNutriment);
    setAverageNutrimentByCalorie(newAverageNutrimentByCalorie);
    setDatabaseExtended(newDatabaseExtended);
  }, [
    database,
    setAverageNutriment,
    setAverageNutrimentByCalorie,
    setDatabaseExtended,
  ]);

  return {
    suiviDays,
    database,
    databaseExtended,
    averageNutriment,
    averageNutrimentByCalorie,
    targets,
    selectedDay,
    refreshAllData,
    selectedSuiviDay,
    handleAddLine,
    handleEditLine,
    handleRemoveLine,
    isLoading,
    goToPreviousDay,
    goToNextDay,
  };
};
