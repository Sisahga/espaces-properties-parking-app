import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/signup";
import Login from "./pages/login";
import TransactionDetails from "./pages/TransactionDetails";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route
          path="/stripe-pay-success"
          element={<TransactionDetails />}
        ></Route>
        <Route path="/stripe-pay-cancel" element={<Home />}></Route>
      </Routes>
    </>
  );
}

export default App;
