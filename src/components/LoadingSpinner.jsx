import React from "react";
import "../styles/LoadingSpinner.css";


const LoadingSpinner = () => {
  const spinnerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: "2rem",
    color: "#555",
  };

  return (
    <div style={spinnerStyle}>
      <div className="spinner" />
      Loading Model...
    </div>
  );
};

export default LoadingSpinner;