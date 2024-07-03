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

    const checkResponse = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (checkResponse.rows.length > 0) {
      return res.status(400).json("User already exists.");
    }

    const newUser = await pool.query(
      "INSERT INTO users (name, email, phone) VALUES($1, $2, $3) RETURNING *",
      [name, email, phone]
    );
    console.log(newUser.rows[0]);
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/api/user/login", async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const user = await pool.query(
      "SELECT u_id, name, email, phone FROM users WHERE email = $1",
      [email]
    );
    if (user.rows.length === 0) {
      return res.status(400).json("User not found.");
    }
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/api/user/retrieve/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT * FROM users WHERE u_id = $1", [id]);
    if (user.rows.length === 0) {
      return res.status(400).json("User not found.");
    }
    res.json(user.rows[0]);
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
