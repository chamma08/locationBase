import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';
import { ARButton } from 'three/examples/jsm/webxr/ARButton'; // Import ARButton
import { locations } from './locations'; // Import your locations

// Utility function to get location
const getLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => resolve(position.coords),
        error => reject(error)
      );
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
};

// Utility function to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

const App = () => {
  const [location, setLocation] = useState(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    // Fetch user location
    const fetchLocation = async () => {
      try {
        const coords = await getLocation();
        setLocation(coords);
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };
    fetchLocation();
  }, []);

  useEffect(() => {
    if (location) {
      // Scene setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      // Add VRButton (for VR mode)
      document.body.appendChild(VRButton.createButton(renderer));

      // Add ARButton (for AR mode)
      document.body.appendChild(ARButton.createButton(renderer));

      // Setup AR Session
      renderer.xr.enabled = true;

      // Camera position
      camera.position.set(0, 1.6, 3);

      // Add lights
      const light = new THREE.AmbientLight(0xffffff, 1);
      scene.add(light);

      // Load and add 3D models based on proximity
      const loader = new GLTFLoader();
      locations.forEach(locationData => {
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          locationData.latitude,
          locationData.longitude
        );

        // Check if within 100 meters (adjust as needed)
        if (distance < 100) {
          loader.load(locationData.modelPath, (gltf) => {
            scene.add(gltf.scene);
          }, undefined, (error) => {
            console.error('An error happened while loading the model:', error);
          });
        }
      });

      // Animation loop
      const animate = () => {
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };
      animate();

      // Cleanup on unmount
      return () => {
        document.body.removeChild(renderer.domElement);
        document.body.removeChild(VRButton.createButton(renderer));
        document.body.removeChild(ARButton.createButton(renderer));
      };
    }
  }, [location]);

  return (
    <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '2em' }}>WebXR AR Location-Based App</h1>
      <p style={{ fontSize: '1.2em' }}>
        Current Location: {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'Fetching...'}
      </p>
    </div>
  );
};

export default App;
