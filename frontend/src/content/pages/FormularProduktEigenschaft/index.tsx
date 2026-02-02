import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";
import { Controller } from "react-hook-form";
import { useFormContext } from "../../../contexts/FormularContext";

// --- Hilfs-Typen ---
interface SectionConfig {
  id: number;
  title: string;
  labels: string[];
}

interface SectionTitleProps {
  number: number;
  title: string;
}

interface FormFieldRowProps {
  label: string;
  children: ReactNode;
  info?: string;
}

// --- Abschnitte definieren ---
const SECTIONS: SectionConfig[] = [
  {
    id: 1,
    title: "Persönliche Informationen",
    labels: ["nombre de page", "Email", "Telefon"],
  },
  {
    id: 2,
    title: "Produktdetails",
    labels: ["Produkttyp", "Menge", "Format"],
  },
  {
    id: 3,
    title: "Zusätzliche Anforderungen",
    labels: ["Spezialwünsche", "Bemerkungen"],
  },
];

// --- Sous-composants de style ---

const SectionTitle = ({ number, title }: SectionTitleProps) => (
  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4, mt: 4 }}>
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        border: "1.5px solid #333",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Typography variant="body1" fontWeight="bold">
        {number}
      </Typography>
    </Box>
    <Typography variant="h5" fontWeight="500">
      {title}
    </Typography>
  </Stack>
);

const FormFieldRow = ({ label, children, info }: FormFieldRowProps) => (
  <Stack
    direction={{ xs: "column", sm: "row" }}
    spacing={2}
    alignItems={{ xs: "flex-start", sm: "center" }}
    sx={{ mb: 2.5 }}
  >
    <Typography sx={{ width: { sm: "280px" }, flexShrink: 0, fontWeight: 500 }}>
      {label}
    </Typography>
    <Box
      sx={{
        flexGrow: 1,
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      {children}
      {info && (
        <Typography color="text.secondary" sx={{ cursor: "help" }}>
          ⓘ
        </Typography>
      )}
    </Box>
  </Stack>
);

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "50px", // Style pilule de l'image
    backgroundColor: "white",
    "& fieldset": { borderColor: "#ced4da" },
  },
  "& .MuiInputBase-input": { px: 3, py: 1.5 },
};

// --- Composant Principal ---

const FormularProduktEigenschaft = () => {
  const { fields, loading, methods } = useFormContext();

  if (loading) return <Typography>Wird geladen...</Typography>;

  return (
    <Box sx={{ p: 1 }}>
      <form onSubmit={methods.handleSubmit((data) => console.log(data))}>
        {SECTIONS.map((section) => (
          <Box key={section.id} sx={{ mb: 6 }}>
            <SectionTitle number={section.id} title={section.title} />

            <Box sx={{ ml: { xs: 0, md: 6 } }}>
              {fields
                .filter((f) => section.labels.includes(f.label))
                .map((field, index) => {
                  const fieldName = `field_${field.id || index}`;

                  return (
                    <Controller
                      key={fieldName}
                      name={fieldName}
                      control={methods.control}
                      rules={{ required: field.isRequired }}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormFieldRow label={field.label} info={field.hinweis}>
                          {field.type === "select" ? (
                            <FormControl fullWidth error={!!error}>
                              <Select
                                value={value || ""}
                                onChange={onChange}
                                sx={inputStyle}
                                displayEmpty
                              >
                                {field.options?.split(",").map((opt) => (
                                  <MenuItem key={opt} value={opt.trim()}>
                                    {opt.trim()}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          ) : field.type === "checkbox" ? (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={!!value}
                                  onChange={(e) => onChange(e.target.checked)}
                                />
                              }
                              label="Sélectionner"
                            />
                          ) : (
                            <TextField
                              fullWidth
                              type={field.type}
                              value={value || ""}
                              onChange={onChange}
                              error={!!error}
                              sx={inputStyle}
                            />
                          )}
                          {error && (
                            <FormHelperText error>
                              {error.message}
                            </FormHelperText>
                          )}
                        </FormFieldRow>
                      )}
                    />
                  );
                })}
            </Box>
          </Box>
        ))}

        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{
            mt: 4,
            bgcolor: "#00a1e0",
            "&:hover": { bgcolor: "#0081b3" },
            borderRadius: "50px",
            px: 4,
            py: 1.5,
          }}
        >
          Kaufen / Anfrage senden
        </Button>
      </form>
    </Box>
  );
};

export default FormularProduktEigenschaft;
