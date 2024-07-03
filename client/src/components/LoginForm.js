import React from "react";
import { Link } from "react-router-dom";

const LoginForm = () => {
  return (
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
      {/* Company TM */}
      <div className="mt-4">
        <p className="text-sm font-thin">&copy; MacMee Inc. - 2024</p>
      </div>
    </div>
  );
};

export default LoginForm;
