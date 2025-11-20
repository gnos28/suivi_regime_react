import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.tsx";
import { DatabaseContextProvider } from "./contexts/databaseContext.tsx";
import { SuiviDaysContextProvider } from "./contexts/suiviDaysContext.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <SuiviDaysContextProvider>
    <DatabaseContextProvider>
      <App />
    </DatabaseContextProvider>
  </SuiviDaysContextProvider>
  // </StrictMode>,
);
