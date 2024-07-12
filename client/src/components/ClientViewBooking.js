import React from "react";

const ClientViewBooking = ({ bookingSlot }) => {
  return (
    <div id="clientBookingDetails" className="flex-col">
      <p>{bookingSlot}</p>
      <p>To cancel or modify your booking, please contact administration.</p>
    </div>
  );
};

export default ClientViewBooking;
