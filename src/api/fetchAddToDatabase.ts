import axios from "axios";
import { retrievePassword } from "../utils/retrievePassword";
import { handleApiAnswer } from "./handleApiAnswer";
// const password = import.meta.env.VITE_SUIVI_PASSWORD || "";

export type NewNutriment = {
  aliment: string;
  Calories: number;
  Proteines: number;
  Lipides: number;
  Glucides: number;
  "fibre solubles": number;
  "fibres insolubles": number;
  "fibre total": number;
  "soluble / insoluble": number;
  Sodium: number;
  Potassium: number;
  Calcium: number;
  Magnésium: number;
  Fer: number;
  Zinc: number;
  "Vitamine D": number;
  "Vitamine B9": number;
  "Vitamine B12": number;
  "Vitamine C": number;
  "Oméga-3": number;
  "Oméga-6": number;
  "Ω3 / Ω6": number;
};

type Payload = {
  aliment: string;
};

type FetchAddToDatabaseProps = {
  payload: Payload;
  setInvalidPassword: (c: boolean) => void;
};

export const fetchAddToDatabase = async ({
  payload,
  setInvalidPassword,
}: FetchAddToDatabaseProps) => {
  console.log("fetchAddToDatabase", { payload });

  const response = await axios.post(
    "https://script.google.com/macros/s/AKfycbwfS4pf5wsLEE8gFEdx--1IOOLoMWu-xXOJHtoyG99cqcyzvPGh5c10Fiwk3c7czQQ/exec",
    {
      password: retrievePassword(),
      method: "addToDatabase",
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

  return response.data as NewNutriment;

  return handleApiAnswer({
    callback: () => response.data,
    response,
    setInvalidPassword,
  });
};
