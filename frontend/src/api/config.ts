const isDevelopment = process.env.NODE_ENV === "development";

export const API_CONFIG = {
  BASE_URL: isDevelopment ? "http://localhost:5297" : "https://nomdusite.com",
  TIMEOUT: 5000,
};
