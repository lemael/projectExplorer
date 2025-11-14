const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/festliche-kleider", async (req, res) => {
  try {
    const url = "https://zalando.p.rapidapi.com/festliche-kleider";
    const options = {
      method: "GET",
      url,
      headers: {
        "X-RapidAPI-Key": "5266038b2msh34749a74fbae013p106415jsne95ea7b54933",
        "X-RapidAPI-Host": "zalando4.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    const products = response.data;

    res.json(products);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des produits" });
  }
});
const fs = require("fs");
const filePath = "listImages.json";
app.post("/images", (req, res) => {
  const images = req.body.images;
  // Traitez les URLs des images ici
  fs.writeFile(filePath, JSON.stringify(images), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Erreur lors de l'écriture du fichier");
    } else {
      res.send("Images reçues avec succès !");
    }
  });
  console.log(images);
  res.send("Images reçues avec succès !");
});

app.get("/get-images", (req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        res.json([]); // retourne un tableau vide si le fichier n'existe pas
      } else {
        console.error(err);
        res.status(500).send("Erreur lors de la lecture du fichier");
      }
    } else {
      if (data.length > 0) {
        res.json(JSON.parse(data));
      } else {
        res.json([]); // retourne un tableau vide si le fichier est vide
      }
    }
  });
});

app.listen(3001, () => {
  console.log("Serveur démarré sur le port 3001");
});
