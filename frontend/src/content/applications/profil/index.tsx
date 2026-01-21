import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  getAuthCredentials,
  updateAuthCredentials,
} from "../../../auth/authConfig";
import { validateInputs } from "./handleValidate";

function AdminProfile() {
  const credentials = getAuthCredentials();
  const [email, setEmail] = useState(credentials.email);
  const [password, setPassword] = useState(credentials.password);
  const [error, setError] = useState<string | null>(null);

  // Nouvel état pour gérer la visibilité du mot de passe
  const [showPassword, setShowPassword] = useState(false);
  // État pour ouvrir/fermer le message de succès
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };
  const handleSave = () => {
    setError(null);
    const validationError = validateInputs(email, password);

    if (validationError) {
      setError(validationError);
      return;
    }

    updateAuthCredentials(email, password);

    // Déclenche l'affichage du message de succès
    setOpenSnackbar(true);
  };
  return (
    <Box p={3}>
      <Typography variant="h5">Profilzugriffsparameter</Typography>

      {error && (
        <Typography color="error" sx={{ mt: 2, fontWeight: "bold" }}>
          {error}
        </Typography>
      )}

      <Box mt={2}>
        <TextField
          label="Email Admin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          error={!!error && error.includes("e-mail")}
        />

        <TextField
          label="Neues Passwort"
          // Type dynamique : 'text' pour voir, 'password' pour masquer
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          helperText="Mindestens 8 Zeichen, ein Großbuchstabe und eine Ziffer"
          error={!!error && error.includes("mot de passe")}
          // Ajout de l'icône à la fin du champ (endAdornment)
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ mt: 2 }}
        >
          Speichern
        </Button>

        {/* Notification de succès professionnelle */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Identifiants mis à jour avec succès !
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default AdminProfile;
