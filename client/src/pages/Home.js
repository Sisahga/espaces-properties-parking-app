import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import ClientScheduler from "../components/Syncfusion/ClientScheduler";
import AdminScheduler from "../components/Syncfusion/AdminScheduler";
import BottomNavbar from "../components/BottomNavbar";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const authenticated = localStorage.getItem("authenticated");
  const isAdmin = localStorage.getItem("isAdmin");
  console.log("Authenticated: ", authenticated);

  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isStripePayCancel = location.pathname.includes("stripe-pay-cancel");
  const bookingId = searchParams.get("booking_id");

  async function deleteBooking(bookingId) {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/parking/booking/delete/${bookingId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      console.log("Booking deleted.");
      navigate("/");
    } else {
      console.error("Failed to delete booking.");
    }
  }

  async function getUser(userId) {
    console.log("Getting user " + userId);
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}api/user/retrieve/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const user = await response.json();
      console.log("User: ", user);
      setUser(user);
      setLoading(false);
    } else {
      console.error("Failed to get user.");
    }
  }

  useEffect(() => {
    if (isStripePayCancel) {
      deleteBooking(bookingId);
    }
  }, [isStripePayCancel, bookingId]);

  useEffect(() => {
    if (authenticated !== "Y") {
      navigate("/signup");
    } else {
      const uid = localStorage.getItem("uid");
      getUser(uid);
    }
  }, [authenticated, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="" style={{ maxHeight: "100vh" }}>
      {isAdmin === "N" ? (
        <div className="flex flex-col gap-4 px-8 py-12">
          <div
            className="flex justify-center items-center gap-2"
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/");
            }}
          >
            <b>
              <p>Espaces Properties</p>
            </b>
            <b>-</b>
            <b>
              <p className="my-text-orange">Parking</p>
            </b>
          </div>
          <div className="flex justify-between bs-light px-4 py-2 rounded my-text-blue">
            <p>{user.name}</p>
            <p>{user.email}</p>
          </div>
          <ClientScheduler />
          <BottomNavbar />
        </div>
      ) : (
        <div className="flex flex-col gap-4 px-8 py-12">
          <div
            className="flex justify-center items-center gap-2"
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/");
            }}
          >
            <b>
              <p>Espaces Properties</p>
            </b>
            <b>-</b>
            <b>
              <p className="my-text-orange">Parking</p>
            </b>
          </div>
          <div className="flex justify-between bs-light px-4 py-2 rounded my-text-blue">
            <p>
              <b>ADMIN</b>
            </p>
            <p>{user.email}</p>
          </div>
          <AdminScheduler />
          <BottomNavbar />
        </div>
      )}
    </div>
  );
};

export default Home;
