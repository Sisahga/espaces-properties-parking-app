import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function getUsers() {
    const response = await fetch("/api/admin/user/retrieve/all");
    const data = await response.json();
    setUsers(data);
    setLoading(false);
  }

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

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    getUser(uid).then((_) => _);
    getUsers().then((_) => _);
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
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

      <div className="flex flex-col gap-2 mt-4">
        <p className="text-2xl mx-auto">
          <b>Users</b>
        </p>
        <div
          className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
          style={{
            maxWidth: "1024px",
            transform: "translateX(-50%)",
            position: "relative",
            left: "50%",
            maxHeight: "60vh",
            overflowY: "scroll",
          }}
        >
          {users.map((user, index) => (
            <div
              key={index}
              className="bs-light rounded p-2 flex flex-col gap-2"
            >
              <div className="flex gap-2 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  color="#000000"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M7.5 17C9.8317 14.5578 14.1432 14.4428 16.5 17M14.4951 9.5C14.4951 10.8807 13.3742 12 11.9915 12C10.6089 12 9.48797 10.8807 9.48797 9.5C9.48797 8.11929 10.6089 7 11.9915 7C13.3742 7 14.4951 8.11929 14.4951 9.5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <p className="text-sm">
                  <b>{user.name}</b>
                </p>
              </div>
              <div>
                <p className="flex justify-between text-sm">
                  <span style={{ color: "var(--blue)" }}>Phone:</span>{" "}
                  <a
                    className="text-blue-500 underline"
                    href={`tel:${user.phone}`}
                  >
                    {user.phone}
                  </a>
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span style={{ color: "var(--blue)" }}>Email:</span>{" "}
                  <p className="text-xs">{user.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users;
