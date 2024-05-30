const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Listener Port ---
app.listen(5002, () => {
  console.log("Server is running on port 5002...");
});
