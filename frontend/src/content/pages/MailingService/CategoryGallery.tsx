import {
  Box,
  Button,
  CircularProgress,
  Container,
  ImageList,
  ImageListItem,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_CONFIG } from "../../../api/config";

const CategoryGallery: React.FC = () => {
  const { categoryKey } = useParams<{ categoryKey: string }>();
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Utilisation de la configuration API
    const API_BASE_URL = API_CONFIG.BASE_URL;
    const fetchImages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/images/list`);
        if (response.ok) {
          const allImages: string[] = await response.json();
          // FILTRAGE : On ne garde que les images contenant la catégorie dans leur nom
          const filtered = allImages.filter((url) =>
            url.includes(categoryKey || ""),
          );
          console.log("response:", response);
          console.log("Images filtrées :", filtered);
          setImages(filtered);
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [categoryKey]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Container sx={{ py: 8 }}>
      <Button
        onClick={() => navigate("/mailing_service")}
        variant="text"
        sx={{ mb: 2 }}
      >
        ← Zurück
      </Button>

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Bildergalerie : {categoryKey?.replace(/_/g, " ")}
      </Typography>

      {images.length > 0 ? (
        <ImageList variant="masonry" cols={3} gap={16}>
          {images.map((url, index) => (
            <ImageListItem
              key={index}
              sx={{
                border: "1px solid #eee",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <img src={url} alt={`Design ${index}`} loading="lazy" />
            </ImageListItem>
          ))}
        </ImageList>
      ) : (
        <Typography sx={{ mt: 4, color: "text.secondary" }}>
          Keine Bilder für diese Kategorie gespeichert.
        </Typography>
      )}
    </Container>
  );
};

export default CategoryGallery;
