// LayerDemo.tsx (Component Principal)

import React, { useCallback, useRef, useState } from "react";
import { containerStyles } from "../styles/LayerContainer.styles";
import { Layer } from "../styles/types";
import { DraggableLayer } from "./DraggableLayer"; // Importation du sous-composant
import { LayerEditorPanel } from "./LayerEditorPanel"; // Importation du panneau d'édition des calques

export default function LayerDemo(): React.JSX.Element {
  // ... (Vos états layers, draggingId, offset et containerRef)
  const containerRef = useRef<HTMLDivElement>(null);
  // ... (Initialisation de layers)
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [layers, setLayers] = useState<Layer[]>([]); // (Liste des calques)

  // 🔸 Gérer la sélection/désélection d'un calque
  const handleSelectLayer = useCallback(
    (id: string) => {
      // Si le calque cliqué est déjà sélectionné, on le désélectionne (toggle)
      if (selectedId === id) {
        setSelectedId(null);
      } else {
        // Sinon, on sélectionne le nouveau calque
        setSelectedId(id);
      }
    },
    [selectedId]
  );

  //  NOUVELLE FONCTION: Gère la mise à jour des propriétés (utilisée par le panneau)
  const handleUpdateLayer = useCallback(
    (id: string, updates: Partial<Layer>) => {
      setLayers((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
      );
    },
    []
  );
  // 🔸 Modifier le texte d'un calque sélectionné

  //  FONCTION POUR AJOUTER UN CALQUE
  const handleAddLayer = useCallback(() => {
    // Déterminer le prochain ID (méthode simple)
    const newId = `layer${layers.length + 1}`;

    // Déterminer la prochaine valeur z (toujours au-dessus des autres)
    const nextZ = layers.reduce((max, l) => Math.max(max, l.z), 0) + 1;

    // Choisir une position aléatoire ou fixe pour le nouveau calque
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

    const newLayer: Layer = {
      id: newId,
      type: "text", // Par défaut, un calque de texte
      x: 50 + Math.random() * 100, // Position légèrement aléatoire pour ne pas être empilé
      y: 50 + Math.random() * 100,
      width: 180,
      height: 50,
      color: randomColor,
      text: `Nouveau Calque ${nextZ}`,
      z: nextZ,
    };

    // Mettre à jour l'état en ajoutant le nouveau calque
    setLayers((prev) => [...prev, newLayer]);
  }, [layers]); // Dépend de `layers` pour le calcul de l'ID/Z-index
  // 🔸 Fonction handleMouseDown renommée en handleDragStart
  const handleDragStart = useCallback(
    (e: React.MouseEvent, id: string) => {
      const layer = layers.find((l) => l.id === id);
      if (!layer) return;
      setDraggingId(id);
      setOffset({
        x: e.clientX - layer.x,
        y: e.clientY - layer.y,
      });
    },
    [layers]
  );

  // 🔸 Déplacer le calque (reste ici)
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!draggingId) return;

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const newX = e.clientX - rect.left - offset.x;
      const newY = e.clientY - rect.top - offset.y;

      setLayers((prev) =>
        prev.map((l) =>
          l.id === draggingId
            ? {
                ...l,
                x: Math.max(0, Math.min(newX, rect.width - l.width)),
                y: Math.max(0, Math.min(newY, rect.height - l.height)),
              }
            : l
        )
      );
    },
    [draggingId, offset]
  );

  // 🔸 Fin du drag (reste ici)
  const handleMouseUp = () => setDraggingId(null);

  return (
    <>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={containerStyles}
      >
        {layers
          .sort((a, b) => a.z - b.z)
          .map((layer) => (
            <DraggableLayer
              key={layer.id}
              layer={layer}
              draggingId={draggingId}
              onDragStart={handleDragStart} // Passe la fonction d'initialisation au sous-composant
            />
          ))}
      </div>
      <div style={{ padding: 20, backgroundColor: "#f0f4f8" }}>
        {/*  BOUTON D'AJOUT DE CALQUE */}
        <button
          onClick={handleAddLayer}
          style={{
            padding: "10px 15px",
            marginBottom: 20,
            backgroundColor: "#10b981", // vert émeraude
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          ➕ Ajouter un Calque
        </button>
        <LayerEditorPanel
          layers={layers}
          selectedId={selectedId}
          onSelectLayer={handleSelectLayer} // Permet de sélectionner via la liste
          onUpdateLayer={handleUpdateLayer} // Permet de modifier les propriétés
        />
      </div>
    </>
  );
}
