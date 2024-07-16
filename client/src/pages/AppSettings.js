import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavbar from "../components/BottomNavbar";

const AppSettings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [priceLoading, setPriceLoading] = useState(true);
  const [price, setPrice] = useState(0);

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

  const handlePriceChange = async () => {
    const newPriceStr = document.getElementById("parkingPrice").value;
    const newPrice = parseFloat(newPriceStr) * 100;
    const response = await fetch(
      `http://localhost:8080/api/parking/payment/update-standard-price`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPrice: newPrice }),
      }
    );
    if (response.ok) {
      console.log("Price updated.");
      window.location.reload();
    } else {
      console.error("Failed to update");
    }
  };

  async function getParkingPrice() {
    const response = await fetch(
      `http://localhost:8080/api/parking/payment/standard-price`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const priceObj = await response.json();
      const price = parseFloat(priceObj.priceInCents) / 100;
      setPrice(price);
      setPriceLoading(false);
    } else {
      console.error("Failed to get parking price.");
    }
  }

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    getParkingPrice();
    getUser(uid);
  }, [navigate]);

  if (loading || priceLoading) {
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
            defaultValue={price.toFixed(2)}
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></input>
        </div>
        <div className="flex mx-auto w-1/2 mt-4">
          <button
            className="buttonBig rounded"
            onClick={handlePriceChange}
            style={{
              backgroundColor: "var(--green) !important",
            }}
          >
            Save
          </button>
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
};

export default AppSettings;
