import React from "react";
import { useNavigate } from "react-router-dom";
import { notify } from "../util/functions";

const AdminLoginForm = () => {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const email = formData.get("email");
    const password = formData.get("password");
    const loginResponse = await fetch(
      `${process.env.REACT_APP_API_URL}/api/admin/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (loginResponse.ok) {
      console.log("Admin logged in successfully!");
      const user = await loginResponse.json();
      const userId = user.u_id;
      localStorage.setItem("authenticated", "Y");
      localStorage.setItem("uid", userId);
      localStorage.setItem("isAdmin", "Y");
      navigate("/");
    } else {
      if (loginResponse.status === 400) {
        notify("Invalid Credentials.", false);
      } else {
        console.error("Failed to login admin user.");
      }
    }
  };

  return (
    <form className="p-2 reg-form" onSubmit={handleLogin}>
      <div className="flex flex-col gap-4">
        {/* Email Address */}
        <div className="flex flex-col">
          <label
            className="block text-gray-700 text-sm font-bold text-left pl-2 mb-1"
            htmlFor="email"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="example@example.com"
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></input>
        </div>
        {/* Password */}
        <div className="flex flex-col">
          <label
            className="block text-gray-700 text-sm font-bold text-left pl-2 mb-1"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></input>
        </div>
        {/* Submit Button */}
        <div className="flex">
          <button
            type="submit"
            className="bg-[#FF6600] text-white py-2 px-4 rounded-md w-full text-center text-lg font-semibold shadow-lg hover:bg-[#e55d00] focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:ring-opacity-50"
          >
            Log In
          </button>
        </div>
        {/* Regular Login */}
        <div className="flex flex-col mt-4">
          <p className="text-sm">Not an admin?</p>
          <a href="/login" className="underline my-text-light-blue">
            Login here
          </a>
        </div>

        {/* Company TM */}
        <div className="mt-4">
          <p className="text-sm font-thin">&copy; MacMee Inc. - 2024</p>
        </div>
      </div>
    </form>
  );
};

export default AdminLoginForm;
