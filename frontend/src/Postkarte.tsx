import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// --- TYPES & INTERFACES ---

export type LayerType = "background" | "image" | "text";

export interface Layer {
  id: string;
  type: LayerType;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number; // Index Z pour l'ordre des calques
  rotation: number;
  opacity: number;
  // Propriétés optionnelles spécifiques au type
  src?: string; // Pour les images/fonds d'écran
  text?: string; // Pour le texte
  fontSize: number; // Pour le texte
  color: string; // Pour le texte et le fond (ou couleur de fond)
}

// --- LOGIQUE DE PERSISTENCE (LOCAL STORAGE) ---

const STORAGE_KEY = "postcardLayers_v2";

/**
 * Crée un calque de fond par défaut.
 */
const createDefaultBackground = (): Layer => ({
  id: crypto.randomUUID(),
  type: "background",
  x: 0,
  y: 0,
  width: 500,
  height: 350,
  z: 1, // Le fond a toujours le Z-index le plus bas
  rotation: 0,
  opacity: 1,
  fontSize: 24,
  color: "#fefefe",
});

/**
 * Charge les calques depuis le stockage local ou retourne un calque de fond par défaut.
 */
const loadLayers = (): Layer[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedLayers: Layer[] = JSON.parse(stored);
      // S'assurer qu'il y a au moins un calque de fond
      if (!parsedLayers.some((l) => l.type === "background")) {
        // Si le fond manque, on le crée et on le place en Z=1
        return [createDefaultBackground(), ...parsedLayers].sort(
          (a, b) => a.z - b.z
        );
      }
      return parsedLayers.sort((a, b) => a.z - b.z);
    }
  } catch (e) {
    console.error("Erreur lors du chargement des calques:", e);
  }
  return [createDefaultBackground()];
};

/**
 * Sauvegarde les calques dans le stockage local.
 */
const saveLayers = (layers: Layer[]): void => {
  try {
    // S'assurer que le tableau est trié avant de sauvegarder pour un chargement cohérent
    const sortedLayers = [...layers].sort((a, b) => a.z - b.z);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedLayers));
  } catch (e) {
    console.error("Erreur lors de la sauvegarde des calques:", e);
  }
};

/**
 * Hook personnalisé: support du glissement pour un calque (drag)
 */
function useLayerDrag(
  id: string,
  isMovable: boolean,
  canvasWidth: number,
  canvasHeight: number,
  getLayer: () => Layer | undefined,
  updateLayer: (id: string, patch: Partial<Layer>) => void,
  setSelectedId: (id: string | null) => void
): void {
  useEffect(() => {
    // Si le calque n'est pas mobile (comme le fond), on ne met en place aucun écouteur.
    if (!isMovable) return;

    const el = document.getElementById(id);
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;
    let isDragging = false;

    // Fonction utilitaire pour obtenir la position client (souris ou touche)
    const getClientPosition = (e: MouseEvent | TouchEvent) => {
      const isTouch = "touches" in e;
      const t = isTouch ? e.touches[0] : (e as MouseEvent);
      return { clientX: t.clientX, clientY: t.clientY };
    };

    // --- Logique de mouvement et de contrainte ---
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;

      const pos = getClientPosition(e);
      const dx = pos.clientX - startX;
      const dy = pos.clientY - startY;

      const layer = getLayer();
      if (!layer) return;

      const newX = startLeft + dx;
      const newY = startTop + dy;

      // CONTRAINTE : Empêcher le glissement en dehors des limites du canevas
      // Le calque doit rester entre 0 et (Canvas Dimension - Layer Dimension)
      const clampedX = Math.max(0, Math.min(newX, canvasWidth - layer.width));
      const clampedY = Math.max(0, Math.min(newY, canvasHeight - layer.height));

      updateLayer(id, {
        x: clampedX,
        y: clampedY,
      });
    };

    // --- Gestionnaires de souris ---
    function onMouseDown(e: MouseEvent): void {
      const target = e.target as HTMLElement;
      // Empêcher le glissement si on clique sur la poignée de redimensionnement
      if (target.classList.contains("resize-handle")) return;

      e.preventDefault();

      const layer = getLayer();
      if (!layer) return;

      setSelectedId(id);
      isDragging = true;
      const pos = getClientPosition(e);
      startX = pos.clientX;
      startY = pos.clientY;
      startLeft = layer.x;
      startTop = layer.y;

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }

    function onMouseMove(e: MouseEvent): void {
      handleMove(e);
    }

    function onMouseUp(): void {
      if (!isDragging) return;
      isDragging = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }

    // --- Gestionnaires tactiles (mobile) ---
    function onTouchStart(e: TouchEvent): void {
      const target = e.target as HTMLElement;
      if (target.classList.contains("resize-handle")) return;

      const layer = getLayer();
      if (!layer) return;

      setSelectedId(id);
      isDragging = true;
      const pos = getClientPosition(e);
      startX = pos.clientX;
      startY = pos.clientY;
      startLeft = layer.x;
      startTop = layer.y;

      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("touchend", onTouchEnd);
    }

    function onTouchMove(e: TouchEvent): void {
      e.preventDefault(); // Empêcher le défilement pendant le glissement
      handleMove(e);
    }

    function onTouchEnd(): void {
      if (!isDragging) return;
      isDragging = false;
      window.removeEventListener("touchmove", onTouchMove as EventListener);
      window.removeEventListener("touchend", onTouchEnd);
    }

    // Attachement des écouteurs
    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("touchstart", onTouchStart, { passive: true });

    // Nettoyage lors du démontage du composant
    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("touchstart", onTouchStart as EventListener);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove as EventListener);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [
    id,
    isMovable,
    canvasWidth,
    canvasHeight,
    getLayer,
    updateLayer,
    setSelectedId,
  ]);
}

