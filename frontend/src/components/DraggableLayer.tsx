// DraggableLayer.tsx

import React from "react";
import { Layer } from "../styles/types"; // Assurez-vous d'exporter vos types

interface DraggableLayerProps {
  layer: Layer;
  draggingId: string | null;
  // onDragStart remplace handleMouseDown ici
  onDragStart: (e: React.MouseEvent, id: string) => void;
}

export const DraggableLayer: React.FC<DraggableLayerProps> = ({
  layer,
  draggingId,
  onDragStart,
}) => {
  return (
    <div
      key={layer.id}
      onMouseDown={(e) => onDragStart(e, layer.id)} // Déclenche le drag dans le parent
      style={{
        position: "absolute",
        left: layer.x,
        top: layer.y,
        width: layer.width,
        height: layer.height,
        backgroundColor: layer.backgroundColor,
        backgroundImage: layer.imageUrl ? `url(${layer.imageUrl})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
        cursor: "grab",
        userSelect: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        boxShadow:
          draggingId === layer.id
            ? "0 0 10px rgba(0,0,0,0.3)"
            : "0 2px 5px rgba(0,0,0,0.2)",
        zIndex: layer.z,
      }}
    >
      {layer.text || ""}
    </div>
  );
};
