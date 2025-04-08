import React from "react";
import SignupForm from "../../components/Auth/SignupForm";

const Signup = () => {
  return (
    <div style={{ height: "100vh" }}>
      <div className="px-12 py-16 text-center h-full flex flex-col">
        {/* HEADER */}
        <div className="flex flex-col gap-4">
          {/* LOGO */}
          <div className="flex flex-col gap-2">
            <p className="text-3xl">
              <b>ESPACE</b>
            </p>
            <p className="text-lg">
              <b>Properties</b>
            </p>
          </div>
          {/* Title */}
          <div className="flex w-full items-center justify-center">
            <p className="my-text-blue text-lg">
              <b>Parking System</b>
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="flex flex-col mt-4 gap-4">
          <p className="whitespace-nowrap">
            Please create an account to continue
          </p>
          <div>
            <SignupForm />
          </div>
        </div>

        {/* Company TM */}
        <div className="mt-4">
          <p className="text-sm font-thin">&copy; MacMee Inc. - 2024</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