// --- COMPOSANT DE CALQUE DRAGGABLE ---

interface DraggableLayerProps {
  layer: Layer;
  isSelected: boolean;
  updateLayer: (id: string, patch: Partial<Layer>) => void;
  setSelectedId: (id: string | null) => void;
  startResize: (
    id: string,
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => void;
  getLayer: () => Layer | undefined;
  canvasWidth: number;
  canvasHeight: number;
}

const DraggableLayer: React.FC<DraggableLayerProps> = ({
  layer,
  isSelected,
  updateLayer,
  setSelectedId,
  startResize,
  getLayer,
  canvasWidth,
  canvasHeight,
}) => {
  // Le calque de fond ne doit pas être glissé ni redimensionné
  const isMovable = layer.type !== "background";

  useLayerDrag(
    layer.id,
    isMovable,
    canvasWidth,
    canvasHeight,
    getLayer,
    updateLayer,
    setSelectedId
  );

  // Combinaison du démarrage de la souris et du toucher pour le redimensionnement
  const onStartResize = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (isSelected && isMovable) {
      startResize(layer.id, e);
      e.stopPropagation(); // Arrêter la propagation pour éviter le déclenchement du glissement
    }
  };

  const cursorStyle = isMovable ? "move" : "default";

  return (
    <div
      id={layer.id}
      onClick={(e) => {
        if (!e.defaultPrevented) setSelectedId(layer.id);
      }}
      className={`absolute select-none box-border transition-shadow duration-100 ${
        isSelected
          ? "ring-2 ring-indigo-500 shadow-xl"
          : "shadow-md hover:shadow-lg"
      } ${layer.type === "text" ? "p-2" : ""}`}
      style={{
        left: layer.x,
        top: layer.y,
        width: layer.width,
        height: layer.height,
        zIndex: layer.z,
        transform: `rotate(${layer.rotation}deg)`,
        opacity: layer.opacity,
        cursor: cursorStyle,
        backgroundColor:
          layer.type === "background" && !layer.src
            ? layer.color
            : "transparent",
        borderRadius: "8px",
      }}
    >
      {/* Rendu du Contenu */}
      {layer.type === "image" && (
        <>
          {layer.src ? (
            <img
              src={layer.src}
              alt="Calque d'Image"
              draggable={false}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "6px",
                userSelect: "none", // Rendre l'image non sélectionnable
                // WebkitUserDrag n'est pas nécessaire et cause des erreurs de typage
              }}
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                // Placeholder de secours
                target.src =
                  "https://placehold.co/400x300/e0e0e0/555?text=Erreur+Image";
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 bg-gray-100 rounded">
              Ajouter Image (Vide)
            </div>
          )}
        </>
      )}

      {layer.type === "text" && (
        <div className="h-full w-full overflow-hidden flex items-center justify-center">
          <div
            style={{
              fontSize: layer.fontSize,
              color: layer.color,
              textAlign: "center",
              fontWeight: "bold",
              whiteSpace: "pre-wrap",
            }}
          >
            {layer.text || "Texte"}
          </div>
        </div>
      )}

      {/* Poignée de Redimensionnement (visible uniquement si sélectionné et mobile) */}
      {isSelected && isMovable && (
        <div
          className="resize-handle absolute -right-2 -bottom-2 w-5 h-5 bg-indigo-600 rounded-full cursor-se-resize shadow-md hover:bg-indigo-700 transition duration-100 border-2 border-white"
          onMouseDown={onStartResize}
          onTouchStart={onStartResize}
        />
      )}
    </div>
  );
};

