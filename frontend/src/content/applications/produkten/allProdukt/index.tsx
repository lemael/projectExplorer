import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import { useOutletContext } from "react-router-dom";

// On définit la structure d'un produit
interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
}

// On définit les propriétés que le composant reçoit

const AllProducts: React.FC = () => {
  // On récupère les produits synchronisés depuis le Layout
  const { products } = useOutletContext<{ products: Product[] }>();
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Liste de tous les produits
      </Typography>

      <Paper elevation={2}>
        <List>
          {products.map((produkt, index) => (
            <React.Fragment key={produkt.id}>
              <ListItem alignItems="flex-start">
                <ListItemIcon>
                  {/* Petit bonus : on affiche une miniature de l'image */}
                  <Avatar
                    variant="rounded"
                    src={produkt.image}
                    alt={produkt.name}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="primary">
                      {produkt.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {produkt.description}
                    </Typography>
                  }
                />
              </ListItem>
              {/* On ajoute une ligne de séparation sauf pour le dernier élément */}
              {index < products.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default AllProducts;
