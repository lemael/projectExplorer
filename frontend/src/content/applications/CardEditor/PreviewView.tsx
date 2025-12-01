// PreviewView.tsx

import { X } from "lucide-react";
import React from "react";
import { Layer } from "../../../Types/types";
import { DraggableLayer } from "./DraggableLayer";

interface PreviewViewProps {
  layers: Layer[];
  onClose: () => void;
}

// Le composant d'affichage de la prévisualisation
export const PreviewView: React.FC<PreviewViewProps> = ({
  layers,
  onClose,
}) => {
  // Style de conteneur similaire à LayerContainer, mais plus ciblé pour la prévisualisation
  const previewContainerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.95)", // Fond sombre pour la focalisation
    zIndex: 1000, // Doit être au-dessus de tout
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  };

  const previewContentStyle: React.CSSProperties = {
    width: "90%",
    height: "90%",
    backgroundColor: "white", // Le "papier" où les calques sont posés
    borderRadius: "10px",
    position: "relative",
    boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
    overflow: "hidden",
  };

  return (
    <div style={previewContainerStyle}>
      {/* Bouton de Fermeture */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          backgroundColor: "transparent",
          color: "white",
          border: "none",
          fontSize: "24px",
          cursor: "pointer",
          padding: "10px",
          borderRadius: "50%",
          opacity: 0.8,
        }}
      >
        <X size={30} />
      </button>

      {/* Zone d'Affichage des Calques */}
      <div style={previewContentStyle}>
        {layers
          .sort((a, b) => a.z - b.z) // Afficher dans le bon ordre Z
          .map((layer) => (
            // Utilisation de DraggableLayer, mais on met onDragStart à une fonction vide
            <DraggableLayer
              key={layer.id}
              layer={layer}
              draggingId={null} // Pas de glissement en mode prévisualisation
              onDragStart={(e) => e.preventDefault()} // Empêche le drag
            />
          ))}
      </div>
    </div>
  );
};
