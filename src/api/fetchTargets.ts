import axios from "axios";
import type { Target } from "../contexts/targetsContext";
const password = import.meta.env.VITE_SUIVI_PASSWORD || "";

export const fetchTargets = async (setTargets: (c: Target[]) => void) => {
  const response = await axios.post<Target[]>(
    "https://script.google.com/macros/s/AKfycbwfS4pf5wsLEE8gFEdx--1IOOLoMWu-xXOJHtoyG99cqcyzvPGh5c10Fiwk3c7czQQ/exec",
    {
      password,
      method: "getTargets",
    },
    {
      withCredentials: false,
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
    }
  );

  if (response.status === 200) {
    setTargets(response.data);
  }
};
