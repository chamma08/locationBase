import React, { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Html } from "@react-three/drei";
import { ARButton } from "three/examples/jsm/webxr/ARButton";
import LoadingSpinner from "./LoadingSpinner"; // Import the Loading Spinner

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={[0.3, 0.3, 0.3]} position={[0, 0, 0]} />; // Adjust the position here
}

const SceneContent = ({ modelUrl }) => {
  const { gl, camera } = useThree();

  useEffect(() => {
    // Create and append AR button for AR mode
    const arButton = ARButton.createButton(gl);
    document.body.appendChild(arButton);

    // Adjust the camera position and direction to view the model
    camera.position.set(0, 2, 5); // Position the camera higher and closer to the model
    camera.lookAt(0, 0, 0); // Look directly at the model's position

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
      <ambientLight intensity={0.5} />
      <Model url={modelUrl} />
      <OrbitControls enableZoom={true} enablePan={true} /> {/* Enable panning for flexibility */}
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
