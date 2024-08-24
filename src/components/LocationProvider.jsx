import React, { useState, useEffect } from 'react';
import ThreeDScene from './ThreeDScene'; // Ensure this is the correct path

const LocationProvider = () => {
  const [isAtLocation, setIsAtLocation] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        const targetLocation = { lat: 37.7749, lon: -122.4194 }; // Example coordinates

        const distance = getDistance(
          { latitude, longitude },
          targetLocation
        );

        if (distance < 50) { // Distance in meters
          setIsAtLocation(true);
        }
      }, error => {
        console.error('Error getting location:', error);
      });
    }
  }, []);

  const getDistance = (coords1, coords2) => {
    const R = 6371e3; // Radius of the Earth in meters
    const φ1 = (coords1.latitude * Math.PI) / 180;
    const φ2 = (coords2.lat * Math.PI) / 180;
    const Δφ = ((coords2.lat - coords1.latitude) * Math.PI) / 180;
    const Δλ = ((coords2.lon - coords1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  return isAtLocation ? <ThreeDScene /> : <div>Move closer to the location to view the 3D model.</div>;
};

export default LocationProvider;
