import axios from "axios";
import { retrievePassword } from "../utils/retrievePassword";
import { handleApiAnswer } from "./handleApiAnswer";
// const password = import.meta.env.VITE_SUIVI_PASSWORD || "";

let isUpdating = false;

type Payload = {
  date: string;
  matin?: string;
  midi?: string;
  gouter?: string;
  soir?: string;
  ballonnements?: number;
  selles?: number;
  nausees?: number;
  commentaire?: string;
};

type FetchUpdateSuiviDayProps = {
  payload: Payload;
  setInvalidPassword: (c: boolean) => void;
};

export const fetchUpdateSuiviDay = async ({
  payload,
  setInvalidPassword,
}: FetchUpdateSuiviDayProps) => {
  console.log("fetchUpdateSuiviDay", { payload, isUpdating });

  while (isUpdating) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  isUpdating = true;

  const response = await axios.post(
    "https://script.google.com/macros/s/AKfycbwfS4pf5wsLEE8gFEdx--1IOOLoMWu-xXOJHtoyG99cqcyzvPGh5c10Fiwk3c7czQQ/exec",
    {
      password: retrievePassword(),
      method: "updateSuiviDays",
      payload,
    },
    {
      withCredentials: false,
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
    }
  );

  isUpdating = false;

  console.log({ response });

  handleApiAnswer({
    callback: () => "OK",
    response,
    setInvalidPassword,
  });
};
