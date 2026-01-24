// docs/navigation.ts

document.addEventListener("DOMContentLoaded", () => {
  // Sélectionner tous les éléments de la sidebar qui doivent être cliquables
  const menuItems = document.querySelectorAll(".sidebar-link");

  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      const text = item.textContent?.trim().toLowerCase();

      // Logique de redirection basée sur le texte du menu
      if (text?.includes("voraussetzungen")) {
        window.location.href = "voraussetzungen.html";
      } else if (text?.includes("installation")) {
        // Si on clique sur le titre parent, on peut décider d'aller à l'index
        window.location.href = "voraussetzungen.html";
      } else if (text?.includes("download sources")) {
        window.location.href = "voraussetzungen.html";
      } else if (
        text?.includes("installieren sie dependencies und local packages")
      ) {
        window.location.href = "voraussetzungen.html";
      } else if (text?.includes("jopke service")) {
        window.location.href = "index.html";
      } else if (text?.includes("development server")) {
        window.location.href = "development-server.html";
      } else if (text?.includes("admin-dashboard")) {
        window.location.href = "admin-dashboard.html";
      } else if (text?.includes("user-pages")) {
        window.location.href = "use-pages.html";
      } else if (text?.includes("datenbankstruktur")) {
        window.location.href = "datenbankstruktur.html";
      }
    });
  });
});
