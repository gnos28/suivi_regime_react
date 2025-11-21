import axios from "axios";
import type { SuiviColName } from "../types/globales";
const password = import.meta.env.VITE_SUIVI_PASSWORD || "";

export const fetchSuiviDays = async (
  setSuiviDays: (c: Record<SuiviColName, string | number>[]) => void
) => {
  const response = await axios.post<Record<SuiviColName, string | number>[]>(
    "https://script.google.com/macros/s/AKfycbwfS4pf5wsLEE8gFEdx--1IOOLoMWu-xXOJHtoyG99cqcyzvPGh5c10Fiwk3c7czQQ/exec",
    {
      password,
      method: "getSuiviDays",
    },
    {
      withCredentials: false,
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
    }
  );

  if (response.status === 200) {
    setSuiviDays(response.data);
  }
};
