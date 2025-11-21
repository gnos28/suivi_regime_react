import axios from "axios";
import type { SuiviColName } from "../types/globales";
import { retrievePassword } from "../utils/retrievePassword";
import { handleApiAnswer } from "./handleApiAnswer";
// const password = import.meta.env.VITE_SUIVI_PASSWORD || "";

type FetchSuiviDaysProps = {
  setSuiviDays: (c: Record<SuiviColName, string | number>[]) => void;
  setInvalidPassword: (c: boolean) => void;
};

export const fetchSuiviDays = async ({
  setSuiviDays,
  setInvalidPassword,
}: FetchSuiviDaysProps) => {
  console.log("fetchSuiviDays");
  const response = await axios.post<Record<SuiviColName, string | number>[]>(
    "https://script.google.com/macros/s/AKfycbwfS4pf5wsLEE8gFEdx--1IOOLoMWu-xXOJHtoyG99cqcyzvPGh5c10Fiwk3c7czQQ/exec",
    {
      password: retrievePassword(),
      method: "getSuiviDays",
    },
    {
      withCredentials: false,
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
    }
  );

  handleApiAnswer({
    callback: () => setSuiviDays(response.data),
    response,
    setInvalidPassword,
  });
};
