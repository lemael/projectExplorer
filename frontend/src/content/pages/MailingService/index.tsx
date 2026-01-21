import { Box, Container, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import ServiceCard from "./ServiceCard";

const MailingServices: React.FC = () => {
  const navigate = useNavigate();
  const services = [
    {
      title: "Kuvertierte Mailings",
      categoryKey: "Kuvertierte_Mailings",
      image:
        "https://www.onlineprinters.de//$WS/diedruckerei/shopdata/web/images/landingpages/content/mailingservice/Mailings_kuvertiert_600x600.png",
      features: [
        "die Klassiker unter den Werbebriefen",
        "im individuell bedruckten oder unbedruckten Briefkuvert",
        "mit optionalen Beilegern wie Visitenkarten, Flyern oder Falzflyern",
      ],
    },
    {
      title: "Selfmailer mit Verschlussklappe",
      categoryKey: "Selfmailer_mit_Verschlussklappe",
      image:
        "https://www.onlineprinters.de//$WS/diedruckerei/shopdata/web/images/landingpages/content/mailingservice/mit-verschlussklappe_600x600.png",
      features: [
        "kommen ganz ohne Briefumschlag aus",
        "dank wiederablösbarem Leim lässt sich die Verschlussklappe leicht öffnen",
        "Ihre Botschaft auf 4, 6 oder 8 Seiten",
      ],
    },
    {
      title: "Selfmailer ohne Verschlussklappe",
      categoryKey: "Selfmailer_ohne_Verschlussklappe",
      image:
        "https://www.onlineprinters.de//$WS/diedruckerei/shopdata/web/images/landingpages/content/mailingservice/ohnet-verschlussklappe_600x600.png",
      features: [
        "moderner Look ganz ohne Umschlag",
        "mit zwei transparenten, vorperforierten Klebeetiketten verschlossen",
        "werben Sie auf 4, 6 oder 8 Seiten",
      ],
    },
  ];

  const handleImageClick = (categoryKey: string) => {
    // Redirige vers /gallery/nom_de_la_categorie
    navigate(`/gallery/${categoryKey}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography
        variant="h4"
        align="center"
        fontWeight="bold"
        gutterBottom
        sx={{ mb: 6 }}
      >
        Unsere Mailing-Lösungen
      </Typography>

      {/* Flex-Container als Ersatz für Grid */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap", // Erlaubt Zeilenumbruch auf kleinen Bildschirmen
          gap: 4, // Abstand zwischen den Karten
          justifyContent: "center",
          alignItems: "stretch", // WICHTIG: Macht alle Karten gleich hoch
        }}
      >
        {services.map((service, index) => (
          <Box
            key={index}
            sx={{
              // Basis-Breite: 100% (mobil), ca. 30% (Desktop für 3 Spalten)
              flex: {
                xs: "1 1 100%",
                sm: "1 1 calc(50% - 32px)", // 2 Spalten
                md: "1 1 calc(33.333% - 32px)", // 3 Spalten
              },
              display: "flex", // Damit die ServiceCard die volle Höhe der Box nutzt
            }}
          >
            <ServiceCard
              title={service.title}
              image={service.image}
              features={service.features}
              onClick={() => handleImageClick(service.categoryKey)}
            />
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default MailingServices;
