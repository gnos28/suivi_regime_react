import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.tsx";
import { DatabaseContextProvider } from "./contexts/databaseContext.tsx";
import { SuiviDaysContextProvider } from "./contexts/suiviDaysContext.tsx";
import { TargetsContextProvider } from "./contexts/targetsContext.tsx";
import { SelectedDayContextProvider } from "./contexts/selectedDayContext.tsx";
import { PasswordContextProvider } from "./contexts/passwordContext.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <PasswordContextProvider>
    <TargetsContextProvider>
      <SuiviDaysContextProvider>
        <DatabaseContextProvider>
          <SelectedDayContextProvider>
            <App />
          </SelectedDayContextProvider>
        </DatabaseContextProvider>
      </SuiviDaysContextProvider>
    </TargetsContextProvider>
  </PasswordContextProvider>
  // </StrictMode>,
);
