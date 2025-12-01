import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import routes from "./router";

import { CssBaseline } from "@mui/material";
import { AuthProvider } from "./auth/AuthContext";
import { LayoutProvider } from "./contexts/LayoutContext"; // NOUVEAU: Import du LayoutProvider
import { SidebarProvider } from "./contexts/SidebarContext";
import ThemeProvider from "./theme/ThemeProvider";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const content = useRoutes(routes);

  // GESTION DE L'ÉTAT DE NAVIGATION DANS APP.TSX
  const [activePage, setActivePage] = useState(location.pathname);

  // Fonction de navigation mise à disposition via le LayoutContext
  const onNavigate = (pageName: string) => {
    navigate(pageName);
    setActivePage(pageName);
  };

  // Met à jour l'état de la page active lorsque la localisation change (ex: navigation par bouton retour/avant)
  useEffect(() => {
    setActivePage(location.pathname);
  }, [location.pathname]);

  return (
    <ThemeProvider>
      <AuthProvider>
        <SidebarProvider>
          {/* 🚨 Le LayoutProvider enveloppe tout le contenu des routes pour injecter le contexte 🚨 */}
          <LayoutProvider activePage={activePage} onNavigate={onNavigate}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <CssBaseline />
              {content}
            </LocalizationProvider>
          </LayoutProvider>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default App;
