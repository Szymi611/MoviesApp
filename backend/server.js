require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

const DB_PASSWORD = process.env.DB_PASSWORD

const moviesRoutes = require("./routes/movies");

app.use(cors())
app.use(express.json())

mongoose
  .connect(`mongodb+srv://Szymi611:${DB_PASSWORD}@cluster0.beulit4.mongodb.net/`)
  .then((result) => {
    console.log("Successfully connected!");
  })
  .catch((err) => {
    console.error("Connection error", err);
  });

app.use(moviesRoutes)

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`)
})