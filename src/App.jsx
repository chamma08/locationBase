// src/App.jsx
import React from 'react';
import LocationBasedModel from './components/LocationBasedModel';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Location Based App</h1>
      <LocationBasedModel modelUrl="/models/model2.gltf" />
    </div>
  );
}

export default App;
