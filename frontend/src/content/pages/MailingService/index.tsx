import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Typography,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../../contexts/ProductContext";

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
}

const MailingServices: React.FC = () => {
  // On récupère les produits synchronisés
  const { products } = useProducts();
  return (
    <Box>
      <Container maxWidth="md" sx={{ mt: 6, mb: 4 }}>
        {/* Un vrai titre stylisé */}
        <Typography
          variant="h2"
          component="h1"
          align="center"
          color="textPrimary"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 4 }}
        >
          Unsere Mailing-Lösungen
        </Typography>

        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Ihr Partner für professionelle Kundenkommunikation und messbare
          Erfolge.
        </Typography>
      </Container>
      <Container sx={{ py: 8 }} maxWidth="md">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 4,
          }}
        >
          {products.map((product: Product) => (
            <Card
              key={product.id}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <CardActionArea
                component={Link}
                to={`eigenschaft/${product.id}`} // Utilisation de l'ID ou d'une clé unique
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <CardMedia
                  component="img"
                  image={product.image}
                  alt={product.name}
                  sx={{ height: 260 }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {product.name}
                  </Typography>
                  <Typography>{product.description}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default MailingServices;
