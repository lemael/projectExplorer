import { CSSProperties } from "react";

/**
 * Styles pour le composant LayerDemo.
 * Utiliser CSSProperties de 'react' assure un typage fort pour les objets de style.
 */
export const containerStyles: CSSProperties = {
  // Styles de base du conteneur d'édition
  minHeight: "400px",
  width: "100%",
  backgroundColor: "#f8f9fa", // Gris très clair pour le fond
  border: "2px solid #ced4da", // Bordure légère
  borderRadius: "8px",
  position: "relative", // Essentiel pour positionner les calques enfants
  overflow: "hidden", // Empêche les éléments de déborder
  cursor: "grab", // Curseur pour indiquer que le conteneur peut être manipulé (s'il s'agit d'une zone de travail)
  // Autres propriétés de style...
};
