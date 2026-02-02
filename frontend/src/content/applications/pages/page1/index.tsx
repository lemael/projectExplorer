import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
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

  const [tempData, setTempData] = useState<{
    [key: number]: { desc: string; img: string };
  }>({});
  const [uploading, setUploading] = useState<{ [key: number]: boolean }>({});

  // État pour le message de confirmation
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (id: number, field: "desc" | "img", value: string) => {
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
      try {
        onUpdate(id, data.desc, data.img);

        // 1. On vide l'état temporaire de ce produit -> le bouton redevient gris
        const newTempData = { ...tempData };
        delete newTempData[id];
        setTempData(newTempData);

        // 2. On affiche le message de succès
        setToast({
          open: true,
          message: "Modifications enregistrées avec succès !",
          severity: "success",
        });
      } catch (error) {
        setToast({
          open: true,
          message: "Erreur lors de la sauvegarde.",
          severity: "error",
        });
      }
    }
  };

  const handleFileUpload = async (id: number, file: File) => {
    const CLOUD_NAME = "dvvgxybs5";
    const UPLOAD_PRESET = "jopkeImage";
    setUploading({ ...uploading, [id]: true });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await response.json();
      handleChange(id, "img", data.secure_url);
    } catch (error) {
      setToast({
        open: true,
        message: "Erreur lors de l'upload de l'image.",
        severity: "error",
      });
    } finally {
      setUploading({ ...uploading, [id]: false });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Configuration de la Home
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
            {/* Champ Image */}
            <TextField
              fullWidth
              label="URL de l'image"
              value={tempData[product.id]?.img ?? product.image}
              onChange={(e) => handleChange(product.id, "img", e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id={`upload-button-${product.id}`}
                        type="file"
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          handleFileUpload(product.id, e.target.files[0])
                        }
                      />
                      <label htmlFor={`upload-button-${product.id}`}>
                        <IconButton
                          color="primary"
                          component="span"
                          disabled={uploading[product.id]}
                        >
                          {uploading[product.id] ? (
                            <CircularProgress size={24} />
                          ) : (
                            <CloudUploadIcon />
                          )}
                        </IconButton>
                      </label>
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* Champ Description */}
            <TextField
              fullWidth
              label="Description courte"
              multiline
              rows={3}
              value={tempData[product.id]?.desc ?? product.description}
              onChange={(e) => handleChange(product.id, "desc", e.target.value)}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={() => handleSave(product.id)}
                disabled={!tempData[product.id]} // Gris si pas de modif
              >
                Sauvegarder
              </Button>
            </Box>
          </Stack>
        </Paper>
      ))}

      {/* Snackbar pour les messages */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Page1;
