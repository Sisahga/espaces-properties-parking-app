import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientScheduler from "../components/Syncfusion/ClientScheduler";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const authenticated = localStorage.getItem("authenticated");
  const isAdmin = localStorage.getItem("isAdmin");
  console.log("Authenticated: ", authenticated);

  async function getUser(userId) {
    const response = await fetch(
      `http://localhost:8080/api/user/retrieve/${userId}`,
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
          <div className="flex justify-center items-center gap-2">
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
          <div className="flex gap-4 mt-4">
            <button className="clientActionTab rounded bs-light">
              My Bookings
            </button>
            <button className="clientActionTab rounded bs-light">
              Settings
            </button>
          </div>
        </div>
      ) : (
        "ADMIN VIEW."
      )}
    </div>
  );
};

export default Home;
