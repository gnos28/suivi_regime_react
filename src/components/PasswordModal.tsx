import { useContext, useState } from "react";
import styles from "./PasswordModal.module.scss";
import modalStyles from "../styles/modal.module.scss";
import PasswordContext from "../contexts/passwordContext";

const PasswordModal = () => {
  const { setPassword } = useContext(PasswordContext);
  const [inputPassword, setInputPassword] = useState<string>("");

  const handleValidate = () => {
    if (inputPassword.trim() === "") return;
    setPassword(inputPassword);
    localStorage.setItem("suivi_regime_password", inputPassword);
  };

  return (
    <div className={modalStyles.modalBackground}>
      <div
        className={modalStyles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.passwordModalContent}>
          <p>Cette application est protégée par un mot de passe</p>
          <input
            type="password"
            placeholder=""
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
          />
          <button onClick={handleValidate}>Valider</button>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
