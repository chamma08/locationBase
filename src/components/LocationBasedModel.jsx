// src/components/LocationBasedModel.jsx
import React, { useState, useEffect } from 'react';
import ModelScene from './ModelScene';

const TARGET_LOCATION = { lat: 7.4084, lng: 80.6103
 }; 
const RADIUS = 100; 

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

  useEffect(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    const success = (position) => {
      const { latitude, longitude } = position.coords;
      const distance = getDistanceFromLatLonInMeters(
        latitude,
        longitude,
        TARGET_LOCATION.lat,
        TARGET_LOCATION.lng
      );
      if (distance <= RADIUS) {
        setIsInTargetLocation(true);
      } else {
        setIsInTargetLocation(false);
      }
    };

    const error = () => {
      alert('Unable to retrieve your location.');
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

  return isInTargetLocation ? (
    <ModelScene modelUrl={modelUrl} />
  ) : (
    <p>You are not in the correct location.</p>
  );
};

export default LocationBasedModel;
