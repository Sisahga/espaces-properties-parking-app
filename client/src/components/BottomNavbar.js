import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BottomNavbar = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin === "N") {
      setIsAdmin(false);
    } else {
      setIsAdmin(true);
    }
  }, []);

  const handleAdminLogout = () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("uid");
    localStorage.removeItem("isAdmin");
    navigate("/login/admin");
  };

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("uid");
    navigate("/login");
  };

  return (
    <div
      id="bottomNavbar"
      className="flex justify-between mt-4 bs-light p-4 bottom-bar"
    >
      {isAdmin ? (
        <>
          <div className="flex gap-4">
            <button
              onClick={() => {
                navigate("/");
              }}
              className="clientActionTab rounded bs-light"
            >
              Home
            </button>
            <button
              onClick={() => {
                navigate("/all-bookings-admin");
              }}
              className="clientActionTab rounded bs-light"
            >
              All Bookings
            </button>
            <button
              onClick={() => {
                navigate("/app-settings");
              }}
              className="clientActionTab rounded bs-light"
            >
              App Settings
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
        </>
      ) : (
        <>
          <div className="flex gap-4">
            <button
              onClick={() => {
                navigate("/");
              }}
              className="clientActionTab rounded bs-light"
            >
              Home
            </button>
            <button
              onClick={() => {
                navigate("/my-bookings");
              }}
              className="clientActionTab rounded bs-light"
            >
              My Bookings
            </button>
            <button
              onClick={() => {
                navigate("/profile-settings");
              }}
              className="clientActionTab rounded bs-light"
            >
              Profile Settings
            </button>
          </div>
          <div>
            <button
              onClick={handleLogout}
              className="logoutBtn rounded bs-light"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BottomNavbar;
