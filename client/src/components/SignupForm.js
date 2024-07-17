import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Inputmask from "inputmask";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const phoneInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const iMask = new Inputmask("999-999-9999");
    iMask.mask(phoneInputRef.current);
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const name = formData.get("name");
    const phone = formData.get("phone");

    console.log(email, name, phone);
    const registerUserResponse = await fetch(
      `${process.env.REACT_APP_API_URL}/api/user/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, phone }),
      }
    );

    if (registerUserResponse.ok) {
      console.log("User registered successfully!");
      const user = await registerUserResponse.json();
      const userId = user.u_id;
      localStorage.setItem("authenticated", "Y");
      localStorage.setItem("uid", userId);
      localStorage.setItem("isAdmin", "N");

      navigate("/");
    } else {
      if (registerUserResponse.status === 400) {
        alert("User with email " + email + " already exists.");
      }
      console.error("Failed to register user.");
    }
  };

  return (
    <form className="p-2" onSubmit={handleSignup}>
      <div className="flex flex-col gap-4">
        {/* Full Name */}
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold text-left pl-2 mb-1"
          >
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></input>
        </div>
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
        {/* Phone Number */}
        <div className="flex flex-col">
          <label
            className="block text-gray-700 text-sm font-bold text-left pl-2 mb-1"
            htmlFor="phone"
          >
            Phone Number
          </label>
          <input
            type="tel"
            ref={phoneInputRef}
            id="phone"
            name="phone"
            placeholder="999-999-9999"
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {/* Submit Button */}
        <div className="flex">
          <button
            type="submit"
            className="bg-[#FF6600] text-white py-2 px-4 rounded-md w-full text-center text-lg font-semibold shadow-lg hover:bg-[#e55d00] focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:ring-opacity-50"
          >
            Submit
          </button>
        </div>
        {/* Login */}
        <div className="flex flex-col pt-2">
          <p className="text-sm">Already have an account?</p>
          <Link to={"/login"} className="underline my-text-light-blue">
            Login
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignupForm;
