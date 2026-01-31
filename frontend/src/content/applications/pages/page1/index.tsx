import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
}

const Page1: React.FC = () => {
  const { products, onUpdate } = useOutletContext<{
    products: Product[];
    onUpdate: (id: number, d: string, i: string) => void;
  }>();
  // État local pour stocker les modifications temporaires avant sauvegarde
  const [tempData, setTempData] = useState<{
    [key: number]: { desc: string; img: string };
  }>({});

  const handleChange = (id: number, field: "desc" | "img", value: string) => {
    // On récupère les valeurs actuelles du produit ou celles déjà modifiées
    const currentProduct = products.find((p) => p.id === id);
    const existingTemp = tempData[id] || {
      desc: currentProduct?.description || "",
      img: currentProduct?.image || "",
    };

    setTempData({
      ...tempData,
      [id]: { ...existingTemp, [field]: value },
    });
  };

  const handleSave = (id: number) => {
    const data = tempData[id];
    if (data) {
      onUpdate(id, data.desc, data.img); // Met à jour le state parent
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Configuration de la Home (Client View)
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Modifiez les champs ci-dessous et cliquez sur "Sauvegarder" pour mettre
        à jour la page client.
      </Typography>

      {products.map((product) => (
        <Paper
          key={product.id}
          elevation={3}
          sx={{ p: 3, mb: 3, borderLeft: "5px solid #1976d2" }}
        >
          <Typography variant="h6" color="primary">
            {product.name}
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Stack spacing={3}>
            <TextField
              fullWidth
              label="URL de l'image"
              variant="outlined"
              defaultValue={product.image}
              onChange={(e) => handleChange(product.id, "img", e.target.value)}
            />

            <TextField
              fullWidth
              label="Description courte (Kurzbeschreibung)"
              variant="outlined"
              multiline
              rows={3}
              defaultValue={product.description}
              onChange={(e) => handleChange(product.id, "desc", e.target.value)}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={() => handleSave(product.id)}
                disabled={!tempData[product.id]} // Désactivé si aucune modif
              >
                Sauvegarder
              </Button>
            </Box>
          </Stack>
        </Paper>
      ))}
    </Box>
  );
};

export default Page1;
