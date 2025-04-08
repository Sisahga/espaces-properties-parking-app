import {
  BookIcon,
  HomeIcon,
  LogOutIcon,
  SettingsIcon,
  UsersRoundIcon,
} from "lucide-react";
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
      className="flex justify-center mt-4 bs-light p-2 fixed bottom-0 w-full lg:w-2/3 
                  lg:left-1/2 lg:-translate-x-1/2 gap-8 bg-[var(--white)]"
    >
      {isAdmin ? (
        <>
          <div className="flex gap-8">
            <button
              onClick={() => {
                navigate("/");
              }}
              className="text-sm flex flex-col items-center p-3 rounded-lg gap-1 hover:opacity-50"
            >
              <HomeIcon className="h-4 w-4" />
              <p>Home</p>
            </button>
            <button
              onClick={() => {
                navigate("/all-bookings-admin");
              }}
              className="text-sm flex flex-col items-center p-3 rounded-lg gap-1 hover:opacity-50"
            >
              <BookIcon className="h-4 w-4" />
              <p>All Bookings</p>
            </button>
            <button
              onClick={() => {
                navigate("/app-settings");
              }}
              className="text-sm flex flex-col items-center p-3 rounded-lg gap-1 hover:opacity-50"
            >
              <SettingsIcon className="h-4 w-4" />
              <p>App Settings</p>
            </button>
            <button
              onClick={() => {
                navigate("/customers");
              }}
              className="text-sm flex flex-col items-center p-3 rounded-lg gap-1 hover:opacity-50"
            >
              <UsersRoundIcon className="h-4 w-4" />
              <p>Customers</p>
            </button>
          </div>
          <div>
            <button
              onClick={handleAdminLogout}
              className="text-sm flex flex-col items-center p-3 rounded-lg gap-1 hover:opacity-50"
            >
              <LogOutIcon className="h-4 w-4" />
              <p>Logout</p>
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
              className="text-sm flex flex-col"
            >
              Home
            </button>
            <button
              onClick={() => {
                navigate("/my-bookings");
              }}
              className="text-sm flex flex-col"
            >
              My Bookings
            </button>
            <button
              onClick={() => {
                navigate("/profile-settings");
              }}
              className="text-sm flex flex-col"
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
