import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { useFormContext } from "../../../contexts/FormularContext";

const FormularProduktEigenschaft = () => {
  const { fields, loading, methods } = useFormContext();

  const onSubmit = (data: any) => {
    console.log("Données client récupérées :", data);
    alert("Vielen Dank! Ihre Anfrage wurde gesendet.");
  };

  if (loading) return <Typography>Wird geladen...</Typography>;

  return (
    <Box sx={{ py: 6, minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {" "}
      {/* Fond gris léger pour la page */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 600,
          mx: "auto",
          bgcolor: "white", // Fond blanc du formulaire
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{ mb: 5, fontWeight: "bold" }}
        >
          Anfrageformular
        </Typography>

        {/* L'espace est géré par le mb: 5 ci-dessus (margin-bottom) */}

        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {fields.map((field, index) => {
            const fieldName = `field_${field.id || index}`;

            return (
              <Box key={field.id || index} sx={{ mb: 3 }}>
                <Controller
                  name={fieldName}
                  control={methods.control}
                  rules={{
                    required: field.isRequired
                      ? "Dieses Feld ist erforderlich"
                      : false,
                  }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => {
                    if (field.type === "select") {
                      return (
                        <FormControl fullWidth error={!!error}>
                          <InputLabel>{field.label}</InputLabel>
                          <Select
                            label={field.label}
                            value={value || ""}
                            onChange={onChange}
                          >
                            {field.options?.split(",").map((opt) => (
                              <MenuItem key={opt} value={opt.trim()}>
                                {opt.trim()}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>
                            {error ? error.message : field.hinweis}
                          </FormHelperText>
                        </FormControl>
                      );
                    }

                    if (field.type === "checkbox") {
                      return (
                        <FormControl error={!!error} component="fieldset">
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={!!value}
                                onChange={(e) => onChange(e.target.checked)}
                              />
                            }
                            label={field.label}
                          />
                          <FormHelperText>
                            {error ? error.message : field.hinweis}
                          </FormHelperText>
                        </FormControl>
                      );
                    }

                    return (
                      <TextField
                        fullWidth
                        label={field.label}
                        type={field.type}
                        value={value || ""}
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error.message : field.hinweis}
                        required={field.isRequired}
                      />
                    );
                  }}
                />
              </Box>
            );
          })}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 4, py: 1.5, fontWeight: "bold", borderRadius: 2 }}
          >
            Kaufen / Anfrage senden
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default FormularProduktEigenschaft;
