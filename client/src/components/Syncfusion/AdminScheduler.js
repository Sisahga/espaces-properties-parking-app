import React, { useRef, useState, useEffect } from "react";
import {
  ScheduleComponent,
  Week,
  Month,
  Inject,
  ViewDirective,
  ViewsDirective,
} from "@syncfusion/ej2-react-schedule";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { L10n } from "@syncfusion/ej2-base";
import cars from "../../cars.json";
import SpinnerGif from "../Spinner";
import { handleMobileSave } from "../../util/functions";

// Define a custom locale
L10n.load({
  "en-US": {
    schedule: {
      saveButton: "Save",
      cancelButton: "Cancel",
      deleteButton: "Delete",
      newEvent: "New Parking Booking",
    },
  },
});

const AdminScheduler = () => {
  const scheduleObj = useRef(null);
  const [bookings, setBookings] = useState([]);

  async function retrieveBookings() {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/parking/booking/retrieve/admin`,
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
        name: item.name,
        email: item.email,
        phone: item.phone,
        RoomNum: item.roomnumber,
      }));

      setBookings(formattedData);

      console.log("Bookings: ", formattedData);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }

  useEffect(() => {
    // if (bookings.length === 0) retrieveBookings();
    retrieveBookings();
  }, []);

  function normalizeDate(date) {
    alert("Date day: " + date.getDate());
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

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

  function formatEndTimeDate(dateStr) {
    // Split the string into day, month, and year
    let [day, month, year] = dateStr.split("/").map(Number);

    // Create a Date object from the parsed values (month is 0-indexed)
    let date = new Date(year, month - 1, day);

    // Format the new date back to DD/MM/YYYY
    let newDay = String(date.getDate()).padStart(2, "0");
    let newMonth = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    let newYear = date.getFullYear();

    let newDateStr = `${newYear}-${newMonth}-${newDay}`;
    console.log("New Date String: ", newDateStr);

    return newDateStr + " 04:00:00";
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
    if (data.StartTime === "" || data.EndTime === "") {
      return false;
    }
    return true;
  }

  function handleOverlapUpdate(args) {
    const appointments = scheduleObj.current.getEvents();
    const newAppointment = args.data;
    const existingAppointments = appointments.filter((appointment) => {
      if (appointment.Id === newAppointment.Id) {
        return false;
      }
      console.log("Appointment: ", appointment);
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

  function handleBeforeAppointmentChange(args) {
    const appointments = scheduleObj.current.getEvents();
    const newAppointment = args.data[0];
    const currentDate = new Date();

    // Check if the new appointment's start time is before the current date and time
    // if (new Date(newAppointment.StartTime) < currentDate) {
    //   args.cancel = true;
    //   alert("Cannot create a booking with a start time in the past.");
    //   return true;
    // }

    const existingAppointments = appointments.filter((appointment) => {
      console.log("Appointment: ", appointment);
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
      var roomNumber = args.data.RoomNum ? "Room " + args.data.RoomNum : "";
      eventText.innerHTML =
        "<div className='flex flex-col'><p><b>" +
        args.data.Subject +
        "</b></p><p>" +
        roomNumber +
        "</p></div>";

      const parentElement = eventElement.parentElement;
      const grandparentElement = parentElement.parentElement;
      console.log("Parent Element: ", parentElement);
      console.log("Grandparent Element: ", grandparentElement);

      const guid = eventElement.getAttribute("data-guid");
      const diffDays = args.data.data.count;
      console.log("Day Diff: ", diffDays);

      eventElement.id = guid;
      eventElement.classList.add("nonClientEvent");
      eventElement.classList.add("noBorder");
      // Check if parentElement is not null before manipulating it
      if (grandparentElement) {
        grandparentElement.setAttribute("eventguid", guid);
        grandparentElement.classList.add("nonClientEvent");

        grandparentElement.children[0].classList.add("clientEventText");
        if (diffDays > 0) {
          var nextElement = grandparentElement.nextElementSibling;
          for (var i = 0; i < diffDays - 1; i++) {
            if (nextElement) {
              console.log("Getting Next Element: ", nextElement);
              nextElement.classList.add("nonClientEvent");
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
    // Check if on mobile, adjust action buttons accordingly
    const screenWidth = window.innerWidth;
    const deleteDiv = document.getElementById("mbDelete");
    const editorActionsDiv = document.getElementById("mbEditorActions");

    if (screenWidth < 768) {
      console.log("Mobile Screen Detected");

      if (document.getElementById("Subject").value === "") {
        deleteDiv.style.display = "none";
        editorActionsDiv.style.justifyContent = "flex-end";
      } else {
        console.log("EDITING PARKING EVENT DETECTED");
      }
    }

    if (args.type === "Editor") {
      console.log("Editor!");
      var endTimeElement = document.getElementById("EndTime");
      console.log("End Time Element: ", endTimeElement);
      console.log("End Time Value: ", endTimeElement.value);

      // ERROR FIX: Date shows as 1 day behind when editing event
      let dateStr = endTimeElement.value;

      // Split the string into day, month, and year
      let [day, month, year] = dateStr.split("/").map(Number);

      // Create a Date object from the parsed values (month is 0-indexed)
      let date = new Date(year, month - 1, day);

      // Increment the date by one day
      //date.setDate(date.getDate() + 1);

      // Format the new date back to DD/MM/YYYY
      // let newDay = String(date.getDate()).padStart(2, "0");
      // let newMonth = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
      // let newYear = date.getFullYear();

      // let newDateStr = `${newDay}/${newMonth}/${newYear}`;
      // console.log("New Date String: ", newDateStr);
      // endTimeElement.value = newDateStr;
    } else {
      console.log("Non Editor. Popup Type: ", args.type);
    }

    console.log("Screen Width: ", screenWidth);
    console.log("Popup Opened: ", args);
    const target = args.target;
    console.log("Target: ", target);
  };

  // === CELL CLICK EVENTS ===
  const onCellClick = (args) => {
    console.log("Cell Clicked: ", args);
    if (args.element.classList.contains("nonClientEvent")) {
      console.log("Show different popup...");
      const cell = args.element;
      const eventGuid = cell.getAttribute("eventguid");
      document.getElementById(eventGuid).click();
    } else {
      scheduleObj.current.openEditor(args, "Add");
    }
  };
  const onEventClick = (args) => {
    console.log("Event Clicked: ", args);
    scheduleObj.current.openEditor(args.event, "Save");
  };

  // === ACTION BEGIN EVENT ===
  const onActionBegin = async (args) => {
    console.log("Request type: ", args.requestType);
    console.log("Args:", args);
    // === EVENT CREATE ===
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
        subject: data.Subject,
        startTime: formatDate(data.StartTime, false),
        endTime: formatDate(data.EndTime, false),
        isAllDay: true,
        description: data.Description,
        licensePlate: data.LicensePlate,
        vehicleMake: data.VehicleMake,
        roomNumber: data.RoomNum,
        paymentStatus: "ADMIN",
      };
      console.log("New Booking: ", newBooking);

      const daysBooked = daysBetween(newBooking.startTime, newBooking.endTime);
      console.log("Days Booked: ", daysBooked);

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
        window.location.reload();
      }
    }
    // === EVENT UPDATE ===
    else if (args.requestType === "eventChange") {
      console.log(args);
      const slotAvailable = scheduleObj.current.isSlotAvailable(
        args.data.StartTime,
        args.data.EndTime
      );
      console.log("Slot Available: ", slotAvailable);
      if (!slotAvailable) {
        args.cancel = true;
        alert(
          "The selected dates are already booked. Please choose different dates."
        );
        return;
      }

      const overlapExists = handleOverlapUpdate(args);
      if (overlapExists) {
        args.cancel = true;
        return;
      }

      // Need to check End Time (issues)
      console.log("Booking to update: " + args.data.Id);
      const booking = {
        startTime: formatDate(args.data.StartTime, false),
        endTime: formatEndTimeDate(document.getElementById("EndTime").value),
        licensePlate: args.data.LicensePlate,
        vehicleMake: args.data.VehicleMake,
        description: args.data.Description,
        roomNumber: args.data.RoomNum,
        subject: args.data.Subject,
      };
      console.log("Booking: ", booking);

      const dbResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/api/parking/booking/update/` +
          args.data.Id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(booking),
        }
      );
      if (!dbResponse.ok) {
        const error = await dbResponse.json();
        console.error("Error:", error.error);
      } else {
        const response = await dbResponse.json();
        console.log("Response: ", response);
        alert("Booking updated.");
        window.location.reload();
      }
    }
    // === EVENT DELETE ===
    else if (args.requestType === "eventRemove") {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/parking/booking/delete/${args.data[0].Id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        console.log("Booking deleted.");
        alert("Booking successfully deleted.");
        window.location.reload();
      } else {
        console.error("Failed to delete booking.");
      }
    }
  };

  // const handleMobileSave = async (props) => {
  //   console.log("MB Props: ", props);

  //   const startTime = document.getElementById("StartTime").value;
  //   const endTime = document.getElementById("EndTime").value;

  //   // Parse the date string. Assuming the format is DD/MM/YYYY
  //   var [day, month, year] = startTime.split("/").map(Number);
  //   var date = new Date(year, month - 1, day); // Months are 0-based in JavaScript

  //   // Convert to ISO format
  //   const startObject = date.toISOString();

  //   [day, month, year] = endTime.split("/").map(Number);
  //   date = new Date(year, month - 1, day); // Months are 0-based in JavaScript

  //   // Convert to ISO format
  //   const endObject = date.toISOString();

  //   console.log("Start Time: ", startObject);
  //   console.log("End Time: ", endObject);

  //   const newEvent = {
  //     Subject: document.getElementById("Subject").value,
  //     StartTime: startObject,
  //     EndTime: endObject,
  //     LicensePlate: document.getElementById("LicensePlate").value,
  //     VehicleMake: document.getElementById("VehicleMake").value,
  //     RoomNum: document.getElementById("RoomNum").value,
  //     Description: document.getElementById("Description").value,
  //   };

  //   scheduleObj.current.saveEvent(newEvent, "Save");
  // };

  const handleMobileDelete = async (props) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/parking/booking/delete/${props.Id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      console.log("Booking deleted.");
      alert("Booking successfully deleted.");
      window.location.reload();
    } else {
      console.error("Failed to delete booking.");
    }
  };

  // ===> CUSTOM EDITOR TEMPLATE <===
  const editorTemplate = (props) => {
    return props !== undefined && Object.keys(props).length > 0 ? (
      <div className="custom-event-editor pt-4">
        <div className="flex flex-col gap-4">
          {/* TOP ROW */}
          <div className="flex flex-col w-full">
            <div className="e-textlabel">Title</div>
            <input
              id="Subject"
              className="e-field e-input"
              type="text"
              name="Subject"
              defaultValue={props.Subject || ""}
            />
          </div>
          <div className="flex w-full gap-4">
            <div className="flex flex-col w-1/2">
              <div className="e-textlabel">From *</div>
              <div>
                <DatePickerComponent
                  format="dd/MM/yyyy"
                  id="StartTime"
                  data-name="StartTime"
                  value={new Date(props.startTime || props.StartTime)}
                  locale="en-US"
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
                  locale="en-US"
                  className="e-field"
                ></DatePickerComponent>
              </div>
            </div>
          </div>

          {/* MIDDLE ROW */}
          <div className="flex w-full gap-4">
            <div className="flex flex-col w-1/2">
              <div className="e-textlabel">License Plate</div>
              <div style={{ paddingTop: "3px" }}>
                <input
                  id="LicensePlate"
                  className="e-field e-input"
                  type="text"
                  name="LicensePlate"
                  autoComplete="off"
                  defaultValue={props.LicensePlate || ""}
                />
              </div>
            </div>
            <div className="flex flex-col w-1/2">
              <div className="e-textlabel">Vehicle Make</div>
              <div>
                <DropDownListComponent
                  id="VehicleMake"
                  className="e-field"
                  placeholder="Select Vehicle"
                  name="VehicleMake"
                  data-name="VehicleMake"
                  dataSource={cars}
                  defaultValue={props.VehicleMake || ""}
                />
              </div>
            </div>
          </div>

          <div className="flex w-full">
            <div className="w-1/4 flex-col">
              <div className="e-textlabel">Room No.</div>
              <div>
                <input
                  id="RoomNum"
                  className="e-field e-input"
                  type="text"
                  name="RoomNum"
                  defaultValue={props.RoomNum || ""}
                />
              </div>
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div className="flex flex-col w-full">
            <div className="e-textlabel">Additional Notes</div>
            <input
              id="Description"
              className="e-field e-input"
              type="text"
              name="Description"
              defaultValue={props.Description || ""}
            />
          </div>

          {/* SAVE/DELETE BUTTON - Visible only on Mobile */}
          <div id="mbEditorActions" className="actionBtnsMobile">
            <div id="mbDelete" className="delete-button-container">
              <button
                className="delete-button bs-light"
                onClick={() => handleMobileDelete(props)}
              >
                DELETE
              </button>
            </div>
            <div className="delete-button-container">
              <button
                className="delete-button bs-light"
                onClick={() => handleMobileSave(props)}
              >
                SAVE
              </button>
            </div>
          </div>

          {/* FOOTNOTE */}
          {/* <div className="flex flex-col">
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
          </div> */}
        </div>
      </div>
    ) : (
      <div></div>
    );
  };

  const eventSettings = { dataSource: bookings };

  return (
    <div className="mt-4" style={{ overflowY: "scroll", maxHeight: "80vh" }}>
      <SpinnerGif loadingText={"Saving your booking..."} />
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

export default AdminScheduler;
