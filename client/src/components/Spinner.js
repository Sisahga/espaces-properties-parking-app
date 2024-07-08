import React from "react";
import SpinnerGif from "../assets/spinner.svg";

const Spinner = ({ loadingText }) => {
  return (
    <div id="spinnerComponent" className="rounded">
      <p>{loadingText}</p>
      <img
        src={SpinnerGif}
        alt="Loading..."
        className="spinner-image"
        style={{ width: "64px", height: "64px" }}
      />
    </div>
  );
};

export default Spinner;
