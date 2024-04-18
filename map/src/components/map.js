import React, { useState, useEffect } from 'react';
import { Map, MapMarker, MapInfoWindow, MapTypeId } from "react-kakao-maps-sdk"; // MapInfoWindow 추가
import useKakaoLoader from "./useKakaoLoader";
import '../css/map.css';

export default function MapComponent() {
  useKakaoLoader();

  const [center, setCenter] = useState({ lat: 36.167723, lng: 128.467684 });
  const [markers, setMarkers] = useState([]);
  const [infoWindowIndex, setInfoWindowIndex] = useState(null); // 클릭된 마커의 인덱스

  useEffect(() => {
    async function fetchDroneData() {
      try {
        const response = await fetch('http://localhost:3003/drone-data');
        const data = await response.json();
        // 데이터를 상태로 설정하는 로직
        const newMarkers = data.map((item, index) => ({
          lat: item.Lat,
          lng: item.Lng,
          name: `${index + 1}번째 타겟`
        }));
        setMarkers(newMarkers);
        // 데이터가 있다면, 첫 번째 데이터를 중심으로 지도를 설정합니다.
        if (data.length > 0) {
          setCenter({ lat: data[0].Lat, lng: data[0].Lng });
        }
      } catch (error) {
        console.error("Failed to fetch drone data:", error);
      }
    }
    fetchDroneData();
  }, []);

  return (
    <Map
      id="map"
      className="kakaomap"
      center={center}
      style={{ width: "100%", height: "100vh" }}
      level={2}
    >
      <MapTypeId type={"TERRAIN"} />
      {markers.map((marker, index) => (
        <React.Fragment key={`marker-${index}`}>
          <MapMarker
            position={{ lat: marker.lat, lng: marker.lng }}
            title={marker.name} // 마커 제목 설정
            clickable={true} // 마커를 클릭할 수 있도록 설정
            onClick={() => {
              setCenter({ lat: marker.lat, lng: marker.lng }); // 지도의 중심을 마커의 위치로 이동
              setInfoWindowIndex(index); // 클릭된 마커의 인덱스를 설정하여 정보 창을 엶
            }}
          />
          {infoWindowIndex === index && (
            <MapInfoWindow
              position={{ lat: marker.lat, lng: marker.lng }}
              removable={true}
              onCloseClick={() => setInfoWindowIndex(null)} // 인포윈도우 닫기
            >
              {marker.name}
            </MapInfoWindow>
          )}
        </React.Fragment>
      ))}
    </Map>
  );
}