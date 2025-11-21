import axios from "axios";
import type { DatabaseColName } from "../types/globales";
const password = import.meta.env.VITE_SUIVI_PASSWORD || "";

export const fetchRefresh = async () => {
  console.log("fetchRefresh");
  const response = await axios.post<Record<DatabaseColName, string | number>[]>(
    "https://script.google.com/macros/s/AKfycbwfS4pf5wsLEE8gFEdx--1IOOLoMWu-xXOJHtoyG99cqcyzvPGh5c10Fiwk3c7czQQ/exec",
    {
      password,
      method: "forceRefresh",
    },
    {
      withCredentials: false,
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
    }
  );

  console.log({ response });
  if (response.status === 200) return "OK";
};
