import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useProducts } from "../../../../contexts/ProductContext";

const AddProduct = () => {
  const { addProduct } = useProducts();
  const [form, setForm] = useState({ name: "", desc: "", img: "" });

  const handleSubmit = async () => {
    await addProduct({
      name: form.name,
      description: form.desc,
      image: form.img,
    });
    alert("Produit ajouté avec succès !");
    setForm({ name: "", desc: "", img: "" }); // Reset le formulaire
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        Ajouter un nouveau produit
      </Typography>
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <TextField
          fullWidth
          label="Nom"
          sx={{ mb: 2 }}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <TextField
          fullWidth
          label="URL Image"
          sx={{ mb: 2 }}
          value={form.img}
          onChange={(e) => setForm({ ...form, img: e.target.value })}
        />
        <TextField
          fullWidth
          label="Description"
          multiline
          rows={4}
          sx={{ mb: 2 }}
          value={form.desc}
          onChange={(e) => setForm({ ...form, desc: e.target.value })}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Créer le produit
        </Button>
      </Paper>
    </Box>
  );
};

export default AddProduct;
