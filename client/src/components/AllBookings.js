import React, { useEffect, useState } from "react";
import { json } from "react-router-dom";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (date) => {
    const jsDate = new Date(date);
    const formattedDate = jsDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formattedDate;
  };

  const getAdminBookings = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/parking/booking/retrieve/admin"
      );
      const jsonData = await response.json();
      console.log(jsonData);
      setBookings(jsonData);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (bookings.length === 0) getAdminBookings();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="flex flex-col gap-2 w-full p-4 bs-light rounded"
        >
          <div className="flex justify-between w-full">
            <div>
              <p>
                <b>{booking.name}</b>{" "}
                {booking.roomnumber ? "(Room " + booking.roomnumber + ")" : ""}
              </p>
            </div>
            <div className="flex gap-2 text-sm">
              <p>
                <b className="my-text-blue">{formatDate(booking.starttime)}</b>{" "}
                (3:00 P.M.)
              </p>
              <p>-</p>
              <p>
                <b className="my-text-blue">{formatDate(booking.endtime)}</b>{" "}
                (11:00 A.M.)
              </p>
            </div>
          </div>
          <div>
            <p>
              <span className="my-text-blue">Email:</span> {booking.email}
            </p>
            <p>
              <span className="my-text-blue">Phone:</span> {booking.phone}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllBookings;
