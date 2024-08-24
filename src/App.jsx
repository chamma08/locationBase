import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LocationProvider from './components/LocationProvider';
import ThreeDScene from './components/ThreeDScene';

function App() {
  return (
    <div style={{ height: '100vh' }}>
      <LocationProvider>
        <Canvas>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <ThreeDScene />
          <OrbitControls />
        </Canvas>
      </LocationProvider>
      <ToastContainer />
    </div>
  );
}

export default App;
