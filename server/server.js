const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "build")));

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
      "SELECT u_id, name, email, phone FROM users WHERE email = $1 and email != $2",
      [email, "admin@test.com"]
    );
    if (user.rows.length === 0) {
      return res.status(400).json("User not found or doesn't exist.");
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
    console.log("ID: ", id);
    const user = await pool.query("SELECT * FROM users WHERE u_id = $1", [id]);
    if (user.rows.length === 0) {
      return res.status(400).json("User not found.");
    }
    res.status(200).json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// -----> Update User Email and Phone
app.put("/api/user/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email, phone } = req.body;
    await pool.query(
      "UPDATE users SET email = $1, phone = $2 WHERE u_id = $3",
      [email, phone, id]
    );
    res.status(200).json("User updated.");
  } catch (err) {
    console.error(err.message);
  }
});

// ---< End of USER ROUTES >---

// ---< SCHEDULER ROUTES >---

// -----> Pending Booking Creation Object
var bookingObject = {
  uid: null,
  subject: null,
  startTime: null,
  endTime: null,
  isAllDay: true,
  description: null,
  licensePlate: null,
  vehicleMake: null,
  paymentStatus: null,
};

// -----> Store temporary booking in BookingObject
app.post("/api/parking/booking/temp", async (req, res) => {
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
      paymentStatus,
    } = req.body;
    bookingObject.uid = uid;
    bookingObject.subject = subject;
    bookingObject.startTime = startTime;
    bookingObject.endTime = endTime;
    bookingObject.isAllDay = isAllDay;
    bookingObject.description = description;
    bookingObject.licensePlate = licensePlate;
    bookingObject.vehicleMake = vehicleMake;
    bookingObject.paymentStatus = paymentStatus;
    res.status(200).json(bookingObject);
  } catch (err) {
    console.error(err.message);
  }
});

// Create booking for CLIENT only when receiving successful payment confirmation
async function createBooking(
  uid,
  subject,
  startTime,
  endTime,
  isAllDay,
  description,
  licensePlate,
  vehicleMake,
  paymentStatus,
  transactionID
) {
  try {
    const newBooking = await pool.query(
      "INSERT INTO bookings (u_id, subject, starttime, endtime, isallday, description, licenseplate, vehiclemake, paymentstatus, transactionId) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      [
        uid,
        subject,
        startTime,
        endTime,
        isAllDay,
        description,
        licensePlate,
        vehicleMake,
        paymentStatus,
        transactionID,
      ]
    );
    console.log(newBooking.rows[0]);
    return newBooking.rows[0];
  } catch (err) {
    console.error(err.message);
  }
}

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
      roomNumber,
      paymentStatus,
    } = req.body;
    const newBooking = await pool.query(
      "INSERT INTO bookings (u_id, subject, starttime, endtime, isallday, description, licenseplate, vehiclemake, roomnumber, paymentstatus) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      [
        uid,
        subject,
        startTime,
        endTime,
        isAllDay,
        description,
        licensePlate,
        vehicleMake,
        roomNumber,
        paymentStatus,
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

// -----> Retrieve All Bookings for Admin View
app.get("/api/parking/booking/retrieve/admin", async (req, res) => {
  try {
    const allBookings = await pool.query(
      "SELECT b.id, b.u_id, b.subject, b.starttime, b.endtime, b.isallday, b.description, b.licenseplate, b.vehiclemake, b.roomnumber, u.name, u.email, u.phone FROM bookings b INNER JOIN users u ON b.u_id = u.u_id ORDER BY b.starttime"
    );
    res.status(200).json(allBookings.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// -----> Retrieve Booking by User ID
app.get("/api/parking/booking/retrieve/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userBookings = await pool.query(
      "SELECT * FROM bookings WHERE u_id = $1 ORDER BY starttime",
      [id]
    );
    res.status(200).json(userBookings.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// -----> Update Booking
app.put("/api/parking/booking/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      startTime,
      endTime,
      licensePlate,
      vehicleMake,
      description,
      roomNumber,
      subject,
    } = req.body;
    await pool.query(
      "UPDATE bookings SET starttime = $1, endtime = $2, licenseplate = $3, vehiclemake = $4, description = $5, roomNumber = $6, subject = $8 WHERE id = $7",
      [
        startTime,
        endTime,
        licensePlate,
        vehicleMake,
        description,
        roomNumber,
        id,
        subject,
      ]
    );
    res.status(200).json("Booking updated.");
  } catch (err) {
    console.error(err.message);
  }
});

// -----> Update Booking Payment Status
app.put("/api/parking/booking/update-payment-status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const paymentStatus = req.body.paymentStatus;
    await pool.query("UPDATE bookings SET paymentstatus = $1 WHERE id = $2", [
      paymentStatus,
      id,
    ]);
    res.status(200).json("Payment status updated.");
    console.log("Payment status updated.");
  } catch (err) {
    console.error(err.message);
  }
});

// -----> Get Booking Status
app.get("/api/parking/booking/status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await pool.query(
      "SELECT paymentstatus FROM bookings WHERE id = $1",
      [id]
    );
    res.status(200).json(booking.rows[0]);
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
  priceInCents: null,
};

// -----> STRIPE Payment
app.post("/api/parking/payment/create-checkout-session", async (req, res) => {
  try {
    await getParkingPrice();
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
            unit_amount: Math.trunc(parkingPrice.priceInCents),
          },
          quantity: req.body.quantity,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/stripe-pay-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/stripe-pay-cancel`,
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

    bookingObject.paymentStatus = "PAID";
    // Create booking after payment successful
    await createBooking(
      bookingObject.uid,
      bookingObject.subject,
      bookingObject.startTime,
      bookingObject.endTime,
      bookingObject.isAllDay,
      bookingObject.description,
      bookingObject.licensePlate,
      bookingObject.vehicleMake,
      bookingObject.paymentStatus,
      transactionDetails.id
    );

    res.status(200).json(transactionDetails);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/parking/payment/standard-price", async (req, res) => {
  const price = await getParkingPrice();
  res.status(200).json(price);
});

app.put("/api/parking/payment/update-standard-price", async (req, res) => {
  try {
    const { newPrice } = req.body;
    await pool.query("UPDATE parkingsettings SET price = $1 WHERE id = 1", [
      newPrice,
    ]);
    res.status(200).json("Price updated.");
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

async function getParkingPrice() {
  const price = await pool.query("SELECT * FROM parkingsettings where id = 1");
  parkingPrice.priceInCents = price.rows[0].price;
  return parkingPrice;
}

// ---< End of PAYMENT ROUTES >---

// === END OF ROUTES ===

//Put this after all middleware. Otherwise, Heroku will give you 304 page
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 8080;
// --- Listener Port ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
