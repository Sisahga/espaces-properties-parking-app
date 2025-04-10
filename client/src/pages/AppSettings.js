import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AppSettings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [priceLoading, setPriceLoading] = useState(true);
  const [price, setPrice] = useState(0);

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

  const handlePriceChange = async () => {
    const newPriceStr = document.getElementById("parkingPrice").value;
    const newPrice = parseFloat(newPriceStr) * 100;
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/parking/payment/update-standard-price`,
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
      `${process.env.REACT_APP_API_URL}/api/parking/payment/standard-price`,
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
    getParkingPrice().then((_) => _);
    getUser(uid).then((_) => _);
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
      <div className="flex justify-between bs-light px-4 py-2 rounded my-text-blue top-bar">
        <p>
          <b>ADMIN</b>
        </p>
        <p>{user.email}</p>
      </div>

      <div className="flex flex-col gap-4 mt-8">
        <div className="w-full flex justify-center">
          <p className="my-text-orange text-lg">
            <b>App Settings</b>
          </p>
        </div>
        <div className="flex flex-col gap-6 w-72 sm:w-96 bs-light p-8 rounded-lg mx-auto">
          <div className="flex flex-col gap-2">
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
          <button
            className="bg-[var(--primary-orange)] text-white p-2 hover:opacity-70 transition-opacity rounded"
            onClick={handlePriceChange}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppSettings;
