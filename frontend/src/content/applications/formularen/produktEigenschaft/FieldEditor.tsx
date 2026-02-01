import React from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  IconButton,
  Tooltip,
  Paper,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useFormContext } from "../../../../contexts/FormularContext";

const FieldEditor = ({ index }: { index: number }) => {
  const { fields, updateField, removeField } = useFormContext();
  const field = fields[index];

  // Sécurité si le champ n'existe plus
  if (!field) return null;

  return (
    <Paper
      variant="outlined"
      sx={{ p: 3, position: "relative", borderRadius: 2 }}
    >
      {/* Bouton de suppression en haut à droite */}
      <IconButton
        onClick={() => removeField(index)}
        color="error"
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <DeleteOutlineIcon />
      </IconButton>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
          gap: 2,
          mb: 2,
        }}
      >
        {/* Label du champ */}
        <TextField
          label="Feld-Label"
          placeholder="z.B. Wunschfarbe"
          value={field.label}
          onChange={(e) =>
            updateField(index, { ...field, label: e.target.value })
          }
          fullWidth
        />

        {/* Sélection du Type */}
        <FormControl fullWidth>
          <InputLabel>Typ</InputLabel>
          <Select
            label="Typ"
            value={field.type}
            onChange={(e) =>
              updateField(index, { ...field, type: e.target.value })
            }
          >
            <MenuItem value="text">Kurztext</MenuItem>
            <MenuItem value="number">Zahl</MenuItem>
            <MenuItem value="select">Dropdown-Auswahl</MenuItem>
            <MenuItem value="checkbox">Checkbox (Ja/Nein)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Options conditionnelles pour le Dropdown */}
      {field.type === "select" && (
        <TextField
          label="Optionen (durch Komma getrennt)"
          placeholder="Option 1, Option 2, Option 3"
          value={field.options || ""}
          onChange={(e) =>
            updateField(index, { ...field, options: e.target.value })
          }
          fullWidth
          sx={{ mb: 2 }}
          helperText="Geben Sie die Werte ein, die im Menü erscheinen sollen."
        />
      )}

      {/* Hinweis / Tooltip */}
      <TextField
        label="Hinweis / Beschreibung"
        placeholder="Hilfetext für den Kunden..."
        value={field.hinweis}
        onChange={(e) =>
          updateField(index, { ...field, hinweis: e.target.value })
        }
        fullWidth
        InputProps={{
          endAdornment: (
            <Tooltip title="Dieser Text erscheint als kleine Hilfe unter dem Eingabefeld.">
              <HelpOutlineIcon
                sx={{ color: "action.active", ml: 1, fontSize: 20 }}
              />
            </Tooltip>
          ),
        }}
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <FormControlLabel
          control={
            <Switch
              checked={field.isRequired}
              onChange={(e) =>
                updateField(index, { ...field, isRequired: e.target.checked })
              }
              color="primary"
            />
          }
          label="Als Pflichtfeld markieren"
        />
      </Box>
    </Paper>
  );
};

export default FieldEditor;
