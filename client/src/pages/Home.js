import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const authenticated = localStorage.getItem("authenticated");
  console.log("Authenticated: ", authenticated);

  useEffect(() => {
    if (authenticated !== "true") {
      navigate("/signup");
    }
  }, [authenticated, navigate]);

  return <div className="">HomePage</div>;
};

export default Home;
