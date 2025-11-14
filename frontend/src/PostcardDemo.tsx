import React, { useCallback, useRef, useState } from "react";

type LayerType = "image" | "text";

interface Layer {
  id: string;
  type: LayerType;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  text?: string;
  z: number;
}

export default function LayerDemo(): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  // 🔹 Deux calques superposables
  const [layers, setLayers] = useState<Layer[]>([
    {
      id: "layer1",
      type: "image",
      x: 100,
      y: 100,
      width: 150,
      height: 150,
      color: "#8b5cf6", // violet
      z: 1,
    },
    {
      id: "layer2",
      type: "text",
      x: 180,
      y: 160,
      width: 200,
      height: 80,
      color: "#f59e0b", // orange
      text: "Hallo Mael 👋",
      z: 2,
    },
  ]);

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // 🔸 Commencer le drag
  const handleMouseDown = useCallback(
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

  // 🔸 Déplacer le calque
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

  // 🔸 Fin du drag
  const handleMouseUp = () => setDraggingId(null);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        width: 600,
        height: 400,
        border: "2px solid #999",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#f8fafc",
      }}
    >
      {layers
        .sort((a, b) => a.z - b.z)
        .map((layer) => (
          <div
            key={layer.id}
            onMouseDown={(e) => handleMouseDown(e, layer.id)}
            style={{
              position: "absolute",
              left: layer.x,
              top: layer.y,
              width: layer.width,
              height: layer.height,
              backgroundColor: layer.color,
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
        ))}
    </div>
  );
}