// --- COMPOSANT D'ÉLÉMENT DE CALQUE (BARRE LATÉRALE) ---

interface LayerItemProps {
  layer: Layer;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onBringForward: (id: string, direction: "forward" | "backward") => void;
  onRemove: (id: string) => void;
}

const LayerItem: React.FC<LayerItemProps> = ({
  layer,
  isSelected,
  onSelect,
  onBringForward,
  onRemove,
}) => {
  const isBackground = layer.type === "background";

  return (
    <div
      className={`border p-2 rounded-lg flex justify-between items-center transition-all duration-100 ${
        isSelected
          ? "bg-indigo-50 border-indigo-400"
          : "bg-white hover:bg-gray-50 border-gray-200"
      }`}
    >
      <div onClick={() => onSelect(layer.id)} className="flex-1 cursor-pointer">
        <div className="text-sm font-semibold capitalize text-indigo-700">
          {layer.type} {isBackground && "(Fond)"}
        </div>
        <div className="text-xs text-slate-500 truncate">
          {layer.type === "text"
            ? layer.text?.substring(0, 20) || "Texte vide"
            : `${Math.round(layer.width)}x${Math.round(layer.height)}`}
        </div>
      </div>
      <div className="flex gap-2 ml-4">
        {/* Boutons de Z-Index (cachés pour le fond) */}
        {!isBackground && (
          <>
            <button
              className="text-sm p-1 bg-white border rounded shadow hover:bg-gray-100 transition-colors"
              title="Monter le calque (Z-index)"
              onClick={() => onBringForward(layer.id, "forward")}
            >
              ↑
            </button>
            <button
              className="text-sm p-1 bg-white border rounded shadow hover:bg-gray-100 transition-colors"
              title="Descendre le calque (Z-index)"
              onClick={() => onBringForward(layer.id, "backward")}
            >
              ↓
            </button>
          </>
        )}

        {/* Bouton de suppression (caché pour le fond) */}
        {!isBackground && (
          <button
            className="text-sm p-1 text-red-600 bg-red-50 border border-red-200 rounded shadow hover:bg-red-100 transition-colors"
            title="Supprimer"
            onClick={() => onRemove(layer.id)}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

// --- COMPOSANT DU PANNEAU DE PROPRIÉTÉS ---

interface PropertiesPanelProps {
  selectedLayer: Layer | undefined;
  onUpdateLayer: (id: string, patch: Partial<Layer>) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedLayer,
  onUpdateLayer,
}) => {
  if (!selectedLayer) {
    return (
      <div className="p-4 text-center text-sm text-slate-500 bg-white rounded-lg shadow">
        Sélectionnez un calque pour modifier ses propriétés.
      </div>
    );
  }

  const { id } = selectedLayer;
  const isBackground = selectedLayer.type === "background";

  // Gestionnaire pour toutes les entrées standard (nombre/chaîne)
  const handleChange = (key: keyof Layer, value: any) => {
    if (id) {
      // Assure que les valeurs numériques sont des nombres
      let parsedValue = value;
      if (typeof selectedLayer[key] === "number") {
        parsedValue = parseFloat(value) || 0;
      }
      onUpdateLayer(id, { [key]: parsedValue } as Partial<Layer>);
    }
  };

  // Valeurs par défaut sécurisées
  const safeValue = (key: keyof Layer, fallback: any): any =>
    (selectedLayer[key] as any) ?? fallback;

  return (
    <div className="p-4 bg-white rounded-lg shadow-xl space-y-4">
      <h2 className="text-xl font-bold text-indigo-700 capitalize">
        {selectedLayer.type} • {id.substring(0, 4)}...
      </h2>

      {/* Dimensions & Position */}
      <div className="grid grid-cols-2 gap-4">
        {/* Position X */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">
            Position X (px)
          </label>
          <input
            type="number"
            value={Math.round(safeValue("x", 0))}
            onChange={(e) => handleChange("x", e.target.value)}
            disabled={isBackground}
            className={`w-full border rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 ${
              isBackground ? "bg-gray-100" : ""
            }`}
          />
        </div>
        {/* Position Y */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">
            Position Y (px)
          </label>
          <input
            type="number"
            value={Math.round(safeValue("y", 0))}
            onChange={(e) => handleChange("y", e.target.value)}
            disabled={isBackground}
            className={`w-full border rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 ${
              isBackground ? "bg-gray-100" : ""
            }`}
          />
        </div>
        {/* Largeur */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">
            Largeur (px)
          </label>
          <input
            type="number"
            value={Math.round(safeValue("width", 100))}
            onChange={(e) =>
              handleChange("width", Math.max(10, parseFloat(e.target.value)))
            }
            className="w-full border rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        {/* Hauteur */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">
            Hauteur (px)
          </label>
          <input
            type="number"
            value={Math.round(safeValue("height", 100))}
            onChange={(e) =>
              handleChange("height", Math.max(10, parseFloat(e.target.value)))
            }
            className="w-full border rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Rotation & Opacité (cachés pour le fond) */}
      {!isBackground && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              Rotation (deg)
            </label>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={safeValue("rotation", 0)}
              onChange={(e) =>
                handleChange("rotation", parseInt(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-right text-xs text-gray-500">
              {safeValue("rotation", 0)}°
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              Opacité (0-1)
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={safeValue("opacity", 1)}
              onChange={(e) =>
                handleChange("opacity", parseFloat(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-right text-xs text-gray-500">
              {(safeValue("opacity", 1) * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      )}

      {/* Propriétés spécifiques au Texte */}
      {selectedLayer.type === "text" && (
        <div className="space-y-4 pt-2 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700">
            Propriétés du Texte
          </h3>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Texte</label>
            <textarea
              value={safeValue("text", "")}
              onChange={(e) => handleChange("text", e.target.value)}
              rows={3}
              className="w-full border rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Taille
              </label>
              <input
                type="number"
                min="8"
                value={Math.round(safeValue("fontSize", 24))}
                onChange={(e) =>
                  handleChange(
                    "fontSize",
                    Math.max(8, parseInt(e.target.value))
                  )
                }
                className="w-full border rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Couleur
              </label>
              <input
                type="color"
                value={safeValue("color", "#000000")}
                onChange={(e) => handleChange("color", e.target.value)}
                className="w-full h-10 p-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Image URL et Couleur de Fond */}
      {(selectedLayer.type === "image" ||
        selectedLayer.type === "background") && (
        <div className="space-y-4 pt-2 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700">Image / Fond</h3>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              URL de l'Image (facultatif)
            </label>
            <input
              type="text"
              value={safeValue("src", "")}
              onChange={(e) => handleChange("src", e.target.value)}
              placeholder="Coller l'URL de l'image ici"
              className="w-full border rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              Couleur de Secours
            </label>
            <input
              type="color"
              value={safeValue("color", "#ffffff")}
              onChange={(e) => handleChange("color", e.target.value)}
              className="w-full h-10 p-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// --- COMPOSANT PRINCIPAL DE L'APPLICATION ---

const Postkarte: React.FC = () => {
  // Chargement initial depuis localStorage
  const [layers, setLayers] = useState<Layer[]>(() => loadLayers());
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  // État pour la logique de redimensionnement
  const resizeState = useRef<{
    id: string | null;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
  }>({ id: null, startX: 0, startY: 0, startW: 0, startH: 0 });

  // --- PERSISTENCE : Sauvegarde dans localStorage lors du changement de 'layers' ---
  useEffect(() => {
    saveLayers(layers);
  }, [layers]);

  // --- MAPPAGE DES COMPOSANTS UI / LOGIQUE GLOBALE ---

  const getLayerById = useCallback(
    (id: string): Layer | undefined => {
      return layers.find((l) => l.id === id);
    },
    [layers]
  );

  const selectedLayer: Layer | undefined = useMemo(
    () => getLayerById(selectedLayerId || ""),
    [selectedLayerId, getLayerById]
  );

  // Trouver le calque de fond. Il est garanti d'exister.
  const backgroundLayer: Layer =
    layers.find((l) => l.type === "background") || createDefaultBackground();

  // Définir la taille du canevas pour les contraintes de glissement et le style
  const canvasWidth = backgroundLayer.width;
  const canvasHeight = backgroundLayer.height;

  // Style du conteneur de la carte postale
  const canvasStyle: React.CSSProperties = {
    width: canvasWidth,
    height: canvasHeight,
    backgroundColor: backgroundLayer.color,
    backgroundImage: backgroundLayer.src
      ? `url(${backgroundLayer.src})`
      : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    maxWidth: "100%",
    maxHeight: "100%",
  };

  // --- LOGIQUE CRUD (LOCALE) ---

  const addLayer = useCallback(
    (type: LayerType) => {
      const newId: string = crypto.randomUUID();
      const maxZ = layers.length > 0 ? Math.max(...layers.map((l) => l.z)) : 0;
      const newZ: number = maxZ + 1;

      // Définir largeur et hauteur par défaut en fonction du type et de la zone
      let width = type === "image" ? 150 : type === "text" ? 200 : canvasWidth;
      let height =
        type === "image" ? 150 : type === "text" ? 100 : canvasHeight;

      // Position initiale centrée mais avec un décalage minimal de 20px pour ne pas dépasser
      const initialX = Math.min(
        Math.max(20, canvasWidth / 2 - width / 2),
        canvasWidth - width
      );
      const initialY = Math.min(
        Math.max(20, canvasHeight / 2 - height / 2),
        canvasHeight - height
      );

      const baseLayer: Layer = {
        id: newId,
        type,
        x: initialX,
        y: initialY,
        width,
        height,
        z: type === "background" ? 1 : newZ,
        rotation: 0,
        opacity: 1,
        fontSize: 24,
        color: "#000000",
        text: type === "text" ? "Votre Texte" : undefined,
        src:
          type === "image"
            ? "https://placehold.co/150x150/8b5cf6/fff?text=Image"
            : undefined,
      };

      if (type === "background") {
        setLayers((prev) => {
          const existingBackground = prev.find((l) => l.type === "background");
          if (existingBackground) {
            return prev.map((l) =>
              l.id === existingBackground.id
                ? { ...baseLayer, id: existingBackground.id }
                : l
            );
          }
          return [...prev, baseLayer].sort((a, b) => a.z - b.z);
        });
      } else {
        setLayers((prev) => [...prev, baseLayer].sort((a, b) => a.z - b.z));
      }

      setSelectedLayerId(newId);
    },
    [layers, canvasWidth, canvasHeight]
  );

  const updateLayer = useCallback(
    (id: string, patch: Partial<Layer>) => {
      setLayers((prev) => {
        const updatedLayers = prev.map((l) => {
          if (l.id === id) {
            let updated = { ...l, ...patch };

            // SECURITÉ: Appliquer les contraintes aux dimensions du calque de fond uniquement
            if (
              l.type === "background" &&
              (patch.width !== undefined || patch.height !== undefined)
            ) {
              // Si le fond est redimensionné, on retourne la mise à jour sans contrainte
              return updated;
            }

            // Pour les calques mobiles: S'assurer qu'ils restent dans les limites du canevas (backgroundLayer)
            if (l.type !== "background") {
              const currentCanvasWidth = backgroundLayer.width;
              const currentCanvasHeight = backgroundLayer.height;

              // 1. Mise à jour de la largeur/hauteur, plafonnée à la taille du canevas
              if (updated.width !== undefined)
                updated.width = Math.max(
                  10,
                  Math.min(updated.width, currentCanvasWidth)
                );
              if (updated.height !== undefined)
                updated.height = Math.max(
                  10,
                  Math.min(updated.height, currentCanvasHeight)
                );

              // 2. Mise à jour de la position X/Y, CLAMPÉE en fonction de la nouvelle taille
              if (updated.x !== undefined)
                updated.x = Math.max(
                  0,
                  Math.min(updated.x, currentCanvasWidth - updated.width)
                );
              if (updated.y !== undefined)
                updated.y = Math.max(
                  0,
                  Math.min(updated.y, currentCanvasHeight - updated.height)
                );
            }

            return updated;
          }
          return l;
        });
        // Maintenir le tri par Z-index après la mise à jour
        return updatedLayers.sort((a, b) => a.z - b.z);
      });
    },
    [backgroundLayer]
  );

  const removeLayer = useCallback(
    (id: string) => {
      setLayers((prev) => prev.filter((l) => l.id !== id));
      if (selectedLayerId === id) setSelectedLayerId(null);
    },
    [selectedLayerId]
  );

  const handleZIndex = useCallback(
    (id: string, direction: "forward" | "backward") => {
      setLayers((prevLayers) => {
        // 1. Copier et trier pour obtenir l'ordre actuel
        const sortedLayers = [...prevLayers].sort((a, b) => a.z - b.z);
        const currentIndex = sortedLayers.findIndex((l) => l.id === id);

        if (currentIndex === -1) return prevLayers;
        if (sortedLayers[currentIndex].type === "background") return prevLayers; // Ne jamais bouger le fond

        let targetIndex = currentIndex + (direction === "forward" ? 1 : -1);

        // Le fond est toujours à l'index 0 après le tri. On ne peut pas descendre en dessous de l'index 1.
        if (targetIndex < 1 || targetIndex >= sortedLayers.length) {
          return prevLayers; // Limite atteinte ou tentative de bouger le fond
        }

        const currentLayer = sortedLayers[currentIndex];
        const targetLayer = sortedLayers[targetIndex];

        // Échanger les valeurs de Z
        const newZ = targetLayer.z;
        const targetZ = currentLayer.z;

        // Mise à jour de l'état
        return prevLayers
          .map((l) => {
            if (l.id === currentLayer.id) return { ...l, z: newZ };
            if (l.id === targetLayer.id) return { ...l, z: targetZ };
            return l;
          })
          .sort((a, b) => a.z - b.z); // Trier pour maintenir la cohérence de l'ordre d'affichage
      });
    },
    []
  );

  // --- LOGIQUE DE REDIMENSIONNEMENT ---

  const startResize = useCallback(
    (
      id: string,
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      const layer = getLayerById(id);
      if (!layer || layer.type === "background") return;

      const clientX: number = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY: number = "touches" in e ? e.touches[0].clientY : e.clientY;

      resizeState.current = {
        id,
        startX: clientX,
        startY: clientY,
        startW: layer.width,
        startH: layer.height,
      };

      // Ajout des écouteurs globaux
      window.addEventListener("mousemove", onResizeMouseMove);
      window.addEventListener("mouseup", onResizeMouseUp);
      window.addEventListener("touchmove", onResizeTouchMove, {
        passive: false,
      });
      window.addEventListener("touchend", onResizeTouchUp);
    },
    [getLayerById]
  );

  const onResizeMouseMove = useCallback(
    (e: MouseEvent) => {
      const { id, startX, startY, startW, startH } = resizeState.current;
      if (!id) return;

      const layer = getLayerById(id);
      if (!layer) return;

      const dx: number = e.clientX - startX;
      const dy: number = e.clientY - startY;

      let newWidth: number = startW + dx;
      let newHeight: number = startH + dy;

      // CONTRAINTE: Limiter la taille maximale à celle du canevas
      newWidth = Math.min(newWidth, canvasWidth - layer.x);
      newHeight = Math.min(newHeight, canvasHeight - layer.y);

      // Limite minimale (10px)
      newWidth = Math.max(10, newWidth);
      newHeight = Math.max(10, newHeight);

      updateLayer(id, { width: newWidth, height: newHeight });
    },
    [updateLayer, getLayerById, canvasWidth, canvasHeight]
  );

  const onResizeTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      const { id, startX, startY, startW, startH } = resizeState.current;
      if (!id) return;

      const layer = getLayerById(id);
      if (!layer) return;

      const t: Touch = e.touches[0];
      const dx: number = t.clientX - startX;
      const dy: number = t.clientY - startY;

      let newWidth: number = startW + dx;
      let newHeight: number = startH + dy;

      // CONTRAINTE: Limiter la taille maximale à celle du canevas
      newWidth = Math.min(newWidth, canvasWidth - layer.x);
      newHeight = Math.min(newHeight, canvasHeight - layer.y);

      // Limite minimale (10px)
      newWidth = Math.max(10, newWidth);
      newHeight = Math.max(10, newHeight);

      updateLayer(id, { width: newWidth, height: newHeight });
    },
    [updateLayer, getLayerById, canvasWidth, canvasHeight]
  );

  const onResizeMouseUp = useCallback(() => {
    resizeState.current.id = null;
    // Retrait des écouteurs globaux
    window.removeEventListener("mousemove", onResizeMouseMove);
    window.removeEventListener("mouseup", onResizeMouseUp);
    window.removeEventListener("touchmove", onResizeTouchMove as EventListener);
    window.removeEventListener("touchend", onResizeTouchUp as EventListener);
  }, [onResizeMouseMove, onResizeTouchMove]);

  const onResizeTouchUp = useCallback(() => {
    resizeState.current.id = null;
    // Retrait des écouteurs globaux
    window.removeEventListener("mousemove", onResizeMouseMove);
    window.removeEventListener("mouseup", onResizeMouseUp);
    window.removeEventListener("touchmove", onResizeTouchMove as EventListener);
    window.removeEventListener("touchend", onResizeTouchUp as EventListener);
  }, [onResizeMouseMove, onResizeTouchMove]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4 flex flex-col lg:flex-row gap-4">
      {/* Barre Latérale / Outils */}
      <div className="w-full lg:w-64 space-y-4 flex-shrink-0">
        {/* Rappel du Mode de Stockage */}
        <div className="bg-yellow-100 p-3 rounded-lg shadow-md text-xs text-yellow-700 font-semibold break-words">
          Mode Local : Vos modifications sont sauvegardées uniquement dans ce
          navigateur.
        </div>

        <div className="bg-white p-4 rounded-lg shadow-xl space-y-3">
          <h2 className="text-lg font-bold text-gray-800">Ajouter Calque</h2>
          <div className="flex flex-col space-y-2">
            <button
              className="w-full p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-150 shadow"
              onClick={() => addLayer("text")}
            >
              Ajouter Texte
            </button>
            <button
              className="w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-150 shadow"
              onClick={() => addLayer("image")}
            >
              Ajouter Image
            </button>
            <button
              className="w-full p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-150 shadow"
              onClick={() => addLayer("background")}
            >
              Régler le Fond
            </button>
          </div>
        </div>

        {/* Liste des Calques */}
        <div className="bg-white p-4 rounded-lg shadow-xl space-y-3">
          <h2 className="text-lg font-bold text-gray-800">
            Calques ({layers.length})
          </h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {/* Affichage des calques du plus haut Z au plus bas pour la facilité d'édition */}
            {layers
              .slice()
              .sort((a, b) => b.z - a.z)
              .map((layer: Layer) => (
                <LayerItem
                  key={layer.id}
                  layer={layer}
                  isSelected={layer.id === selectedLayerId}
                  onSelect={setSelectedLayerId}
                  onBringForward={handleZIndex}
                  onRemove={removeLayer}
                />
              ))}
          </div>
        </div>
      </div>

      {/* Zone de Canevas et Propriétés */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4">
        {/* Zone de Canevas */}
        <div className="flex-1 flex justify-center items-center bg-gray-200 p-4 rounded-lg shadow-inner min-h-[300px]">
          <div
            className="relative bg-white shadow-2xl border border-gray-300 overflow-hidden transition-all duration-100 ease-in-out"
            style={{
              ...canvasStyle,
              cursor: resizeState.current.id ? "se-resize" : "default",
              // Mise à l'échelle si la carte est trop grande pour l'écran (mobile)
              transform:
                backgroundLayer.width > 500 ? `scale(0.8)` : "scale(1)",
            }}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              // Désélectionner si on clique sur le fond du canevas
              if (e.target === e.currentTarget) {
                setSelectedLayerId(null);
              }
            }}
          >
            {/* Rendu des calques triés par Z-index */}
            {layers.map((layer: Layer) => (
              <DraggableLayer
                key={layer.id}
                layer={layer}
                isSelected={layer.id === selectedLayerId}
                updateLayer={updateLayer}
                setSelectedId={setSelectedLayerId}
                startResize={startResize}
                getLayer={() => getLayerById(layer.id)}
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
              />
            ))}
          </div>
        </div>

        {/* Panneau de Propriétés */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <PropertiesPanel
            selectedLayer={selectedLayer}
            onUpdateLayer={updateLayer}
          />
        </div>
      </div>
    </div>
  );
};

export default Postkarte;
