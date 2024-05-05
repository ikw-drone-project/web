// App.js
import React, { useState } from 'react';
import MapComponent from './components/map';
import SideInFoComponent from './components/side-info';

import './App.css';

function App() {
  const [selectedMarker, setSelectedMarker] = useState(null);

  return (
    <div className="App">
      <div className='grid'>
        <MapComponent selectedMarker={selectedMarker} setSelectedMarker={setSelectedMarker}></MapComponent>
        <SideInFoComponent setSelectedMarker={setSelectedMarker}></SideInFoComponent>
      </div>
    </div>
  );
}

export default App;
