import { useState } from 'react'

import '../css/side-info.css'

export default function SideInFoComponent(){

  const [currentLAT, setcurrentLAT] = useState();
  const [currentLNG, setcurrentLNG] = useState();

  return(
    <div className="bg"> 
      <div className='info'>
        <p>1번 비행체</p>
        <p>CURRENT GPS</p>
        <div className='info-grid1'>
          <span>LAT: {currentLAT}</span>
          <span>LNG: {currentLNG}</span>
        </div>
        <p style={{color : 'red'}}>TARGET GPS</p>
        <div className='targetinfo'>
          여기 어카지 🤔
        </div>
      </div>
    </div>
  );
}

