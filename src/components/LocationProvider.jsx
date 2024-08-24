import React, { useEffect, useState } from 'react';
import { useGeolocated } from 'react-geolocated';
import { toast } from 'react-toastify';

const predefinedLocation = { latitude:  7.408441, longitude: 80.610129 }; // Example: New York City

const LocationProvider = ({ children }) => {
  const [isInLocation, setIsInLocation] = useState(false);
  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({ 
    positionOptions: { enableHighAccuracy: true },
    userDecisionTimeout: 5000,
  });

  useEffect(() => {
    if (coords) {
      const distance = calculateDistance(coords.latitude, coords.longitude, predefinedLocation.latitude, predefinedLocation.longitude);
      if (distance < 1000) { // within 1km radius
        setIsInLocation(true);
        toast.success('You are within the target location!');
      } else {
        setIsInLocation(false);
        toast.error('You are not in the target location.');
      }
    }
  }, [coords]);

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // meters
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // in meters
    return d;
  }

  if (!isGeolocationAvailable) {
    return <div>Your browser does not support Geolocation</div>;
  }

  if (!isGeolocationEnabled) {
    return <div>Geolocation is not enabled</div>;
  }

  return (
    <div>
      {coords ? (
        <>
          <div>
            <p>Your current location:</p>
            <p>Latitude: {coords.latitude}</p>
            <p>Longitude: {coords.longitude}</p>
          </div>
          {isInLocation ? children : <p>You are not within the target location.</p>}
        </>
      ) : (
        <div>Getting location data...</div>
      )}
    </div>
  );
};

export default LocationProvider;
