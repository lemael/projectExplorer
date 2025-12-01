import { styled } from "@mui/material/styles";
import { ElementType, forwardRef, ReactNode } from "react";
import SimpleBar from "simplebar-react";

// IMPORTANT: Importation du CSS de SimpleBar po
// Styled Component pour SimpleBar. C'est ici que nous appliquons nos styles personnalisés
const SimpleBarWrapper = styled(SimpleBar)(({ theme }) => ({
  maxHeight: "100%",
  flexGrow: 1, // S'assure qu'il prend l'espace disponible

  // Cible la barre de défilement verticale
  "& .simplebar-scrollbar:before": {
    background:
      theme.palette.mode === "dark"
        ? theme.colors.alpha.trueWhite[50]
        : theme.colors.alpha.black[50], // Couleur du pouce de défilement
    borderRadius: "10px",
    opacity: 0.6,
    transition: "opacity 0.2s linear",
  },

  // Cible la piste (track) pour assurer un aspect propre
  "& .simplebar-track.simplebar-vertical": {
    width: 6, // Rendre la piste un peu plus mince
  },

  // Assure le défilement fluide sur les appareils tactiles
  "& .simplebar-mask": {
    WebkitOverflowScrolling: "touch",
  },

  // Cache le défilement horizontal si non nécessaire
  "& .simplebar-content-wrapper": {
    overflowX: "hidden !important",
  },
}));

interface ScrollbarProps {
  children?: ReactNode;
  className?: string;
  as?: ElementType; // Pour permettre la composition si nécessaire
}

// Utilisation de forwardRef pour transmettre la référence à SimpleBar
const Scrollbar = forwardRef<HTMLDivElement, ScrollbarProps>((props, ref) => {
  // SimpleBar nécessite une référence si le parent l'utilise
  return (
    <SimpleBarWrapper ref={ref as any} {...props}>
      {props.children}
    </SimpleBarWrapper>
  );
});

Scrollbar.displayName = "Scrollbar";

export default Scrollbar;
