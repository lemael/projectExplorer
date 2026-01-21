// Valeurs par défaut (si rien n'est stocké)
const DEFAULT_EMAIL = "jopke@jopke.de";
const DEFAULT_PASSWORD = "1234";

export const getAuthCredentials = () => {
  return {
    email: localStorage.getItem("admin_email") || DEFAULT_EMAIL,
    password: localStorage.getItem("admin_password") || DEFAULT_PASSWORD,
  };
};

export const updateAuthCredentials = (
  newEmail: string,
  newPassword: string,
) => {
  localStorage.setItem("admin_email", newEmail);
  localStorage.setItem("admin_password", newPassword);
};
