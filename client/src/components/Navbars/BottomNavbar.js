import {
  BookCheck,
  BookIcon,
  Cog,
  HomeIcon,
  LogOutIcon,
  SettingsIcon,
  UserCog,
  UserIcon,
  UsersRoundIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BottomNavbar = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [show, setShow] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const authenticated = localStorage.getItem("authenticated");
    if (authenticated === "Y") {
      setShow(true);
      setIsAuthenticated(true);
    }
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin === "N") {
      setIsAdmin(false);
    } else {
      setIsAdmin(true);
    }
  }, [isAuthenticated, show]);

  const handleAdminLogout = () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("uid");
    localStorage.removeItem("isAdmin");
    setShow(false);
    navigate("/login/admin");
  };

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("uid");
    setShow(false);
    navigate("/login");
  };

  return (
    <div
      id="bottomNavbar"
      className={`flex justify-center mt-4 bs-light p-2 fixed bottom-0 w-full lg:w-fit 
                  lg:left-1/2 lg:-translate-x-1/2 gap-2 sm:gap-8 bg-[var(--white)] ${isAuthenticated && show ? "" : "hidden"}`}
    >
      {isAdmin ? (
        <>
          <div className="grid grid-cols-5 gap-12 sm:gap-8">
            <button
              onClick={() => {
                navigate("/");
              }}
              className="text-xs text-nowrap sm:text-sm flex flex-col items-center py-3 sm:p-3 rounded-lg gap-1 hover:opacity-50"
            >
              <HomeIcon className="sm:h-4 sm:w-4 h-6 w-6" />
              <p className="hidden sm:block">Home</p>
            </button>
            <button
              onClick={() => {
                navigate("/all-bookings-admin");
              }}
              className="text-xs text-nowrap sm:text-sm flex flex-col items-center py-3 sm:p-3 rounded-lg gap-1 hover:opacity-50"
            >
              <BookCheck className="sm:h-4 sm:w-4 h-6 w-6" />
              <p className="hidden sm:block">All Bookings</p>
            </button>
            <button
              onClick={() => {
                navigate("/app-settings");
              }}
              className="text-xs text-nowrap sm:text-sm flex flex-col items-center py-3 sm:p-3 rounded-lg gap-1 hover:opacity-50"
            >
              <Cog className="sm:h-4 sm:w-4 h-6 w-6" />
              <p className="hidden sm:block">App Settings</p>
            </button>
            <button
              onClick={() => {
                navigate("/customers");
              }}
              className="text-xs text-nowrap sm:text-sm flex flex-col items-center py-3 sm:p-3 rounded-lg gap-1 hover:opacity-50"
            >
              <UsersRoundIcon className="sm:h-4 sm:w-4 h-6 w-6" />
              <p className="hidden sm:block">Customers</p>
            </button>
            <button
              onClick={handleAdminLogout}
              className="text-xs text-nowrap sm:text-sm flex flex-col items-center py-3 sm:p-3 rounded-lg gap-1 hover:opacity-50"
            >
              <LogOutIcon className="sm:h-4 sm:w-4 h-6 w-6" />
              <p className="hidden sm:block">Logout</p>
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-12 sm:gap-8">
            <button
              onClick={() => {
                navigate("/");
              }}
              className="text-xs text-nowrap sm:text-sm flex flex-col items-center py-3 sm:p-3 rounded-lg gap-1 hover:opacity-50"
            >
              <HomeIcon className="sm:h-4 sm:w-4 h-6 w-6" />
              <p className="hidden sm:block">Home</p>
            </button>
            <button
              onClick={() => {
                navigate("/my-bookings");
              }}
              className="text-xs text-nowrap sm:text-sm flex flex-col items-center py-3 sm:p-3 rounded-lg gap-1 hover:opacity-50"
            >
              <BookCheck className="sm:h-4 sm:w-4 h-6 w-6" />
              <p className="hidden sm:block">My Bookings</p>
            </button>
            <button
              onClick={() => {
                navigate("/profile-settings");
              }}
              className="text-xs text-nowrap sm:text-sm flex flex-col items-center py-3 sm:p-3 rounded-lg gap-1 hover:opacity-50"
            >
              <UserCog className="sm:h-4 sm:w-4 h-6 w-6" />
              <p className="hidden sm:block">User Settings</p>
            </button>
            <button
              onClick={handleLogout}
              className="text-xs text-nowrap sm:text-sm flex flex-col items-center py-3 sm:p-3 rounded-lg gap-1 hover:opacity-50"
            >
              <LogOutIcon className="sm:h-4 sm:w-4 h-6 w-6" />
              <p className="hidden sm:block">Logout</p>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BottomNavbar;
