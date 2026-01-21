import html2canvas from "html2canvas";
import { API_CONFIG } from "../../../api/config";

// On définit la liste des catégories autorisées (doit correspondre à LayerDemo.tsx)
const VALID_CATEGORIES = [
  "Kuvertierte_Mailings",
  "Selfmailer_mit_Verschlussklappe",
  "Selfmailer_ohne_Verschlussklappe",
];

const handleSaveImage = async (
  element: HTMLDivElement | null,
  category: string,
) => {
  // 1. Vérification de l'élément DOM
  if (!element) return;

  // 2. Vérification de la catégorie (Condition demandée)
  if (!category || !VALID_CATEGORIES.includes(category)) {
    console.error("Catégorie invalide ou manquante :", category);
    alert("Veuillez sélectionner une catégorie valide avant de sauvegarder.");
    return; // On arrête l'exécution ici
  }

  try {
    const html2canvasFunc = (html2canvas as any).default || html2canvas;

    const canvas = await html2canvasFunc(element, {
      useCORS: true,
      scale: 2,
      backgroundColor: "#ffffff",
    });

    canvas.toBlob(async (blob: Blob | null) => {
      if (!blob) {
        console.error("Le canvas est vide");
        return;
      }

      // Nettoyage et préparation du fichier
      const cleanCategory = category.replace(/\s+/g, "-");
      const fileName = `${cleanCategory}-${Date.now()}.png`;

      const formData = new FormData();
      formData.append("imageFile", blob, fileName);

      console.log(`Envoi de l'image (${category}) au backend...`);
      // Utilisation de la configuration API
      const API_BASE_URL = API_CONFIG.BASE_URL;
      try {
        const response = await fetch(`${API_BASE_URL}/api/images/upload`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Succès ! URL Cloudinary :", result.url);
          alert(
            `Image sauvegardée avec succès dans : ${category.replace(/_/g, " ")}`,
          );
        } else {
          alert("Erreur serveur lors de la sauvegarde.");
        }
      } catch (fetchError) {
        console.error("Erreur de connexion :", fetchError);
        alert("Erreur de connexion au serveur.");
      }
    }, "image/png");
  } catch (error) {
    console.error("Fehler beim Verarbeiten:", error);
  }
};

export default handleSaveImage;
