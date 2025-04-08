import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AllBookings from "../../components/Bookings/AllBookings";

const ClientBookings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  async function getUser(userId) {
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

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("uid");
    navigate("/login");
  };

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    getUser(uid);
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
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
      <div className="flex justify-between bs-light px-4 py-2 rounded my-text-blue top-bar">
        <p>{user.name}</p>
        <p>{user.email}</p>
      </div>

      <div className="flex flex-col gap-4 mt-2 middle-content">
        <div className="w-full flex justify-center">
          <p className="my-text-orange text-lg">
            <b>My Bookings</b>
          </p>
        </div>
        <AllBookings />
      </div>
    </div>
  );
};

export default ClientBookings;
