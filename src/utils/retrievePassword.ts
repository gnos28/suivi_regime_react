export const retrievePassword = (): string => {
  const storedPassword = localStorage.getItem("suivi_regime_password");
  if (storedPassword && storedPassword.trim() !== "") {
    return storedPassword;
  }
  return "";
};
