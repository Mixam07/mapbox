import Map, { Marker } from 'react-map-gl';
import points from "../points.json";

const token = "pk.eyJ1Ijoic3BoaW5jdGVyIiwiYSI6ImNseHdhNDhnYTBudzYycnF6OWlkdnllcHcifQ.95ouJZjAGy2wsXqQMOwHZg";

const Home = () => {
    return(
        <div style={{width: "100vw", height: "100vh"}}>
            <Map
                mapboxAccessToken={token}
                style={{width: "100%", height: "100%"}}
                mapStyle="mapbox://styles/sphincter/clxx0dkc400y601pfgzvcf0xh"
                projection="mercator"
                dragRotate={false}
            >
            {points.map((marker, index) => (
                <Marker
                    key={index}
                    longitude={marker.longitude}
                    latitude={marker.latitude}
                    anchor="bottom"
                    maxZoom={10}
                >
                <div style={{ color: '#E3B35F' }}>⬤</div>
                </Marker>
            ))}
            </Map>
        </div>
    )
}

export default Home;