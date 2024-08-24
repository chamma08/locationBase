import React from 'react';

const ThreeDScene = () => {
  return (
    <a-scene embedded arjs>
      <a-marker preset="hiro">
        <a-entity gltf-model="/models/model2.gltf" scale="0.5 0.5 0.5"></a-entity>
      </a-marker>
      <a-entity camera></a-entity>
    </a-scene>
  );
};

export default ThreeDScene;
