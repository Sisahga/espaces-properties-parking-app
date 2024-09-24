import React, { useRef, useState, useEffect } from "react";
import {
  ScheduleComponent,
  Week,
  Month,
  Inject,
  ViewDirective,
  ViewsDirective,
  setTime,
} from "@syncfusion/ej2-react-schedule";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { L10n } from "@syncfusion/ej2-base";
import cars from "../../cars.json";
import SpinnerGif from "../Spinner";
import ClientViewBooking from "../ClientViewBooking";

// Define a custom locale
L10n.load({
  "en-US": {
    schedule: {
      saveButton: "Pay Now",
      cancelButton: "Cancel",
      deleteButton: "Delete",
      newEvent: "New Parking Booking",
    },
  },
});

const ClientScheduler = () => {
  const scheduleObj = useRef(null);
  const [bookings, setBookings] = useState([]);
  const [bookingSlot, setBookingSlot] = useState("");
  const [bookingMake, setBookingMake] = useState("");
  const [bookingLicensePlate, setBookingLicensePlate] = useState("");

  async function retrieveBookings() {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/parking/booking/retrieve`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      // Map the data to the expected format
      const formattedData = data.map((item) => ({
        Id: item.id,
        Subject: item.subject,
        StartTime: new Date(item.starttime),
        EndTime: new Date(item.endtime),
        IsAllDay: item.isallday,
        Description: item.description,
        LicensePlate: item.licenseplate,
        VehicleMake: item.vehiclemake,
        uid: item.u_id,
      }));

      setBookings(formattedData);

      console.log("Bookings: ", formattedData);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }

  useEffect(() => {
    if (bookings.length === 0) retrieveBookings();
  }, []);

  const handleRentalCarChange = (e) => {
    if (e.target.checked) {
      document.getElementById("licensePlateLbl").innerText = "License Plate";
      document.getElementById("vehicleMakeLbl").innerText = "Vehicle Make";
    } else {
      document.getElementById("licensePlateLbl").innerText = "License Plate *";
      document.getElementById("vehicleMakeLbl").innerText = "Vehicle Make *";
    }
  };

  function daysBetween(date1, date2) {
    // Convert input strings to Date objects
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    // Calculate the difference in milliseconds
    const diffTime = Math.abs(d2 - d1);

    // Convert milliseconds to days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  function formatDate(dateStr, isReg) {
    // Create a Date object from the input date string
    const date = new Date(dateStr);

    // Define the month names
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Get the day, month, and year from the Date object
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    // Construct the formatted date string
    if (isReg) return `${month} ${day}, ${year}`;
    else {
      let month = date.getMonth() + 1;
      if (month < 10) month = "0" + month;
      let tempDay = day;
      if (tempDay < 10) tempDay = "0" + day;
      return `${year}-${month}-${day} 04:00:00`;
    }
  }

  function validateFields(data) {
    if (
      data.StartTime === "" ||
      data.EndTime === "" ||
      (data.LicensePlate === "" &&
        document.getElementById("licensePlateLbl").innerText.includes("*")) ||
      (data.VehicleMake === "" &&
        document.getElementById("vehicleMakeLbl").innerText.includes("*"))
    ) {
      return false;
    }
    return true;
  }

  function handleBeforeAppointmentChange(args) {
    const appointments = scheduleObj.current.getEvents();
    const newAppointment = args.data[0];
    const currentDate = new Date();

    // Check if the new appointment's start time is before the current date and time
    if (new Date(newAppointment.StartTime) < currentDate) {
      args.cancel = true;
      alert("Cannot create a booking with a start time in the past.");
      return true;
    }

    const existingAppointments = appointments.filter((appointment) => {
      return (
        appointment !== args.data &&
        ((newAppointment.StartTime >= appointment.StartTime &&
          newAppointment.StartTime < appointment.EndTime) ||
          (newAppointment.EndTime > appointment.StartTime &&
            newAppointment.EndTime <= appointment.EndTime) ||
          (newAppointment.StartTime <= appointment.StartTime &&
            newAppointment.EndTime >= appointment.EndTime))
      );
    });

    if (existingAppointments.length > 0) {
      args.cancel = true;
      alert("Cannot overlap with existing events.");
      return true;
    } else return false;
  }

  // === EVENT RENDERED EVENT ===
  const onEventRendered = (args) => {
    console.log("Event Rendered: ", args);
    const eventElement = args.element;
    const userID = localStorage.getItem("uid");
    console.log("User ID: ", userID);

    // Use setTimeout to defer accessing parentElement
    setTimeout(() => {
      const eventText = eventElement.querySelector(".e-subject");

      const parentElement = eventElement.parentElement;
      const grandparentElement = parentElement.parentElement;
      console.log("Parent Element: ", parentElement);
      console.log("Grandparent Element: ", grandparentElement);

      const guid = eventElement.getAttribute("data-guid");
      const diffDays = args.data.data.count;
      console.log("Day Diff: ", diffDays);

      eventElement.id = guid;
      var isClientEvent = false;
      if (userID === args.data.uid.toString()) {
        eventElement.classList.add("clientEvent");
        isClientEvent = true;
        eventText.innerText = "Your Booking";
      } else {
        eventElement.classList.add("nonClientEvent");
        eventText.innerText = "Booked";
      }
      eventElement.classList.add("noBorder");
      // Check if parentElement is not null before manipulating it
      if (grandparentElement) {
        grandparentElement.setAttribute("eventguid", guid);
        if (isClientEvent) {
          grandparentElement.classList.add("clientEvent");
        } else {
          grandparentElement.classList.add("nonClientEvent");
        }
        grandparentElement.children[0].classList.add("clientEventText");
        if (diffDays > 0) {
          var nextElement = grandparentElement.nextElementSibling;
          for (var i = 0; i < diffDays - 1; i++) {
            if (nextElement) {
              console.log("Getting Next Element: ", nextElement);
              if (isClientEvent) {
                nextElement.classList.add("clientEvent");
              } else {
                nextElement.classList.add("nonClientEvent");
              }
              nextElement.setAttribute("eventguid", guid);
              nextElement.children[0].classList.add("clientEventText");
              nextElement = nextElement.nextElementSibling;
            }
          }
        }
      }
    }, 0);
  };

  const onPopupOpen = (args) => {
    console.log("Popup Opened: ", args);
    const target = args.target;
    console.log("Target: ", target);
    if (
      target !== undefined &&
      (target.classList.contains("clientEvent") ||
        target.classList.contains("nonClientEvent"))
    ) {
      args.cancel = true;
    }
    try {
      document.getElementsByClassName("e-event-save")[0].innerText = "Pay Now";
    } catch (e) {
      console.log("mobile view.");
    }
  };

  // === CELL CLICK EVENTS ===
  const onCellClick = (args) => {
    console.log("Cell Clicked: ", args);
    if (
      args.element.classList.contains("clientEvent") ||
      args.element.classList.contains("nonClientEvent")
    ) {
      console.log("Show different popup...");
      args.cancel = true;
      const cell = args.element;
      const eventGuid = cell.getAttribute("eventguid");
      document.getElementById(eventGuid).click();
    } else scheduleObj.current.openEditor(args, "Add");
  };
  const onEventClick = (args) => {
    console.log("Event Clicked: ", args.event);

    console.log("show different popup...");

    if (args.element.classList.contains("clientEvent")) {
      const startTime = formatDate(args.event.StartTime, true);
      const endTime = formatDate(args.event.EndTime, true);
      setBookingSlot(startTime + " (3:00 P.M.) - " + endTime + " (11:00 A.M.)");
      setBookingMake(args.event.VehicleMake);
      setBookingLicensePlate(args.event.LicensePlate);

      setTimeout(() => {
        const overlay = document.getElementById("overlay");
        overlay.style.display = "flex";
        const popup = document.getElementById("clientBookingDetails");
        popup.style.display = "flex";
      }, 0);
    }
  };

  // === ACTION BEGIN EVENT ===
  const onActionBegin = async (args) => {
    if (args.requestType === "eventCreate") {
      const data = args.data[0];
      const slotAvailable = scheduleObj.current.isSlotAvailable(
        data.StartTime,
        data.EndTime
      );
      console.log("Slot Available: ", slotAvailable);
      if (!slotAvailable) {
        args.cancel = true;
        alert(
          "The selected dates are already booked. Please choose different dates."
        );
        return;
      }

      const overlapExists = handleBeforeAppointmentChange(args);
      if (overlapExists) {
        alert("Cannot overlap with existing events.");
        args.cancel = true;
        return;
      }

      const validBooking = validateFields(data);

      if (!validBooking) {
        alert(
          "Some required fields are missing. Please fill in all required fields."
        );
        args.cancel = true;
        return;
      }

      const newBooking = {
        uid: localStorage.getItem("uid"),
        subject: localStorage.getItem("u_name"),
        startTime: formatDate(data.StartTime, false),
        endTime: formatDate(data.EndTime, false),
        isAllDay: true,
        description: data.Description,
        licensePlate: data.LicensePlate,
        vehicleMake: data.VehicleMake,
      };
      console.log("New Booking: ", newBooking);

      var daysBooked = daysBetween(newBooking.startTime, newBooking.endTime);
      console.log("Days Booked: ", daysBooked);
      if (daysBooked === 0) daysBooked = 1;
      console.log("Days Booked after 0 check: ", daysBooked);

      const formattedStartDate = formatDate(newBooking.startTime, true);
      const formattedEndDate = formatDate(newBooking.endTime, true);
      console.log("Formatted Start Date: ", formattedStartDate);
      console.log("Formatted End Date: ", formattedEndDate);

      // Prevent the default action, since it will redirect to payment screen anyway.
      args.cancel = true;
      const overlay = document.getElementById("overlay");
      overlay.style.display = "flex";
      const spinner = document.getElementById("spinnerComponent");
      spinner.style.display = "flex";

      // const dbResponse = await fetch(
      //   `${process.env.REACT_APP_API_URL}/api/parking/booking/create`,
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(newBooking),
      //   }
      // );
      // var bookingID;
      // if (!dbResponse.ok) {
      //   const error = await dbResponse.json();
      //   console.error("Error:", error.error);
      // } else {
      //   const booking = await dbResponse.json();
      //   bookingID = booking.id;
      //   console.log("Booking: ", booking);
      // }

      const stripeResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/api/parking/payment/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: daysBooked,
            description:
              formattedStartDate +
              " 3:00P.M. - " +
              formattedEndDate +
              " 11:00A.M.",
            bookingID: bookingID,
          }),
        }
      );

      if (!stripeResponse.ok) {
        const error = await stripeResponse.json();
        alert("An error occurred. Please try again.");
        console.error("Error:", error.error);
      } else {
        const { url } = await stripeResponse.json();

        const dbResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/parking/booking/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newBooking),
          }
        );
        var bookingID;
        if (!dbResponse.ok) {
          const error = await dbResponse.json();
          console.error("Error:", error.error);
        } else {
          const booking = await dbResponse.json();
          bookingID = booking.id;
          console.log("Booking: ", booking);
        }

        window.location.href = url;
      }
    }
  };

  // ===> CUSTOM EDITOR TEMPLATE <===
  const editorTemplate = (props) => {
    return props !== undefined && Object.keys(props).length > 0 ? (
      <div className="custom-event-editor pt-4">
        <div className="flex flex-col gap-4">
          {/* TOP ROW */}
          <div className="flex w-full gap-4">
            <div className="flex flex-col w-1/2">
              <div className="e-textlabel">From *</div>
              <div>
                <DatePickerComponent
                  format="dd/MM/yyyy"
                  id="StartTime"
                  data-name="StartTime"
                  value={new Date(props.startTime || props.StartTime)}
                  className="e-field"
                ></DatePickerComponent>
              </div>
            </div>
            <div className="flex flex-col w-1/2">
              <div className="e-textlabel">To *</div>
              <div>
                <DatePickerComponent
                  format="dd/MM/yyyy"
                  id="EndTime"
                  data-name="EndTime"
                  value={new Date(props.endTime || props.EndTime)}
                  className="e-field"
                ></DatePickerComponent>
              </div>
            </div>
          </div>

          {/* MIDDLE ROW */}
          <div className="flex w-full gap-4">
            <div className="flex flex-col w-1/2">
              <div className="e-textlabel" id="licensePlateLbl">
                License Plate *
              </div>
              <div style={{ paddingTop: "3px" }}>
                <input
                  id="LicensePlate"
                  className="e-field e-input"
                  type="text"
                  name="LicensePlate"
                />
              </div>
            </div>
            <div className="flex flex-col w-1/2">
              <div className="e-textlabel" id="vehicleMakeLbl">
                Vehicle Make *
              </div>
              <div>
                <DropDownListComponent
                  className="e-field"
                  placeholder="Select Vehicle"
                  name="VehicleMake"
                  data-name="VehicleMake"
                  dataSource={cars}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 w-1/2">
            <div className="e-textlabel">Rental Car?</div>
            <div className="mt-1">
              <input
                id="isRentalCar"
                className="e-field e-input"
                type="checkbox"
                name="isRentalCar"
                onChange={handleRentalCarChange}
              />
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div className="flex flex-col w-full">
            <div className="e-textlabel">Additional Notes</div>
            <input
              id="additionalNotes"
              className="e-field e-input"
              type="text"
              name="additionalNotes"
            />
          </div>

          {/* FOOTNOTE */}
          <div className="flex flex-col">
            <p className="pb-2">
              <b>N.B.</b>
            </p>
            <p>
              Arrivals are scheduled starting at <b>3:00 P.M.</b> on the first
              day of booking.
            </p>
            <p>
              Departures are scheduled at the latest for <b>11:00 A.M.</b> on
              the last day of booking.
            </p>
          </div>
        </div>
      </div>
    ) : (
      <div></div>
    );
  };

  const eventSettings = { dataSource: bookings };

  return (
    <div className="mt-4" style={{ overflowY: "scroll", maxHeight: "80vh" }}>
      {/* ClientViewBooking component will display booking details */}
      <ClientViewBooking
        bookingSlot={bookingSlot}
        vehicle={bookingMake}
        licensePlate={bookingLicensePlate}
      />
      <SpinnerGif loadingText={"You are being redirected to checkout..."} />
      <ScheduleComponent
        className="rounded"
        style={{ overflowY: "scroll", maxHeight: "100%" }}
        ref={scheduleObj}
        eventSettings={eventSettings}
        showQuickInfo={false}
        editorTemplate={editorTemplate}
        currentView="Month"
        cellClick={onCellClick}
        popupOpen={onPopupOpen}
        eventClick={onEventClick}
        eventRendered={onEventRendered}
        actionBegin={onActionBegin}
      >
        <ViewsDirective>
          <ViewDirective option="Month" />
        </ViewsDirective>
        <Inject services={[Week, Month]} />
      </ScheduleComponent>
    </div>
  );
};

export default ClientScheduler;
