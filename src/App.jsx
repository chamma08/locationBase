// src/App.jsx
import React from 'react';
import LocationBasedModel from './components/LocationBasedModel';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Location Based Augmented Reality</h1>
        <p className="app-subtitle">AR Experience</p>
      </header>
      <main className="app-content">
        <LocationBasedModel modelUrl="/models/model2.gltf" />
      </main>
      <footer className="app-footer">
        <p>Move closer to the landmark to view in 3D/AR</p>
      </footer>
    </div>
  );
}

export default App;