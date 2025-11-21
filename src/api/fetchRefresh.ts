import axios from "axios";
import type { DatabaseColName } from "../types/globales";
import { retrievePassword } from "../utils/retrievePassword";
import { handleApiAnswer } from "./handleApiAnswer";
// const password = import.meta.env.VITE_SUIVI_PASSWORD || "";

type FetchRefreshProps = { setInvalidPassword: (c: boolean) => void };

export const fetchRefresh = async ({
  setInvalidPassword,
}: FetchRefreshProps) => {
  console.log("fetchRefresh");
  const response = await axios.post<Record<DatabaseColName, string | number>[]>(
    "https://script.google.com/macros/s/AKfycbwfS4pf5wsLEE8gFEdx--1IOOLoMWu-xXOJHtoyG99cqcyzvPGh5c10Fiwk3c7czQQ/exec",
    {
      password: retrievePassword(),
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

  handleApiAnswer({
    callback: () => "OK",
    response,
    setInvalidPassword,
  });
};
