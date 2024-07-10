import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AppSettings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

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

  const handleAdminLogout = () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("uid");
    localStorage.removeItem("isAdmin");
    navigate("/login/admin");
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
        <p>
          <b>ADMIN</b>
        </p>
        <p>{user.email}</p>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        <div className="w-full flex justify-center">
          <p className="my-text-orange text-lg">
            <b>App Settings</b>
          </p>
        </div>
        <div className="flex flex-col mx-auto mt-4 gap-2 justify-center w-1/2 bs-light p-4 rounded">
          <p className="my-text-blue">
            <b>Daily Parking Price ($)</b>
          </p>
          <input
            id="parkingPrice"
            name="parkingPrice"
            type="text"
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></input>
        </div>
        <div className="flex mx-auto w-1/2 mt-4">
          <button
            className="buttonBig rounded"
            style={{
              backgroundColor: "var(--green) !important",
            }}
          >
            Save
          </button>
        </div>
      </div>
      <div className="flex justify-between mt-24 bs-light p-4">
        <div className="flex gap-4">
          <button
            className="clientActionTab rounded"
            onClick={() => {
              navigate("/");
            }}
          >
            Scheduler
          </button>
          <button
            onClick={() => {
              navigate("/all-bookings-admin");
            }}
            className="clientActionTab rounded"
          >
            All Bookings
          </button>
        </div>
        <div>
          <button
            onClick={handleAdminLogout}
            className="logoutBtn rounded bs-light"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppSettings;
