import React from "react";
import { Layer } from "../styles/types";

interface LayerEditorPanelProps {
  layers: Layer[];
  selectedId: string | null;
  onSelectLayer: (id: string) => void;
  onUpdateLayer: (id: string, updates: Partial<Layer>) => void;
}

export const LayerEditorPanel: React.FC<LayerEditorPanelProps> = ({
  layers,
  selectedId,
  onSelectLayer,
  onUpdateLayer,
}) => {
  // Calque actuellement sélectionné (celui dont nous affichons les propriétés)
  const selectedLayer = layers.find((l) => l.id === selectedId);

  // Gère le changement de sélection via la liste déroulante
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    onSelectLayer(id);
  };

  // Gère la modification des propriétés (texte, dimensions)
  const handlePropertyChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!selectedLayer) return;

    const { name, value } = e.target;
    let updateValue: string | number = value;

    // Convertir les dimensions en nombre
    // ⭐️ CHANGÉ : Vérifie 'width' et 'height'
    if (name === "width" || name === "height") {
      updateValue = parseInt(value, 10) || 0; // Assure que la valeur est un nombre
    }

    // Informe le parent de la mise à jour
    onUpdateLayer(selectedLayer.id, { [name]: updateValue });
  };

  // Styles
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontWeight: "bold",
    marginTop: "10px",
    fontSize: "0.9rem",
  };
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  // Style spécifique pour l'input de type 'color'
  const colorInputStyle: React.CSSProperties = {
    height: "40px",
    padding: "0",
    border: "1px solid #ccc",
    width: "50px", // Petite largeur pour l'échantillon de couleur
  };
  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h3 style={{ fontSize: "1.2rem", marginBottom: "15px" }}>
        Propriétés du Calque
      </h3>

      {/* 1. Liste Déroulante de Sélection */}
      <label style={labelStyle}>Sélectionner le Calque :</label>
      <select
        name="layer"
        value={selectedId || ""}
        onChange={handleSelectChange}
        style={{ ...inputStyle, marginBottom: "20px" }}
      >
        <option value="" disabled>
          -- Choisir un Calque --
        </option>
        {layers.map((l) => (
          <option key={l.id} value={l.id}>
            {l.text} (ID: {l.id})
          </option>
        ))}
      </select>

      {/* 2. Panneau d'Édition des Propriétés */}
      {selectedLayer ? (
        <div>
          <h4
            style={{
              fontSize: "1rem",
              borderTop: "1px solid #eee",
              paddingTop: "10px",
            }}
          >
            Édition : **{selectedLayer.text}**
          </h4>

          {/* Édition du Texte */}
          <label style={labelStyle} htmlFor="text">
            Texte :
          </label>
          <textarea
            name="text"
            value={selectedLayer.text}
            onChange={handlePropertyChange}
            style={{ ...inputStyle, height: "80px" }}
          />

          {/* Couleur */}
          <label style={labelStyle} htmlFor="color">
            Couleur :
          </label>
          <input
            type="color"
            name="color"
            value={selectedLayer.color}
            onChange={handlePropertyChange}
            style={colorInputStyle}
          />
          <span
            style={{ marginLeft: "10px", fontSize: "0.9rem", color: "#555" }}
          >
            {selectedLayer.color}
          </span>
          {/* Dimensions */}
          <div style={{ display: "flex", gap: "15px" }}>
            <div>
              <label style={labelStyle} htmlFor="width">
                Largeur (width) :
              </label>
              <input
                type="number"
                name="width" // ⭐️ CHANGÉ
                value={selectedLayer.width} // ⭐️ CHANGÉ
                onChange={handlePropertyChange}
                style={{ ...inputStyle, width: "80px" }}
              />
            </div>
            <div>
              <label style={labelStyle} htmlFor="height">
                Hauteur (height) :
              </label>
              <input
                type="number"
                name="height" // ⭐️ CHANGÉ
                value={selectedLayer.height} // ⭐️ CHANGÉ
                onChange={handlePropertyChange}
                style={{ ...inputStyle, width: "80px" }}
              />
            </div>
          </div>

          {/* Ordre Z-Index */}
          <label style={labelStyle} htmlFor="z">
            Ordre (Z-Index) :
          </label>
          <input
            type="number"
            name="z"
            value={selectedLayer.z}
            onChange={handlePropertyChange}
            style={{ ...inputStyle, width: "80px" }}
          />
        </div>
      ) : (
        <p style={{ color: "#888" }}>
          Veuillez sélectionner un calque pour modifier ses propriétés.
        </p>
      )}
    </div>
  );
};
