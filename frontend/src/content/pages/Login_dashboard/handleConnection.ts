import { type AuthProvider, type AuthResponse } from "@toolpad/core/SignInPage";

export const signIn: (
  provider: AuthProvider,
  formData?: FormData,
) => Promise<AuthResponse> | void = async (provider, formData) => {
  // 1. Vérifie les identifiants

  const promise = new Promise<AuthResponse>((resolve) => {
    setTimeout(() => {
      const email = formData?.get("email");
      const password = formData?.get("password");
      const validEmail = "jopke@jopke.de";
      const validPassword = "1234";

      const isValid = email === validEmail && password === validPassword;
      const error = isValid ? "" : "E-Mail oder Passwort ist falsch.";

      resolve({
        type: "CredentialsSignin",
        error,
      });
    }, 300);
  });
  return promise;
};
