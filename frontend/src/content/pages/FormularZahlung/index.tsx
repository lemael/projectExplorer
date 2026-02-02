import CheckIcon from "@mui/icons-material/Check";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useFormContext as watching } from "react-hook-form";
import { useFormContext } from "../../../contexts/FormularContext";

const FormularZahlung = () => {
  const { zahlungLabelFormular, loading } = useFormContext();
  const { watch } = watching();

  // On surveille les champs du formulaire pour le calcul dynamique (ex: quantité)
  const watchedValues = watch();

  if (loading || !zahlungLabelFormular)
    return <Typography>Laden...</Typography>;

  // Logique de calcul simple (à adapter selon tes besoins métiers)
  const basePrice = 58.91;
  const quantity = parseInt(watchedValues.field_menge) || 1;
  const totalPrice = (basePrice * quantity).toFixed(2);
  const expressPrice = (basePrice * quantity + 8.39).toFixed(2);

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 450,
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid #e0e0e0",
        bgcolor: "white",
        p: 3,
      }}
    >
      {/* Section Standard */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="body1" fontWeight="bold">
          {zahlungLabelFormular.standardLabel}
        </Typography>
        <Typography variant="h6" fontWeight="bold">
          {totalPrice} €
        </Typography>
      </Box>
      <Typography
        variant="caption"
        color="textSecondary"
        sx={{ display: "block", mb: 2, textTransform: "uppercase" }}
      >
        {zahlungLabelFormular.standardSubline.replace("{0}", "04.02.")}
      </Typography>

      {/* Section Business */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="body2" color="textPrimary">
          Best-Business-Preis
        </Typography>
        <Typography
          variant="body2"
          color="primary"
          sx={{ cursor: "pointer", fontWeight: 500 }}
        >
          Login
        </Typography>
      </Box>

      {/* Section Express */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="body1" fontWeight="bold">
          {zahlungLabelFormular.expressLabel}
        </Typography>
        <Typography variant="h6" fontWeight="bold">
          {expressPrice} €
        </Typography>
      </Box>
      <Typography
        variant="caption"
        color="success.main"
        fontWeight="bold"
        sx={{ display: "block", mb: 2, textTransform: "uppercase" }}
      >
        {zahlungLabelFormular.expressSubline.replace("{0}", "02.02.")}
      </Typography>

      {/* Avantages */}
      <List dense sx={{ p: 0, mb: 1 }}>
        <ListItem disableGutters sx={{ py: 0.2 }}>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <CheckIcon color="success" sx={{ fontSize: 18 }} />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2">inkl. Versand & MwSt.</Typography>
            }
          />
        </ListItem>
        <ListItem disableGutters sx={{ py: 0.2 }}>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <CheckIcon color="success" sx={{ fontSize: 18 }} />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2">
                inkl. kurzer Datensichtung
              </Typography>
            }
          />
        </ListItem>
      </List>

      <Typography
        variant="caption"
        color="textSecondary"
        sx={{
          display: "block",
          mb: 3,
          textTransform: "uppercase",
          fontSize: "0.7rem",
        }}
      >
        {zahlungLabelFormular.footerNote}
      </Typography>

      {/* Bouton Principal */}
      <Button
        variant="contained"
        fullWidth
        size="large"
        sx={{
          bgcolor: "#00a1e0",
          "&:hover": { bgcolor: "#0081b3" },
          borderRadius: 10,
          py: 1.8,
          fontWeight: "bold",
          fontSize: "1rem",
          mb: 4,
        }}
      >
        UPLOAD & WARENKORB
      </Button>

      {/* Exemplarpreise */}
      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5 }}>
        Exemplarpreise
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="body2">1 Stück</Typography>
        <Typography variant="body2" fontWeight="500">
          55,91 €
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body2">3 Stück</Typography>
        <Typography variant="body2" fontWeight="500">
          31,25 €
        </Typography>
      </Box>
    </Paper>
  );
};

export default FormularZahlung;
