import axios from "axios";
import { retrievePassword } from "../utils/retrievePassword";

type AnalyzePhotoResponse = {
  description: string;
};

export const fetchAnalyzePhoto = async (
  photoBase64: string
): Promise<AnalyzePhotoResponse> => {
  // Removing the data:image/jpeg;base64, prefix if present as GAS might just want the raw base64 or handled broadly.
  // Actually, usually it's safer to send the full string or just the data. 
  // Let's send the full string for now, or just the data part if we were doing specific binary handling.
  // Given the previous code uses simple payloads, let's just send the string.
  
  const response = await axios.post(
    "https://script.google.com/macros/s/AKfycbwfS4pf5wsLEE8gFEdx--1IOOLoMWu-xXOJHtoyG99cqcyzvPGh5c10Fiwk3c7czQQ/exec",
    {
      password: retrievePassword(),
      method: "analyzePhoto",
      payload: {
        image: photoBase64,
      },
    },
    {
      withCredentials: false,
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
    }
  );

  let data = response.data;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      // It's a raw string, use it as description if possible or wrap it
      return { description: data };
    }
  }

  return data as AnalyzePhotoResponse;
};
