import { Box, Container, Typography } from "@mui/material";
import FormularProduktEigenschaft from "../FormularProduktEigenschaft";
import FormularZahlung from "../FormularZahlung";
import VorZahlungHeader from "./vorZahlungHeader";

const VorZahlung = () => {
  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* 1. Nouveau bandeau tout en haut */}
      <VorZahlungHeader />

      <Container maxWidth="lg">
        {/* 2. Titre de section optionnel */}
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ mb: 6, mt: 2 }}
          align="left"
        >
          Bestellung & Zahlungsdetails
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column-reverse", md: "row" },
            gap: 4,
            alignItems: "flex-start",
          }}
        >
          {/* Colonne de GAUCHE : La carte de prix (Sticky) */}
          <Box
            sx={{
              width: { xs: "100%", md: "35%" },
              position: { md: "sticky" },
              top: 24,
            }}
          >
            <FormularZahlung />
          </Box>

          {/* Colonne de DROITE : Le formulaire par sections */}
          <Box sx={{ flexGrow: 1, width: "100%" }}>
            <FormularProduktEigenschaft />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default VorZahlung;
