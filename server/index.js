const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { connect } = require("mongoose");
require("dotenv").config();
const upload = require("express-fileupload");

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    credentials: true,
    methods: ["POST", "GET", "PATCH", "DELETE"],
    origin: "https://blog-website-frontend-theta.vercel.app",
  })
);

app.use(upload());
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Origin",
    "https://blog-website-frontend-theta.vercel.app"
  ); //client origin
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const uri = process.env.MONGO_URI;

mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("server is running on PORT " + process.env.PORT);
});
