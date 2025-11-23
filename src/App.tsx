/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useContext, useEffect } from "react";
import styles from "./App.module.scss";
import Body from "./components/Body";
import HeaderDate from "./components/Header/HeaderDate";
import NavBar from "./components/NavBar/NavBar";
import { useSuiviRegime } from "./hooks/useSuiviRegime";
import LoadingRing from "./components/LoadingRing";
import PasswordContext from "./contexts/passwordContext";
import PasswordModal from "./components/PasswordModal";

function App() {
  const { refreshAllData, selectedSuiviDay, isLoading } = useSuiviRegime();

  const { password, setPassword, invalidPassword, setInvalidPassword } =
    useContext(PasswordContext);

  const getPasswordFromLocalStorage = useCallback(() => {
    const storedPassword = localStorage.getItem("suivi_regime_password");
    if (storedPassword && storedPassword.trim() !== "") {
      setPassword(storedPassword);
    } else {
      setPassword("");
    }
  }, [setPassword]);

  useEffect(() => {
    if (password && password.trim() !== "" && !isLoading) {
      try {
        refreshAllData();
        setInvalidPassword(false);
        localStorage.setItem("suivi_regime_password", password);
      } catch (error) {
        console.error("Invalid password:", error);
        setInvalidPassword(true);
        setPassword("");
        localStorage.removeItem("suivi_regime_password");
      }
    }
  }, [password]);

  useEffect(() => {
    if (invalidPassword) {
      setPassword("");
      localStorage.removeItem("suivi_regime_password");
    }
  }, [invalidPassword, setPassword]);

  useEffect(() => {
    getPasswordFromLocalStorage();
  }, [getPasswordFromLocalStorage]);

  return (
    <div className={styles.appContainer}>
      {password === "" || invalidPassword ? (
        <PasswordModal />
      ) : (
        <>
          <HeaderDate />
          {isLoading ? (
            <LoadingRing />
          ) : (
            selectedSuiviDay !== undefined && <Body />
          )}
          <NavBar />
        </>
      )}
    </div>
  );
}

export default App;
