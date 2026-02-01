import CheckIcon from "@mui/icons-material/Check";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";

const ZahlungFormular = () => {
  const [tabValue, setTabValue] = useState(0);

  // Ces valeurs seront liées à ton Context plus tard
  const prices = {
    standard: "58,91 €",
    express: "67,30 €",
    unit1: "55,91 €",
    unit3: "31,25 €",
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center", // Centrage horizontal
        alignItems: "center", // Centrage vertical
        minHeight: "100vh", // Optionnel : occupe toute la hauteur de l'écran
        p: 2, // Espacement pour éviter qu'il ne touche les bords sur mobile
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 600,
          width: "100%",
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid #e0e0e0",
        }}
      >
        {/* Onglets Versand / Abholung 
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab
            icon={<LocalShippingIcon />}
            label="Versand"
            sx={{ textTransform: "none", fontWeight: "bold" }}
          />
          <Tab
            icon={<StorefrontIcon />}
            label="Abholung"
            sx={{ textTransform: "none", fontWeight: "bold" }}
          />
        </Tabs>
*/}
        <Box sx={{ p: 2 }}>
          {/* Prix Standard */}
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
          >
            <Typography variant="body1" fontWeight="500">
              Standard-Preis
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {prices.standard}
            </Typography>
          </Box>
          <Typography
            variant="caption"
            color="textSecondary"
            display="block"
            sx={{ mb: 2 }}
          >
            Versand-Start: vorauss. 04.02.*
          </Typography>

          {/* Business Preis */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="body1">Best-Business-Preis</Typography>
            <Typography
              variant="body1"
              color="primary"
              sx={{ cursor: "pointer" }}
            >
              Login
            </Typography>
          </Box>

          {/* Prix Express */}
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
          >
            <Typography variant="body1" fontWeight="500">
              Express-Preis
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {prices.express}
            </Typography>
          </Box>
          <Typography
            variant="caption"
            color="success.main"
            fontWeight="500"
            display="block"
            sx={{ mb: 2 }}
          >
            Versand-Start: sicher 02.02.*
          </Typography>

          {/* Liste des avantages */}
          <List dense sx={{ p: 0, mb: 2 }}>
            <ListItem disableGutters sx={{ py: 0 }}>
              <ListItemIcon sx={{ minWidth: 25 }}>
                <CheckIcon color="success" sx={{ fontSize: 16 }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2">inkl. Versand & MwSt.</Typography>
                }
              />
            </ListItem>
            <ListItem disableGutters sx={{ py: 0 }}>
              <ListItemIcon sx={{ minWidth: 25 }}>
                <CheckIcon color="success" sx={{ fontSize: 16 }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2">
                    inkl. kurzer Datensichtung
                  </Typography>
                }
              />
            </ListItem>
          </List>

          <Typography
            variant="caption"
            color="textSecondary"
            display="block"
            sx={{ mb: 2 }}
          >
            *Bei Datenübergabe vor 11 Uhr
          </Typography>

          {/* Bouton Action */}
          <Button
            variant="contained"
            fullWidth
            size="large"
            sx={{
              bgcolor: "#00a1e0",
              "&:hover": { bgcolor: "#0081b3" },
              borderRadius: 10,
              py: 1.5,
              fontWeight: "bold",
              textTransform: "uppercase",
              mb: 3,
            }}
          >
            Upload & Warenkorb
          </Button>

          {/* Exemplarpreise */}
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            Exemplarpreise
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">1 Stück</Typography>
            <Typography variant="body2">{prices.unit1}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">3 Stück</Typography>
            <Typography variant="body2">{prices.unit3}</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ZahlungFormular;
