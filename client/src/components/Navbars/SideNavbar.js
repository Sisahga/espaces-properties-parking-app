import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SideNavbar = () => {
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
    const menuIconBtn = document.getElementById("menu-icon-btn");
    menuIconBtn.classList.toggle("open");
    document.getElementById("sideNavbar").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    navigate("/login/admin");
  };

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("uid");
    const menuIconBtn = document.getElementById("menu-icon-btn");
    menuIconBtn.classList.toggle("open");
    document.getElementById("sideNavbar").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    navigate("/login");
  };

  return (
    <div id="sideNavbar" className="flex">
      <div className="flex flex-col w-full mt-16 gap-4">
        {isAdmin ? (
          <>
            <div
              onClick={() => {
                const menuIconBtn = document.getElementById("menu-icon-btn");
                menuIconBtn.classList.toggle("open");
                document.getElementById("sideNavbar").style.display = "none";
                document.getElementById("overlay").style.display = "none";
                navigate("/");
              }}
              className="sidebar-tab rounded bs-light"
            >
              Home
            </div>
            <div
              onClick={() => {
                const menuIconBtn = document.getElementById("menu-icon-btn");
                menuIconBtn.classList.toggle("open");
                document.getElementById("sideNavbar").style.display = "none";
                document.getElementById("overlay").style.display = "none";
                navigate("/all-bookings-admin");
              }}
              className="sidebar-tab rounded bs-light"
            >
              All Bookings
            </div>
            <div
              onClick={() => {
                const menuIconBtn = document.getElementById("menu-icon-btn");
                menuIconBtn.classList.toggle("open");
                document.getElementById("sideNavbar").style.display = "none";
                document.getElementById("overlay").style.display = "none";
                navigate("/app-settings");
              }}
              className="sidebar-tab rounded bs-light"
            >
              App Settings
            </div>
            <div
              onClick={handleAdminLogout}
              className="sidebar-tab rounded bs-light"
            >
              Logout
            </div>
          </>
        ) : (
          <>
            <div
              onClick={() => {
                const menuIconBtn = document.getElementById("menu-icon-btn");
                menuIconBtn.classList.toggle("open");
                document.getElementById("sideNavbar").style.display = "none";
                document.getElementById("overlay").style.display = "none";
                navigate("/");
              }}
              className="sidebar-tab rounded bs-light"
            >
              Home
            </div>
            <div
              onClick={() => {
                const menuIconBtn = document.getElementById("menu-icon-btn");
                menuIconBtn.classList.toggle("open");
                document.getElementById("sideNavbar").style.display = "none";
                document.getElementById("overlay").style.display = "none";
                navigate("/my-bookings");
              }}
              className="sidebar-tab rounded bs-light"
            >
              My Bookings
            </div>
            <div
              onClick={() => {
                const menuIconBtn = document.getElementById("menu-icon-btn");
                menuIconBtn.classList.toggle("open");
                document.getElementById("sideNavbar").style.display = "none";
                document.getElementById("overlay").style.display = "none";
                navigate("/profile-settings");
              }}
              className="sidebar-tab rounded bs-light"
            >
              Profile Settings
            </div>
            <div
              onClick={handleLogout}
              className="sidebar-tab rounded bs-light"
            >
              Logout
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SideNavbar;
