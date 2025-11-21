import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.tsx";
import { DatabaseContextProvider } from "./contexts/databaseContext.tsx";
import { SuiviDaysContextProvider } from "./contexts/suiviDaysContext.tsx";
import { TargetsContextProvider } from "./contexts/targetsContext.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <TargetsContextProvider>
    <SuiviDaysContextProvider>
      <DatabaseContextProvider>
        <App />
      </DatabaseContextProvider>
    </SuiviDaysContextProvider>
  </TargetsContextProvider>
  // </StrictMode>,
);
