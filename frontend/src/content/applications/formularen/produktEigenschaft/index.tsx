import React from "react";
import { Box, Button, Typography, Divider, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import { useFormContext } from "../../../../contexts/FormularContext";
import FieldEditor from "./FieldEditor";

const ProduktEigenschaft = () => {
  const { fields, addField, saveConfig } = useFormContext();

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "900px", mx: "auto" }}>
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 4, bgcolor: "#f8f9fa", borderRadius: 2 }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Formular-Konfigurator
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Definieren Sie hier die Felder, die der Kunde in der Vitrine ausfüllen
          muss.
        </Typography>
      </Paper>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {fields.map((_, index) => (
          <FieldEditor key={index} index={index} />
        ))}
      </Box>

      {fields.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 5,
            border: "2px dashed #ccc",
            borderRadius: 2,
            mb: 3,
          }}
        >
          <Typography color="textSecondary">
            Noch keine Felder hinzugefügt.
          </Typography>
        </Box>
      )}

      <Divider sx={{ my: 4 }} />

      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addField}
          size="large"
        >
          Feld hinzufügen
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={saveConfig}
          size="large"
        >
          Konfiguration speichern
        </Button>
      </Box>
    </Box>
  );
};

export default ProduktEigenschaft;
