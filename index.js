const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
// initialize app
const app = express();
const port = process.env.PORT || 5000;
const path = require("path");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
dotenv.config();

// routes
app.use("/api/v1", require("./routes/dataskore"));
app.use("/api/v1/offerzone", require("./routes/earnkaro"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.listen(port, () => {
  console.log("connected to the PORT : ", port);
});
