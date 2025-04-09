import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Auth/signup";
import Login from "./pages/Auth/login";
import TransactionDetails from "./pages/TransactionDetails";
import AdminLogin from "./pages/Auth/AdminLogin";
import AllBookingsAdmin from "./pages/Bookings/AllBookingsAdmin";
import AppSettings from "./pages/AppSettings";
import ClientBookings from "./pages/Bookings/ClientBookings";
import ClientSettings from "./pages/ClientSettings";
import SideNavbar from "./components/Navbars/SideNavbar";
import Users from "./pages/Users";
import MenuIconBtn from "./components/Navbars/MenuIconButton";
import BottomNavbar from "./components/Navbars/BottomNavbar";

function App() {
  return (
    <>
      <div id="overlay"></div>
      <div id="notification-ctn"></div>
      <Routes>
        <Route
          path="/"
          element={
            <>
              {localStorage.getItem("authenticated") === "Y" && (
                <>
                  <SideNavbar />
                  <MenuIconBtn />
                </>
              )}
              <Home />
              <BottomNavbar />
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
              <MenuIconBtn />
              <TransactionDetails />
            </>
          }
        ></Route>
        <Route
          path="/stripe-pay-cancel"
          element={
            <>
              <SideNavbar />
              <MenuIconBtn />
              <Home />
              <BottomNavbar />
            </>
          }
        ></Route>
        <Route
          path="/all-bookings-admin"
          element={
            <>
              <SideNavbar />
              <MenuIconBtn />
              <AllBookingsAdmin />
              <BottomNavbar />
            </>
          }
        ></Route>
        <Route
          path="/my-bookings"
          element={
            <>
              <SideNavbar />
              <MenuIconBtn />
              <ClientBookings />
              <BottomNavbar />
            </>
          }
        ></Route>
        <Route
          path="/profile-settings"
          element={
            <>
              <SideNavbar />
              <MenuIconBtn />
              <ClientSettings />
              <BottomNavbar />
            </>
          }
        ></Route>
        <Route
          path="/app-settings"
          element={
            <>
              <SideNavbar />
              <MenuIconBtn />
              <AppSettings />
              <BottomNavbar />
            </>
          }
        ></Route>
        <Route
          path="/customers"
          element={
            <>
              <SideNavbar />
              <MenuIconBtn />
              <Users />
              <BottomNavbar />
            </>
          }
        ></Route>
      </Routes>
    </>
  );
}

export default App;
