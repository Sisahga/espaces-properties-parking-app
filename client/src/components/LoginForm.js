import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const email = formData.get("email");
    const loginResponse = await fetch("http://localhost:8080/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (loginResponse.ok) {
      console.log("User logged in successfully!");
      const user = await loginResponse.json();
      const userId = user.u_id;
      localStorage.setItem("authenticated", "Y");
      localStorage.setItem("uid", userId);
      localStorage.setItem("isAdmin", "N");
      navigate("/");
    } else {
      if (loginResponse.status === 400) {
        alert("User with email " + email + " not found.");
      } else {
        console.error("Failed to login user.");
      }
    }
  };

  return (
    <form className="p-2" onSubmit={handleLogin}>
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
        {/* Submit Button */}
        <div className="flex">
          <button
            type="submit"
            className="bg-[#FF6600] text-white py-2 px-4 rounded-md w-full text-center text-lg font-semibold shadow-lg hover:bg-[#e55d00] focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:ring-opacity-50"
          >
            Log In
          </button>
        </div>
        {/* Login */}
        <div className="flex flex-col pt-2">
          <p className="text-sm">Don't have an account?</p>
          <Link to={"/signup"} className="underline my-text-light-blue">
            Signup here
          </Link>
        </div>
        {/* Admin Login */}
        <div className="flex flex-col pt-2">
          <p className="text-sm">Admin?</p>
          <Link to={"/login/admin"} className="underline my-text-light-blue">
            Login here
          </Link>
        </div>
        {/* Company TM */}
        <div className="mt-4">
          <p className="text-sm font-thin">&copy; MacMee Inc. - 2024</p>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
