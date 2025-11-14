/**
 * Définit les types possibles pour un calque (image ou texte).
 */
export type LayerType = "image" | "text";

/**
 * Interface représentant un seul calque déplaçable dans l'éditeur.
 * Chaque calque a une position, des dimensions, un ordre de superposition (z)
 * et des propriétés optionnelles (couleur, texte) basées sur son type.
 */
export interface Layer {
  /** Identifiant unique du calque. */
  id: string;
  /** Type de contenu du calque. */
  type: LayerType;
  /** Position X (gauche) relative au conteneur. */
  x: number;
  /** Position Y (haut) relative au conteneur. */
  y: number;
  /** Largeur du calque. */
  width: number;
  /** Hauteur du calque. */
  height: number;
  /** Couleur de fond (pour les calques de type 'text' ou 'image' colorée). */
  color?: string;
  /** Contenu textuel (pour les calques de type 'text'). */
  text?: string;
  /** Ordre de superposition (z-index). Plus la valeur est élevée, plus le calque est au-dessus. */
  z: number;
}
