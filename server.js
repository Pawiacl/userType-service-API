const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./Config/db");
const userTypeRoutes = require("./Routes/userTypeRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/userTypes", userTypeRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "User Type Service is running",
  });
});

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
  console.log(`User Type Service running on port 🚩 ${PORT}`);
});