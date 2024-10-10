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
  var isAdmin = localStorage.getItem("isAdmin");
  console.log("Authenticated: ", authenticated);

  const location = useLocation();

  const isStripePayCancel = location.pathname.includes("stripe-pay-cancel");

  async function getUser(userId) {
    console.log("Getting user " + userId);
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/user/retrieve/${userId}`,
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
      console.log("Stripe payment cancelled by user.");
    }
  }, [isStripePayCancel]);

  useEffect(() => {
    // if (authenticated !== "Y") {
    //   navigate("/signup");
    // } else {
    //   const uid = localStorage.getItem("uid");
    //   getUser(uid);
    // }
    if (
      authenticated === null ||
      authenticated === undefined ||
      authenticated !== "Y"
    ) {
      localStorage.setItem("isAdmin", "N");
      setLoading(false);
    } else {
      const uid = localStorage.getItem("uid");
      getUser(uid);
    }
  }, [authenticated, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="flex justify-center"
      style={{ maxHeight: "100vh", width: "100vw" }}
    >
      {isAdmin === "N" ? (
        <div className="flex flex-col gap-4 px-8 py-12 main-content">
          <div
            className="flex justify-center items-center gap-2"
            style={{
              cursor: "pointer",
              marginBottom: "1rem",
              fontSize: "0.9rem",
            }}
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
          {authenticated !== null && authenticated && (
            <div className="flex justify-between bs-light px-4 py-2 rounded my-text-blue">
              <p>{user.name}</p>
              <p>{user.email}</p>
            </div>
          )}
          <ClientScheduler />
          <BottomNavbar />
        </div>
      ) : (
        <div className="flex flex-col gap-4 px-8 py-12 main-content">
          <div
            className="flex justify-center items-center gap-2"
            style={{
              cursor: "pointer",
              marginBottom: "1rem",
              fontSize: "0.9rem",
            }}
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
