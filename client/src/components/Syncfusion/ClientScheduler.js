import React, { useRef } from "react";
import {
  ScheduleComponent,
  Week,
  Month,
  Inject,
  ViewDirective,
  ViewsDirective,
} from "@syncfusion/ej2-react-schedule";
import { L10n } from "@syncfusion/ej2-base";

// Define a custom locale
L10n.load({
  "en-US": {
    schedule: {
      saveButton: "Pay Now",
      cancelButton: "Cancel",
      deleteButton: "Delete",
      newEvent: "New Booking",
    },
  },
});

const ClientScheduler = () => {
  const scheduleObj = useRef(null);

  // === CELL CLICK EVENT ===
  const onCellClick = (args) => {
    scheduleObj.current.openEditor(args, "Add");
  };

  return (
    <div className="mt-4" style={{ overflowY: "scroll", maxHeight: "80vh" }}>
      <ScheduleComponent
        className="rounded"
        style={{ overflowY: "scroll", maxHeight: "100%" }}
        ref={scheduleObj}
        showQuickInfo={false}
        currentView="Month"
        cellClick={onCellClick}
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
