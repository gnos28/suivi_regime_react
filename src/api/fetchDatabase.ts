import axios from "axios";
import type { DatabaseColName } from "../types/globales";
const password = import.meta.env.VITE_SUIVI_PASSWORD || "";

export const fetchDatabase = async (
  setDatabase: (c: Record<DatabaseColName, string | number>[]) => void
) => {
  const response = await axios.post<Record<DatabaseColName, string | number>[]>(
    "https://script.google.com/macros/s/AKfycbwfS4pf5wsLEE8gFEdx--1IOOLoMWu-xXOJHtoyG99cqcyzvPGh5c10Fiwk3c7czQQ/exec",
    {
      password,
      method: "getDatabase",
    },
    {
      withCredentials: false,
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
    }
  );

  if (response.status === 200) {
    setDatabase(response.data);
  }
};
