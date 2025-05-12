import React, { Suspense, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { 
  OrbitControls, 
  Environment, 
  useGLTF, 
  Html, 
  Stars,
  PerspectiveCamera
} from "@react-three/drei";
import { ARButton } from "three/examples/jsm/webxr/ARButton";
import LoadingSpinner from "./LoadingSpinner";
import "../styles/ModelScene.css";

function Model({ url }) {
  const { scene } = useGLTF(url);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => prev + 0.002);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <primitive 
      object={scene} 
      scale={[0.5, 0.5, 0.5]} 
      position={[0, -0.5, 0]} 
      rotation={[0, rotation, 0]}
    />
  );
}

const SceneContent = ({ modelUrl }) => {
  const { gl, camera } = useThree();
  const [isARSupported, setIsARSupported] = useState(true);

  useEffect(() => {
    try {
      // Create and append AR button for AR mode with custom styling
      const arButton = ARButton.createButton(gl, {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay'],
      });
      
      // Add custom class
      arButton.className = "ar-button";
      
      // Check if AR is supported
      if (arButton.textContent.includes("not supported") || 
          !navigator.xr || 
          !gl.xr) {
        setIsARSupported(false);
      }

      document.body.appendChild(arButton);

      // Adjust the camera for better viewing
      camera.position.set(0, 1, 4);
      camera.lookAt(0, 0, 0);
      camera.fov = 75;
      camera.updateProjectionMatrix();

      return () => {
        document.body.removeChild(arButton);
      };
    } catch (error) {
      console.error("Error setting up AR:", error);
      setIsARSupported(false);
    }
  }, [gl, camera]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.5, 4]} fov={75} />
      <Suspense
        fallback={
          <Html center>
            <LoadingSpinner />
          </Html>
        }
      >
        <ambientLight intensity={0.7} />
        <spotLight 
          position={[5, 10, 5]} 
          angle={0.3} 
          penumbra={0.8} 
          intensity={1} 
          castShadow 
        />
        <Model url={modelUrl} />
        <Stars radius={100} depth={50} count={1000} factor={4} />
        <OrbitControls 
          enableZoom={true} 
          enablePan={true} 
          minDistance={2}
          maxDistance={10}
        />
        <Environment preset="sunset" />
      </Suspense>
      
      {!isARSupported && (
        <Html position={[0, -2, 0]} center>
          <div className="ar-not-supported">
            AR not supported on this device
          </div>
        </Html>
      )}
    </>
  );
};

const ModelScene = ({ modelUrl }) => {
  return (
    <div className="model-scene-container">
      <Canvas shadows>
        <SceneContent modelUrl={modelUrl} />
      </Canvas>
      <div className="model-controls-hint">
        <p>Pinch to zoom • Drag to rotate • Press AR button for augmented reality</p>
      </div>
    </div>
  );
};

export default ModelScene;