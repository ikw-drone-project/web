import MapComponent from './components/map'
import SideInFoComponent from './components/side-info'

import './App.css';

function App() {
  return (
    <div className="App">
      <div className='grid'>
        <MapComponent></MapComponent>
        <SideInFoComponent></SideInFoComponent>
      </div>
    </div>
  );
}

export default App;
