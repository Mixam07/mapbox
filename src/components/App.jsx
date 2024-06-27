import { useEffect, useRef } from 'react';
import Map, { Marker } from 'react-map-gl';

const token = "pk.eyJ1Ijoic3BoaW5jdGVyIiwiYSI6ImNseHdhNDhnYTBudzYycnF6OWlkdnllcHcifQ.95ouJZjAGy2wsXqQMOwHZg";

const App = () => {
  const markers = [
    { longitude: 30.5234, latitude: 50.4501, description: 'Київ' },
    { longitude: 24.0297, latitude: 49.8397, description: 'Львів' },
    { longitude: 34.1048, latitude: 44.9521, description: 'Сімферополь' },
    // Додайте більше точок, якщо потрібно
  ];

  return (
    <div style={{width: "100vw", height: "100vh"}}>
      <Map
        mapboxAccessToken={token}
        style={{width: "100%", height: "100%"}}
        mapStyle="mapbox://styles/mapbox/dark-v10"
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            longitude={marker.longitude}
            latitude={marker.latitude}
            anchor="bottom"
          >
            <div style={{ color: 'red' }}>⬤</div>
            {/* Ви можете використати іконку або кастомний компонент тут */}
          </Marker>
        ))}
      </Map>
    </div>
  );
}

export default App;
