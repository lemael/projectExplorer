import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CardActionArea,
  Box,
} from "@mui/material";

interface ServiceCardProps {
  title: string;
  image: string;
  features: string[];
  onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  image,
  features,
  onClick,
}) => {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "0.3s",
        "&:hover": {
          boxShadow: 10, // Effet d'ombre MUI au survol
        },
      }}
    >
      {/* Zone cliquable (Image + Titre) */}
      <CardActionArea onClick={onClick}>
        <CardMedia
          component="img"
          height="250" // Équivalent à h-64
          image={image}
          alt={title}
          sx={{
            objectFit: "contain",
            padding: 2,
            backgroundColor: "#f9f9f9",
          }}
        />
      </CardActionArea>

      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        {/* Titre avec hauteur minimale pour l'alignement */}
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            fontWeight: "bold",
            minHeight: "64px", // Aligne le début des listes
            display: "flex",
            alignItems: "center",
          }}
        >
          {title}
        </Typography>

        {/* Liste des caractéristiques */}
        <Box
          component="ul"
          sx={{
            pl: 2,
            mb: 2,
            flexGrow: 1,
            color: "text.secondary",
            fontSize: "0.875rem",
          }}
        >
          {features.map((feature, index) => (
            <li key={index} style={{ marginBottom: "8px" }}>
              {feature}
            </li>
          ))}
        </Box>

        {/* Bouton d'action */}
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          onClick={onClick}
          sx={{ mt: "auto", textTransform: "none", fontWeight: "bold" }}
        >
          Details ansehen
        </Button>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
