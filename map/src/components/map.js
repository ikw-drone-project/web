// map.js
import React, { useState, useEffect } from 'react';
import { Map, MapMarker, MapInfoWindow, MapTypeId } from "react-kakao-maps-sdk";
import useKakaoLoader from "./useKakaoLoader";
import '../css/map.css';

export default function MapComponent({ selectedMarker, setSelectedMarker }) {
  useKakaoLoader();

  const [center, setCenter] = useState({ lat: 36.167723, lng: 128.467684 });
  const [markers, setMarkers] = useState([]);
  const [infoWindowIndex, setInfoWindowIndex] = useState(null);
  let previousData = []; // 이전 데이터를 저장하는 배열

  useEffect(() => {
    const fetchDroneData = async () => {
      try {
        const response = await fetch('http://localhost:3003/drone-data');
        const data = await response.json();
        // 새로운 타겟이 추가된 경우에만 상태 업데이트
        if (JSON.stringify(previousData) !== JSON.stringify(data)) {
          const newMarkers = data.map((item, index) => ({
            lat: item.latitude,
            lng: item.longitude,
            name: `${index + 1}번째 타겟`
          }));
          setMarkers(newMarkers); // 마커 상태를 업데이트
          if (data.length > 0) {
            setCenter({ lat: data[0].latitude, lng: data[0].longitude });
          }

          // 마커를 업데이트 한 후 새로운 타겟에 대한 알림 처리
          // 새로 추가된 타겟에 대한 알림 처리
        if (previousData.length < data.length) {
          const newTargets = data.slice(previousData.length);
          setTimeout(() => {
            newTargets.forEach((item, index) => {
              // 이 부분을 수정하여 정확한 인덱스를 계산하고 올바른 타겟 이름을 알림
              const targetIndex = previousData.length + index; // 새 타겟의 인덱스 계산
              alert(`${targetIndex}번째 타겟이 발견되었습니다`);
            });
          }, 100);
        }


          previousData = data; // 현재 데이터를 이전 데이터로 저장
        }
      } catch (error) {
        console.error("Failed to fetch drone data:", error);
      }
    };

    // 데이터 변경 확인을 위해 주기적으로 서버 데이터 확인
    const intervalId = setInterval(fetchDroneData, 1000); // 2초마다 확인

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 해제
  }, []);

  useEffect(() => {
    if (selectedMarker) {
      setCenter({ lat: selectedMarker.lat, lng: selectedMarker.lng });
      const markerIndex = markers.findIndex(marker => marker.lat === selectedMarker.lat && marker.lng === selectedMarker.lng);
      if (markerIndex !== -1) {
        setInfoWindowIndex(markerIndex);
      }
    }
  }, [selectedMarker, markers]);

  return (
    <Map
        id="map"
        className="kakaomap"
        center={center}
        style={{ width: "100%", height: "100vh" }}
        level={2}
      >
        <MapTypeId type={"SKYVIEW"} />
        {markers.map((marker, index) => (
          <React.Fragment key={`marker-${index}`}>
            <MapMarker
              position={{ lat: marker.lat, lng: marker.lng }}
              title={marker.name}
              clickable={true}
              onClick={() => {
                setCenter({ lat: marker.lat, lng: marker.lng });
                setInfoWindowIndex(index);
                setSelectedMarker(marker);
              }}
            />
            {infoWindowIndex === index && (
              <MapInfoWindow
                position={{ lat: marker.lat, lng: marker.lng }}
                removable={true}
                onCloseClick={() => setInfoWindowIndex(null)}
              >
                {marker.name}
              </MapInfoWindow>
            )}
          </React.Fragment>
        ))}
    </Map>
  );
}
