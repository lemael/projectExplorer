import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormContext } from "../../../../contexts/FormularContext";

const ZahlungFormular = () => {
  const { zahlungLabelFormular, updateZahlungLabelFormular, loading } =
    useFormContext();

  // État local pour le formulaire
  const [localConfig, setLocalConfig] = useState(zahlungLabelFormular);

  // Synchroniser l'état local quand les données arrivent du backend
  useEffect(() => {
    setLocalConfig(zahlungLabelFormular);
  }, [zahlungLabelFormular]);

  const handleChange =
    (prop: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalConfig({ ...localConfig, [prop]: e.target.value });
    };

  if (loading) return null;

  return (
    <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Typography variant="h6" mb={2} fontWeight="bold">
        Labels der Zahlungskarte anpassen
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}
      >
        <TextField
          label="Standard Preis Label"
          value={localConfig.standardLabel || ""}
          onChange={handleChange("standardLabel")}
          fullWidth
        />
        <TextField
          label="Standard Subline"
          value={localConfig.standardSubline || ""}
          onChange={handleChange("standardSubline")}
          fullWidth
        />
        <TextField
          label="Express Preis Label"
          value={localConfig.expressLabel || ""}
          onChange={handleChange("expressLabel")}
          fullWidth
        />
        <TextField
          label="Express Subline"
          value={localConfig.expressSubline || ""}
          onChange={handleChange("expressSubline")}
          fullWidth
        />
        <TextField
          label="Footer Info"
          value={localConfig.footerNote || ""}
          onChange={handleChange("footerNote")}
          fullWidth
          sx={{ gridColumn: { md: "span 2" } }}
        />
        <TextField
          label="Button Text"
          value={localConfig.buttonText || ""}
          onChange={handleChange("buttonText")}
          fullWidth
          sx={{ gridColumn: { md: "span 2" } }}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<RestartAltIcon />}
          onClick={() => setLocalConfig(zahlungLabelFormular)}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={() => updateZahlungLabelFormular(localConfig)}
        >
          Speichern
        </Button>
      </Box>
    </Paper>
  );
};

export default ZahlungFormular;
