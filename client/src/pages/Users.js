import { MailIcon, PhoneIcon, UserCircleIcon } from "lucide-react";
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
        <p className="text-2xl mx-auto text-[var(--primary-orange)]">
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
            overflowY: "auto",
          }}
        >
          {users.map((user, index) => (
            <div
              key={index}
              className="bs-light rounded-lg p-3 flex flex-col gap-2"
            >
              <div className="flex gap-2 items-center">
                <UserCircleIcon className="h-6 w-6" strokeWidth={1.5} />
                <p className="text-sm">
                  <b>{user.name}</b>
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-start text-sm gap-4 px-1">
                  <PhoneIcon className="h-4 w-4" strokeWidth={1.5} />
                  <a
                    className="text-[var(--blue)] underline text-xs"
                    href={`tel:${user.phone}`}
                  >
                    {user.phone}
                  </a>
                </div>
                <div className="flex justify-start items-center text-sm gap-4 px-1">
                  <MailIcon className="h-4 w-4" strokeWidth={1.5} />
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
