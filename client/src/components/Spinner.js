import React from "react";
import SpinnerGif from "../assets/spinner.svg";

const Spinner = () => {
  return (
    <div className="overlay">
      <img src={SpinnerGif} alt="Loading..." className="spinner-image" />
    </div>
  );
};

export default Spinner;
