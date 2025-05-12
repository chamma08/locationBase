// src/components/LocationBasedModel.jsx
import React, { useState, useEffect } from "react";
import ModelScene from "./ModelScene";
import "../styles/LoadingSpinner.css";
import "../styles/LocationBasedModel.css";

const TARGET_LOCATION = { lat: 6.9638756, lng: 80.1299861 };
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
  const [distance, setDistance] = useState(null);
  const [locationStatus, setLocationStatus] = useState("checking");
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("unsupported");
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
      
      setDistance(distanceFromTarget);
      setLocationStatus("success");
      
      if (distanceFromTarget <= RADIUS) {
        setIsInTargetLocation(true);
      } else {
        setIsInTargetLocation(false);
      }
    };

    const error = (err) => {
      if (err.code === 1) setLocationStatus("denied");
      else if (err.code === 2) setLocationStatus("unavailable");
      else if (err.code === 3) setLocationStatus("timeout");
      else setLocationStatus("error");
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

  // Calculate progress percentage for UI (max 100% when you're at the location)
  const proximityPercentage = distance !== null 
    ? Math.min(100, Math.max(0, 100 - (distance / (RADIUS * 2) * 100)))
    : 0;

  const toggleDebugInfo = () => {
    setShowDebugInfo(!showDebugInfo);
  };

  // Render different UI based on location status
  const renderLocationUI = () => {
    switch (locationStatus) {
      case "checking":
        return <div className="location-message checking">Detecting your location...</div>;
      
      case "denied":
        return (
          <div className="location-message error">
            <p>Location access denied.</p>
            <p className="hint">Please enable location services to experience the 3D model.</p>
          </div>
        );
      
      case "unavailable":
      case "timeout":
      case "error":
        return (
          <div className="location-message error">
            <p>Unable to determine your location.</p>
            <p className="hint">Please check your device settings and try again.</p>
          </div>
        );
      
      case "unsupported":
        return (
          <div className="location-message error">
            <p>Your browser doesn't support geolocation.</p>
            <p className="hint">Please try a different browser.</p>
          </div>
        );
      
      case "success":
        if (isInTargetLocation) {
          return <ModelScene modelUrl={modelUrl} />;
        } else {
          return (
            <div className="location-message">
              <div className="distance-display">
                <div className="distance-value">{Math.round(distance)}</div>
                <div className="distance-unit">meters away</div>
              </div>
              
              <div className="proximity-bar-container">
                <div 
                  className="proximity-bar-progress" 
                  style={{ width: `${proximityPercentage}%` }}
                ></div>
              </div>
              
              <p className="hint">Move closer to view the 3D model</p>
              
              <button className="debug-toggle" onClick={toggleDebugInfo}>
                {showDebugInfo ? "Hide Debug Info" : "Show Debug Info"}
              </button>
              
              {showDebugInfo && (
                <div className="debug-info">
                  <p>Target: {TARGET_LOCATION.lat}, {TARGET_LOCATION.lng}</p>
                  <p>Radius: {RADIUS}m</p>
                  <p>Distance: {distance ? distance.toFixed(2) : "unknown"}m</p>
                </div>
              )}
            </div>
          );
        }
      
      default:
        return <div className="location-message">Something went wrong</div>;
    }
  };

  return (
    <div className="location-container">
      {renderLocationUI()}
    </div>
  );
};

export default LocationBasedModel;