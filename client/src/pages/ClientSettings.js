import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ClientSettings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

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

  const handleUserUpdate = async () => {
    const userEmail = document.getElementById("userEmail").value;
    const userPhone = document.getElementById("userPhone").value;
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/user/update/${user.u_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail, phone: userPhone }),
      }
    );
    if (response.ok) {
      console.log("User updated.");
      window.location.reload();
    } else {
      console.error("Failed to update user.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("uid");
    localStorage.removeItem("isAdmin");
    navigate("/login");
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
        <p>{user.name}</p>
        <p>{user.email}</p>
      </div>

      <div className="flex flex-col gap-4 mt-8">
        <div className="w-full flex justify-center">
          <p className="my-text-orange text-lg">
            <b>Profile Settings</b>
          </p>
        </div>
        <div className="flex flex-col mx-auto mt-4 gap-4 justify-center bs-light p-6 rounded-lg">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col mx-auto gap-2">
              <p className="my-text-blue">
                <b>Email</b>
              </p>
              <input
                id="userEmail"
                name="userEmail"
                type="email"
                defaultValue={user.email}
                className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 
                            focus:border-transparent min-w-56"
              ></input>
            </div>
            <div className="flex flex-col mx-auto gap-2">
              <p className="my-text-blue">
                <b>Phone Number</b>
              </p>
              <input
                id="userPhone"
                name="userPhone"
                type="tel"
                defaultValue={user.phone}
                className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 
                            focus:border-transparent min-w-56"
              ></input>
            </div>
          </div>
          <button
            className="bg-[var(--primary-orange)] text-white p-2 hover:opacity-70 transition-opacity rounded"
            onClick={handleUserUpdate}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientSettings;
