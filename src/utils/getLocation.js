// src/utils/getLocation.js
export const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => resolve(position),
          error => reject(error)
        );
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  };
  