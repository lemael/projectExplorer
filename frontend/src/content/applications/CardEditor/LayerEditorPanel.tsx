import React, { useCallback, useState } from "react";
import { Layer } from "../../../Types/types";

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
  const [loading, setLoading] = useState(false);
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
  // NOUVELLE FONCTION : Gère le téléversement d'image depuis l'ordinateur
  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!selectedLayer || !e.target.files || e.target.files.length === 0)
        return;

      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        console.error("Le fichier sélectionné n'est pas une image.");
        return;
      }

      setLoading(true);

      const reader = new FileReader();
      reader.onload = (event) => {
        // Le résultat est la data:URL (base64) de l'image
        const dataUrl = event.target?.result as string;

        // Mettre à jour le calque avec la nouvelle data:URL
        onUpdateLayer(selectedLayer.id, { imageUrl: dataUrl });
        setLoading(false);
      };

      reader.onerror = (error) => {
        console.error("Erreur de lecture du fichier:", error);
        setLoading(false);
      };

      // Lire le fichier comme une Data URL
      reader.readAsDataURL(file);

      // Réinitialiser la valeur du champ de fichier pour pouvoir téléverser le même fichier à nouveau si nécessaire
      e.target.value = "";
    },
    [selectedLayer, onUpdateLayer]
  );

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
  const buttonStyle: React.CSSProperties = {
    padding: "8px 15px",
    backgroundColor: "#22c55e", // Vert de Tailwind (green-500)
    color: "white",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    marginTop: "10px",
    opacity: loading ? 0.7 : 1,
    pointerEvents: loading ? "none" : "auto",
  };
  const fileInputStyle: React.CSSProperties = {
    display: "none", // Cache l'input de fichier par défaut
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
        Eigenschaften der Ebene
      </h3>

      {/* 1. Liste Déroulante de Sélection */}
      <label style={labelStyle}>Ebene auswählen:</label>
      <select
        name="layer"
        value={selectedId || ""}
        onChange={handleSelectChange}
        style={{ ...inputStyle, marginBottom: "20px" }}
      >
        <option value="" disabled>
          -- Auswählen einer Ebene --
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
            Ausgabe: **{selectedLayer.text}**
          </h4>

          {/* Édition du Texte */}
          <label style={labelStyle} htmlFor="text">
            Text :
          </label>
          <textarea
            name="text"
            value={selectedLayer.text}
            onChange={handlePropertyChange}
            style={{ ...inputStyle, height: "80px" }}
          />

          {/* Couleur de Fond */}
          <label style={labelStyle} htmlFor="backgroundColor">
            Hintergrundfarbe (zb: #3498db) :
          </label>
          <input
            type="text"
            name="backgroundColor"
            value={selectedLayer.backgroundColor}
            onChange={handlePropertyChange}
            style={inputStyle}
            placeholder="#ffffff ou un nom de couleur"
          />

          {/* URL de l'Image de Fond (Manuelle) */}
          <label style={labelStyle} htmlFor="imageUrl">
            Hintergrundbild-URL :
          </label>
          <input
            type="text"
            name="imageUrl"
            value={selectedLayer.imageUrl}
            onChange={handlePropertyChange}
            style={inputStyle}
            placeholder="Ex: https://placehold.co/200x100"
          />

          {/* NOUVEAU : Téléversement de Fichier */}
          <div style={{ marginTop: "15px" }}>
            <label style={labelStyle}>Ein Bild hochladen:</label>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
              style={fileInputStyle}
              disabled={loading}
            />
            <label htmlFor="image-upload" style={buttonStyle}>
              {loading ? "Laden..." : "Datei auswählen"}
            </label>
            {selectedLayer.imageUrl &&
              !selectedLayer.imageUrl.startsWith("http") && (
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#666",
                    marginTop: "5px",
                  }}
                >
                  (Bild geladen)
                </p>
              )}
          </div>
          {/* Dimensions */}
          <div style={{ display: "flex", gap: "15px" }}>
            <div>
              <label style={labelStyle} htmlFor="width">
                width :
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
                height :
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
            Reihenfolge (Z-Index) :
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
          Bitte wählen Sie eine Ebene aus, um deren Eigenschaften zu ändern.
        </p>
      )}
    </div>
  );
};
