import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// Imports Toolpad Core
import { AppProvider } from "@toolpad/core/AppProvider";
import {
  SignInPage,
  type AuthProvider,
  type AuthResponse,
} from "@toolpad/core/SignInPage";

// Imports internes
import { AuthContext } from "../../../auth/AuthContext";
import { signIn as checkCredentials } from "./handleConnection";

const providers = [{ id: "credentials", name: "Email and password" }];

export default function NotificationsSignInPageError() {
  const theme = useTheme();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  // État pour gérer la visibilité du mot de passe
  const [showPassword, setShowPassword] = useState(false);

  if (!authContext) {
    throw new Error("AuthContext est null");
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleToolpadSignIn = async (
    provider: AuthProvider,
    formData?: FormData,
  ): Promise<AuthResponse> => {
    const response = (await checkCredentials(
      provider,
      formData,
    )) as AuthResponse;

    if (response.error === "") {
      await authContext.login({});
      navigate("/dashboards", { replace: true });
    }

    return response;
  };

  return (
    <AppProvider theme={theme}>
      <SignInPage
        signIn={handleToolpadSignIn}
        providers={providers}
        slotProps={{
          emailField: { autoFocus: false },
          passwordField: {
            type: showPassword ? "text" : "password",
            InputProps: {
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
            },
          },
          form: { noValidate: true },
        }}
      />
    </AppProvider>
  );
}
