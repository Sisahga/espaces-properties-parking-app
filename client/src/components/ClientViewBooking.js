import React from "react";

const ClientViewBooking = ({ bookingSlot, vehicle, licensePlate }) => {
  return (
    <div
      id="clientBookingDetails"
      className="flex-col items-center justify-center text-center rounded gap-4"
    >
      <button
        onClick={() => {
          document.getElementById("clientBookingDetails").style.display =
            "none";
          document.getElementById("overlay").style.display = "none";
        }}
        style={{
          position: "absolute",
          right: "1rem",
          top: "0.25rem",
          fontSize: "1.5rem",
        }}
      >
        x
      </button>
      <p className="my-text-blue text-lg">
        <b>Your Booking Details</b>
      </p>
      <p>
        <b>{bookingSlot}</b>
      </p>
      <div className="flex gap-2">
        <p>{vehicle}</p> {" - "}
        <p>{licensePlate}</p>
      </div>
      <p className="text-sm">
        To cancel or modify your booking, please contact administration.
      </p>
    </div>
  );
};

export default ClientViewBooking;
