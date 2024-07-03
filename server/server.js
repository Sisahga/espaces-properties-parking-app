const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// === ROUTES ===

// --- USER Routes ---

app.post("/api/user/register", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const newUser = await pool.query(
      "INSERT INTO users (name, email, phone) VALUES($1, $2, $3) RETURNING *",
      [name, email, phone]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// --- End of USER Routes ---

// === END OF ROUTES ===

// --- Listener Port ---
app.listen(8080, () => {
  console.log("Server is running on port 8080...");
});
