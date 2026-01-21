export const validateInputs = (email: string, pass: string): string | null => {
  // Regex pour l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
  }

  // Normes du mot de passe (min 8 caractères, 1 majuscule, 1 chiffre)
  if (pass.length < 8) {
    return "Das Passwort muss mindestens 8 Zeichen enthalten.";
  }
  if (!/[A-Z]/.test(pass)) {
    return "Das Passwort muss mindestens einen Großbuchstaben enthalten.";
  }
  if (!/[0-9]/.test(pass)) {
    return "Das Passwort muss mindestens eine Ziffer enthalten.";
  }

  return null; // Tout est OK
};
