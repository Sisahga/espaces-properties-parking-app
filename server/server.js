const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// --- Middleware ---
app.use(cors());
app.use(express.json());

// === ROUTES ===

// ---< USER ROUTES >---

// -----> Register User
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
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// -----> Login User
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
    res.status(200).json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );
    if (admin.rows.length === 0) {
      return res.status(400).json("Admin not found.");
    }
    res.status(200).json(admin.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// -----> Retrieve User
app.get("/api/user/retrieve/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT * FROM users WHERE u_id = $1", [id]);
    if (user.rows.length === 0) {
      return res.status(400).json("User not found.");
    }
    res.status(200).json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// ---< End of USER ROUTES >---

// ---< SCHEDULER ROUTES >---

// -----> Create New Booking
app.post("/api/parking/booking/create", async (req, res) => {
  try {
    const {
      uid,
      subject,
      startTime,
      endTime,
      isAllDay,
      description,
      licensePlate,
      vehicleMake,
    } = req.body;
    const newBooking = await pool.query(
      "INSERT INTO bookings (u_id, subject, starttime, endtime, isallday, description, licenseplate, vehiclemake) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        uid,
        subject,
        startTime,
        endTime,
        isAllDay,
        description,
        licensePlate,
        vehicleMake,
      ]
    );
    console.log(newBooking.rows[0]);
    res.status(200).json(newBooking.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// -----> Retrieve All Bookings
app.get("/api/parking/booking/retrieve", async (req, res) => {
  try {
    const allBookings = await pool.query("SELECT * FROM bookings");
    res.status(200).json(allBookings.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// -----> Delete Booking
app.delete("/api/parking/booking/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteBooking = await pool.query(
      "DELETE FROM bookings WHERE id = $1",
      [id]
    );
    res.status(200).json("Booking deleted.");
  } catch (err) {
    console.error(err.message);
  }
});

// ---< End of SCHEDULER ROUTES >---

// ---< PAYMENT ROUTES >---

var parkingPrice = {
  name: "Daily Parking Space at Espace Properties",
  priceInCents: 2500,
};

// -----> STRIPE Payment
app.post("/api/parking/payment/create-checkout-session", async (req, res) => {
  try {
    const dayWord = req.body.quantity > 1 ? "days" : "day";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: parkingPrice.name + " * " + req.body.description,
              description:
                "Rate of $" +
                (parkingPrice.priceInCents / 100).toFixed(2) +
                " per day. " +
                req.body.quantity +
                " " +
                dayWord +
                " booked.",
            },
            unit_amount: parkingPrice.priceInCents,
          },
          quantity: req.body.quantity,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/stripe-pay-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/stripe-pay-cancel?booking_id=${req.body.bookingID}`,
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/parking/payment/retrieve-complete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const session = await stripe.checkout.sessions.retrieve(id, {
      expand: ["payment_intent.payment_method"],
    });
    const lineItems = await stripe.checkout.sessions.listLineItems(id);

    console.log("Session: ", session);
    console.log("Line Items: ", lineItems);

    const transactionDetails = {
      id: session.id,
      subtotal: session.amount_subtotal / 100,
      total: session.amount_total / 100,
      currency: session.currency,
      paymentStatus: session.payment_status,
      paymentMethod: session.payment_intent.payment_method.type,
      cardType: session.payment_intent.payment_method.card.brand,
      paymentCardEnding: session.payment_intent.payment_method.card.last4,
      quantity: lineItems.data[0].quantity,
      customerName: session.customer_details.name,
      customerEmail: session.customer_details.email,
      customerBillTo:
        session.customer_details.address.country +
        ", " +
        session.customer_details.address.postal_code,
      slotBooked: lineItems.data[0].description.split(" * ")[1],
    };
    res.status(200).json(transactionDetails);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

// ---< End of PAYMENT ROUTES >---

// === END OF ROUTES ===

// --- Listener Port ---
app.listen(8080, () => {
  console.log("Server is running on port 8080...");
});
