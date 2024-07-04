import React, { useRef } from "react";
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

  function formatDate(dateStr) {
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
    const formattedDate = `${month} ${day}, ${year}`;

    return formattedDate;
  }

  function validateFields(data) {
    if (
      data.StartTime === "" ||
      data.EndTime === "" ||
      data.LicensePlate === "" ||
      data.VehicleMake === ""
    ) {
      return false;
    }
    return true;
  }

  // === EVENT RENDERED EVENT ===
  const onEventRendered = (args) => {};

  // === CELL CLICK EVENT ===
  const onCellClick = (args) => {
    scheduleObj.current.openEditor(args, "Add");
  };

  // === ACTION BEGIN EVENT ===
  const onActionBegin = async (args) => {
    if (args.requestType === "eventCreate") {
      const data = args.data[0];
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
        startTime: data.StartTime,
        endTime: data.EndTime,
        isAllDay: data.IsAllDay,
        description: data.Description,
        licensePlate: data.LicensePlate,
        vehicleMake: data.VehicleMake,
      };
      console.log("New Booking: ", newBooking);

      const daysBooked = daysBetween(newBooking.startTime, newBooking.endTime);
      console.log("Days Booked: ", daysBooked);

      const formattedStartDate = formatDate(newBooking.startTime);
      const formattedEndDate = formatDate(newBooking.endTime);
      console.log("Formatted Start Date: ", formattedStartDate);
      console.log("Formatted End Date: ", formattedEndDate);

      const stripeResponse = await fetch(
        "http://localhost:8080/api/parking/payment/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: daysBooked,
            description: formattedStartDate + " - " + formattedEndDate,
          }),
        }
      );

      if (!stripeResponse.ok) {
        const error = await stripeResponse.json();
        console.error("Error:", error.error);
      } else {
        const { url } = await stripeResponse.json();
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
              <div className="e-textlabel">License Plate *</div>
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
              <div className="e-textlabel">Vehicle Make *</div>
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

  return (
    <div className="mt-4" style={{ overflowY: "scroll", maxHeight: "80vh" }}>
      <ScheduleComponent
        className="rounded"
        style={{ overflowY: "scroll", maxHeight: "100%" }}
        ref={scheduleObj}
        showQuickInfo={false}
        editorTemplate={editorTemplate}
        currentView="Month"
        cellClick={onCellClick}
        eventRendered={onEventRendered}
        actionBegin={onActionBegin}
      >
        <ViewsDirective>
          <ViewDirective option="Week" />
          <ViewDirective option="Month" />
        </ViewsDirective>
        <Inject services={[Week, Month]} />
      </ScheduleComponent>
    </div>
  );
};

export default ClientScheduler;
