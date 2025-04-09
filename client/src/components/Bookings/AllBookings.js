import React, { useEffect, useState } from "react";
import {
  PhoneIcon,
  MailIcon,
  BookMinus,
  BookPlus,
  LoaderCircle,
} from "lucide-react";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [recentPastBookings, setRecentPastBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [olderBookings, setOlderBookings] = useState([]);
  const [showOlderBookings, setShowOlderBookings] = useState(false);
  const isAdmin = localStorage.getItem("isAdmin");

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
        `${process.env.REACT_APP_API_URL}/api/parking/booking/retrieve/admin`
      );
      const jsonData = await response.json();
      console.log(jsonData);
      setBookings(
        jsonData.filter((booking) => new Date(booking.endtime) >= new Date())
      );
      setRecentPastBookings(
        jsonData.filter((booking) => new Date(booking.endtime) < new Date())
      );
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getClientBookings = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/parking/booking/retrieve/` +
          localStorage.getItem("uid")
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

  const handleAdminShowMoreBookings = async () => {
    setShowOlderBookings(true);
    if (olderBookings.length > 0) return;
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/parking/booking/retrieve-more/admin`
      );
      const jsonData = await response.json();
      console.log(jsonData);
      setOlderBookings(jsonData);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleHideMoreBookings = () => {
    setShowOlderBookings(false);
  };

  useEffect(() => {
    if (bookings.length === 0 && isAdmin === "Y")
      getAdminBookings().then((_) => _);
    else if (bookings.length === 0 && isAdmin === "N")
      getClientBookings().then((_) => _);
  }, []);

  if (loading) {
    return (
      <div>
        <LoaderCircle className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="pb-12">
      <div className="w-full flex flex-col lg:grid lg:grid-cols-2 gap-4 text-xs p-2">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex flex-col gap-2 w-full p-4 bs-light rounded"
          >
            <div className="flex flex-col justify-between w-full gap-2">
              {isAdmin === "Y" && (
                <div>
                  <p>
                    <b>{booking.subject}</b>{" "}
                    {booking.roomnumber
                      ? "(Room " + booking.roomnumber + ")"
                      : ""}
                  </p>
                </div>
              )}
              <div className="flex gap-2 text-xs">
                <p>
                  <b className="my-text-blue">
                    {formatDate(booking.starttime)}
                  </b>{" "}
                  (3:00 P.M.)
                </p>
                <p>-</p>
                <p>
                  <b className="my-text-blue">{formatDate(booking.endtime)}</b>{" "}
                  (11:00 A.M.)
                </p>
              </div>
            </div>
            {isAdmin === "Y" && (
              <div className="flex flex-col gap-1">
                <div className="flex gap-4">
                  <MailIcon className="h-4 w-4" strokeWidth={1.5} />
                  <p>{booking.email}</p>
                </div>
                <div className="flex gap-4">
                  <PhoneIcon className="h-4 w-4" strokeWidth={1.5} />
                  <a
                    className="text-[var(--blue)] underline"
                    href={`tel:${booking.phone}`}
                  >
                    {booking.phone || "N/A"}
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
        {!loading && bookings.length === 0 && (
          <div className="absolute flex left-1/2 -translate-x-1/2 mt-4">
            <p className="text-sm text-center">
              No Recent Bookings to show at this time.
            </p>
          </div>
        )}
        {recentPastBookings.length > 0 && (
          <>
            <p className="text-sm font-bold">Recent Past Bookings</p>
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-2 w-full p-4 bs-light rounded">
              {recentPastBookings.map((booking) => (
                <div key={booking.id} className="flex flex-col gap-2">
                  <p>
                    <b>{booking.subject}</b>{" "}
                    {booking.roomnumber
                      ? "(Room " + booking.roomnumber + ")"
                      : ""}
                  </p>
                  <p>
                    <span className="my-text-blue">Email:</span> {booking.email}
                  </p>
                  <p>
                    <span className="my-text-blue">Phone:</span>{" "}
                    {booking.phone || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {isAdmin === "Y" && (
        <div className="w-full flex flex-col gap-4 text-xs p-2">
          <div className="flex w-full items-center justify-center">
            <button
              className={`bg-[var(--primary-orange)] hover:opacity-70 transition-opacity text-white rounded-lg w-fit p-4 font-bold text-sm flex items-center gap-4 ${showOlderBookings ? "hidden" : ""}`}
              onClick={handleAdminShowMoreBookings}
            >
              Show Older Bookings <BookPlus className="h-4 w-4" />
            </button>
            <button
              className={`bg-black hover:opacity-70 transition-opacity text-white rounded-lg w-fit p-4 font-bold text-sm flex items-center gap-4 ${showOlderBookings ? "" : "hidden"}`}
              onClick={handleHideMoreBookings}
            >
              Hide Older Bookings <BookMinus className="h-4 w-4" />
            </button>
          </div>
          <div
            className={`${showOlderBookings ? "" : "hidden lg:hidden"} flex flex-col gap-4 lg:grid lg:grid-cols-2`}
          >
            {olderBookings
              .slice()
              .reverse()
              .map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col gap-2 w-full p-4 bs-light rounded"
                >
                  <div className="flex flex-col justify-between w-full gap-2">
                    {isAdmin === "Y" && (
                      <div>
                        <p>
                          <b>{booking.subject}</b>{" "}
                          {booking.roomnumber
                            ? "(Room " + booking.roomnumber + ")"
                            : ""}
                        </p>
                      </div>
                    )}
                    <div className="flex gap-2 text-xs">
                      <p>
                        <b className="my-text-blue">
                          {formatDate(booking.starttime)}
                        </b>{" "}
                        (3:00 P.M.)
                      </p>
                      <p>-</p>
                      <p>
                        <b className="my-text-blue">
                          {formatDate(booking.endtime)}
                        </b>{" "}
                        (11:00 A.M.)
                      </p>
                    </div>
                  </div>
                  {isAdmin === "Y" && (
                    <div>
                      <p>
                        <span className="my-text-blue">Email:</span>{" "}
                        {booking.email}
                      </p>
                      <p>
                        <span className="my-text-blue">Phone:</span>{" "}
                        {booking.phone || "N/A"}
                      </p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBookings;
