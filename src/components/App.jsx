import Map from 'react-map-gl';

const token = "pk.eyJ1Ijoic3BoaW5jdGVyIiwiYSI6ImNseHdhNDhnYTBudzYycnF6OWlkdnllcHcifQ.95ouJZjAGy2wsXqQMOwHZg";

const App = () => {
  return (
    <div style={{width: "100vw", height: "100vh"}}>
      <Map
        mapboxAccessToken={token}
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 14
        }}
        style={{width: "100%", height: "100%"}}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      />
    </div>
  );
}

export default App;
