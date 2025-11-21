import axios from "axios";
const password = import.meta.env.VITE_SUIVI_PASSWORD || "";

type Payload = {
  date: string;
  matin?: string;
  midi?: string;
  gouter?: string;
  soir?: string;
  ballonnements?: string;
  selles?: string;
  nausees?: string;
  commentaire?: string;
};

export const fetchUpdateSuiviDay = async (payload: Payload) => {
  console.log("fetchUpdateSuiviDay", { payload });

  const response = await axios.post(
    "https://script.google.com/macros/s/AKfycbwfS4pf5wsLEE8gFEdx--1IOOLoMWu-xXOJHtoyG99cqcyzvPGh5c10Fiwk3c7czQQ/exec",
    {
      password,
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

  console.log({ response });

  if (response.status === 200) return "OK";
};
