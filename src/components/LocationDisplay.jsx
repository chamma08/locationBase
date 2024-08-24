import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ThreeDModel from './ThreeDModel';

const TARGET_LOCATION = { latitude: 7.408441, longitude: 80.610129 }; 

const LocationDisplay = () => {
  const [location, setLocation] = useState(null);
  const [isAtTargetLocation, setIsAtTargetLocation] = useState(false);

  useEffect(() => {
    const success = (position) => {
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });

      const distance = Math.sqrt(
        Math.pow(latitude - TARGET_LOCATION.latitude, 2) +
        Math.pow(longitude - TARGET_LOCATION.longitude, 2)
      );

      if (distance < 0.01) { // Adjust distance threshold as needed
        setIsAtTargetLocation(true);
        toast.success('You are at the target location!');
      } else {
        setIsAtTargetLocation(false);
      }
    };

    const error = () => {
      toast.error('Failed to retrieve location.');
    };

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(success, error);
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  }, []);

  return (
    <div>
      <h1>User Location</h1>
      {location ? (
        <p>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </p>
      ) : (
        <p>Loading location...</p>
      )}
      {isAtTargetLocation && <ThreeDModel />}
    </div>
  );
};

export default LocationDisplay;
