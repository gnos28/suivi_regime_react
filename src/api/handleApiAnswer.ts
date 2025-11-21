import type { AxiosResponse } from "axios";

type HandleApiAnswerProps = {
  callback: () => void;
  response: AxiosResponse;
  setInvalidPassword: (c: boolean) => void;
};

export const handleApiAnswer = ({
  callback,
  response,
  setInvalidPassword,
}: HandleApiAnswerProps) => {
  if (
    response.status === 200 &&
    response.data.toString() !== "ERROR Invalid password"
  ) {
    callback();
  } else {
    setInvalidPassword(true);
    // throw new Error("Invalid password");
  }
};
