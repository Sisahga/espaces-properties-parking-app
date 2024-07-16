import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/signup";
import Login from "./pages/login";
import TransactionDetails from "./pages/TransactionDetails";
import AdminLogin from "./pages/AdminLogin";
import AllBookingsAdmin from "./pages/AllBookingsAdmin";
import AppSettings from "./pages/AppSettings";
import ClientBookings from "./pages/ClientBookings";
import ClientSettings from "./pages/ClientSettings";
import SideNavbar from "./components/SideNavbar";

function App() {
  const handleMenuButtonClick = () => {
    const menuIconBtn = document.getElementById("menu-icon-btn");
    menuIconBtn.classList.toggle("open");

    if (menuIconBtn.classList.contains("open")) {
      document.getElementById("sideNavbar").style.display = "flex";
      document.getElementById("overlay").style.display = "block";
    } else {
      document.getElementById("sideNavbar").style.display = "none";
      document.getElementById("overlay").style.display = "none";
    }
  };
  return (
    <>
      <div id="overlay"></div>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <SideNavbar />
              <div id="menu-icon-btn" onClick={handleMenuButtonClick}>
                <div id="menu-btn-burger"></div>
              </div>
              <Home />
            </>
          }
        ></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/login/admin" element={<AdminLogin />}></Route>
        <Route
          path="/stripe-pay-success"
          element={
            <>
              <SideNavbar />
              <div id="menu-icon-btn" onClick={handleMenuButtonClick}>
                <div id="menu-btn-burger"></div>
              </div>
              <TransactionDetails />
            </>
          }
        ></Route>
        <Route
          path="/stripe-pay-cancel"
          element={
            <>
              <SideNavbar />
              <div id="menu-icon-btn" onClick={handleMenuButtonClick}>
                <div id="menu-btn-burger"></div>
              </div>
              <Home />
            </>
          }
        ></Route>
        <Route
          path="/all-bookings-admin"
          element={
            <>
              <SideNavbar />
              <div id="menu-icon-btn" onClick={handleMenuButtonClick}>
                <div id="menu-btn-burger"></div>
              </div>
              <AllBookingsAdmin />
            </>
          }
        ></Route>
        <Route
          path="/my-bookings"
          element={
            <>
              <SideNavbar />
              <div id="menu-icon-btn" onClick={handleMenuButtonClick}>
                <div id="menu-btn-burger"></div>
              </div>
              <ClientBookings />
            </>
          }
        ></Route>
        <Route
          path="/profile-settings"
          element={
            <>
              <SideNavbar />
              <div id="menu-icon-btn" onClick={handleMenuButtonClick}>
                <div id="menu-btn-burger"></div>
              </div>
              <ClientSettings />
            </>
          }
        ></Route>
        <Route
          path="/app-settings"
          element={
            <>
              <SideNavbar />
              <div id="menu-icon-btn" onClick={handleMenuButtonClick}>
                <div id="menu-btn-burger"></div>
              </div>
              <AppSettings />
            </>
          }
        ></Route>
      </Routes>
    </>
  );
}

export default App;
