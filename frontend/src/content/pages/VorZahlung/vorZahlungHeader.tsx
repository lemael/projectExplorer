import { Box, Typography, Container } from "@mui/material";

const VorZahlungHeader = () => {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#d9edf7", // Le bleu clair de votre image
        py: 6, // Espacement vertical (haut/bas)
        mb: 4, // Marge sous le bandeau
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          sx={{
            color: "white",
            fontWeight: 400, // Look épuré
            letterSpacing: 1,
          }}
        >
          Broschüre mit Heftung
        </Typography>
      </Container>
    </Box>
  );
};
export default VorZahlungHeader;
