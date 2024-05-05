import { useState, useEffect } from 'react';
import '../css/side-info.css';

// setSelectedMarker를 props로 받습니다.
export default function SideInFoComponent({ setSelectedMarker }) {
  const [currentLAT, setCurrentLAT] = useState();
  const [currentLNG, setCurrentLNG] = useState();
  const [targets, setTargets] = useState([]);
  let previousTargets = []; // 이전 타겟 데이터를 저장

  useEffect(() => {
    const fetchTargets = async () => {
      try {
        const response = await fetch('http://localhost:3003/drone-data');
        const data = await response.json();
        // 새로운 타겟이 추가된 경우에만 상태 업데이트
        if (JSON.stringify(previousTargets) !== JSON.stringify(data)) {
          const newTargets = data.map((item, index) => ({
            num: index + 1,
            lat: item.Lat,
            lng: item.Lng,
          }));
          setTargets(newTargets);
          previousTargets = data; // 현재 데이터를 이전 데이터로 저장
        }
      } catch (error) {
        console.error('Failed to fetch targets:', error);
      }
    };

    fetchTargets();
    const intervalId = setInterval(fetchTargets, 1000); // 2초마다 데이터 갱신

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 해제
  }, []);

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
            <div className='targetnum' key={target.num} onClick={() => setSelectedMarker(target)}>
              <span className='cursor'>{target.num}번 타겟</span>
              <span>LAT: {target.lat}</span>
              <span>LNG: {target.lng}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
