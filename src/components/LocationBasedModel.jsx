// src/components/LocationBasedModel.jsx
import React, { useState, useEffect } from "react";
import ModelScene from "./ModelScene";

const TARGET_LOCATION = { lat: 6.9638756, lng: 80.1299861};
const RADIUS = 100; // Radius in meters

// Function to calculate the distance between two geographical points
const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Radius of the Earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const LocationBasedModel = ({ modelUrl }) => {
  const [isInTargetLocation, setIsInTargetLocation] = useState(false);
  const [distance, setDistance] = useState(null); // State to store distance

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    const success = (position) => {
      const { latitude, longitude } = position.coords;
      const distanceFromTarget = getDistanceFromLatLonInMeters(
        latitude,
        longitude,
        TARGET_LOCATION.lat,
        TARGET_LOCATION.lng
      );
      setDistance(distanceFromTarget); // Set distance state
      if (distanceFromTarget <= RADIUS) {
        setIsInTargetLocation(true);
      } else {
        setIsInTargetLocation(false);
      }
    };

    const error = (err) => {
      let errorMessage = "Unable to retrieve your location.";
      if (err.code === 1) errorMessage = "Permission denied.";
      if (err.code === 2) errorMessage = "Position unavailable.";
      if (err.code === 3) errorMessage = "Timeout reached.";
      alert(errorMessage);
    };

    const watcher = navigator.geolocation.watchPosition(success, error, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    });

    return () => {
      navigator.geolocation.clearWatch(watcher);
    };
  }, []);

  return (
    <>
      {isInTargetLocation ? (
        <ModelScene modelUrl={modelUrl} />
      ) : (
        <p>
          {distance !== null
            ? `You are ${Math.round(distance)} meters away from the target location.`
            : "Checking your location..."}
        </p>
      )}
    </>
  );
};

export default LocationBasedModel;
