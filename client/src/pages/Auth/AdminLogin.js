import React from "react";
import AdminLoginForm from "../../components/Auth/AdminLoginForm";

const AdminLogin = () => {
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
        <div className="flex flex-col mt-12 gap-4">
          <p className="whitespace-nowrap font-bold text-lg">ADMIN Login</p>
          <p>Please login to continue</p>
          <div className="mt-4">
            <AdminLoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
