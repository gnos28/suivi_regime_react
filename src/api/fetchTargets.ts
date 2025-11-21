import axios from "axios";
import type { Target } from "../contexts/targetsContext";
import { retrievePassword } from "../utils/retrievePassword";
import { handleApiAnswer } from "./handleApiAnswer";
// const password = import.meta.env.VITE_SUIVI_PASSWORD || "";

type FetchTargetsProps = {
  setTargets: (c: Target[]) => void;
  setInvalidPassword: (c: boolean) => void;
};

export const fetchTargets = async ({
  setTargets,
  setInvalidPassword,
}: FetchTargetsProps) => {
  console.log("fetchTargets");
  const response = await axios.post<Target[]>(
    "https://script.google.com/macros/s/AKfycbwfS4pf5wsLEE8gFEdx--1IOOLoMWu-xXOJHtoyG99cqcyzvPGh5c10Fiwk3c7czQQ/exec",
    {
      password: retrievePassword(),
      method: "getTargets",
    },
    {
      withCredentials: false,
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
    }
  );

  handleApiAnswer({
    callback: () => setTargets(response.data),
    response,
    setInvalidPassword,
  });
};
