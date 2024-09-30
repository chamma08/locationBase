import React, { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Html } from "@react-three/drei";
import { ARButton } from "three/examples/jsm/webxr/ARButton";
import LoadingSpinner from "./LoadingSpinner"; // Import the Loading Spinner

function Model({ url }) {
  const { scene } = useGLTF(url);
  return (
    // Ensure the scale is appropriate for mobile devices and place it closer to the origin
    <primitive object={scene} scale={[0.5, 0.5, 0.5]} position={[0, 0, 0]} />
  );
}

const SceneContent = ({ modelUrl }) => {
  const { gl, camera } = useThree();

  useEffect(() => {
    // Create and append AR button for AR mode
    const arButton = ARButton.createButton(gl);
    document.body.appendChild(arButton);

    // Adjust the camera for mobile devices
    camera.position.set(0, 1.5, 4); // Set the camera closer for mobile
    camera.lookAt(0, 1, 0); // Center the camera on the model
    camera.fov = 75; // Widen the field of view for mobile screens
    camera.updateProjectionMatrix(); // Update camera projection matrix

    return () => {
      document.body.removeChild(arButton);
    };
  }, [gl, camera]);

  return (
    <Suspense
      fallback={
        <Html center>
          <LoadingSpinner />
        </Html>
      }
    >
      <ambientLight intensity={0.7} />
      <Model url={modelUrl} />
      <OrbitControls enableZoom={true} enablePan={true} />
      <Environment preset="sunset" />
    </Suspense>
  );
};

const ModelScene = ({ modelUrl }) => {
  return (
    <Canvas>
      <SceneContent modelUrl={modelUrl} />
    </Canvas>
  );
};

export default ModelScene;
