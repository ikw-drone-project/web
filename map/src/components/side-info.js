import { useState, useEffect } from 'react';
import '../css/side-info.css';

export default function SideInFoComponent() {
  const [currentLAT, setCurrentLAT] = useState();
  const [currentLNG, setCurrentLNG] = useState();
  const [targets, setTargets] = useState([]);

  useEffect(() => {
    fetchTargets();
  }, []); // 컴포넌트 마운트 시 데이터 로드

  // 타겟 데이터를 서버로부터 가져오는 함수
  async function fetchTargets() {
    try {
      const response = await fetch('http://localhost:3003/drone-data'); // 데이터를 가져올 서버의 URL
      const data = await response.json();
      const newTargets = data.map((item, index) => ({
        num: index + 1,
        lat: item.Lat,
        lng: item.Lng,
      }));
      setTargets(newTargets);
    } catch (error) {
      console.error('Failed to fetch targets:', error);
    }
  }

  return (
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
          {targets.map((target) => (
            <div className='targetnum' key={target.num}>
              <span>{target.num}번 타겟.</span>
              <span>LAT: {target.lat}.</span>
              <span>LNG: {target.lng}.</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
