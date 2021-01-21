const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
// initialize app
const app = express();
const PORT = 5000 || process.env.PORT;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
dotenv.config()

app.use("/api/v1", require("./routes/dataskore"))

app.listen(PORT, () => {
  console.log("connected to the PORT : ", PORT);
});
