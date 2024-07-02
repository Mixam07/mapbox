import Map, { Marker } from 'react-map-gl';
import { useEffect, useState } from 'react';
import { get, ref } from 'firebase/database';
import { db } from './firebase';

const Home = () => {
    const [points, setPoints] = useState([]);
    const points_list = points.map((item, i) => {
        return(
            <Marker
                key={i}
                longitude={item.location.longitude}
                latitude={item.location.latitude}
                anchor="bottom"
            >
            <div style={{ color: '#E3B35F' }}>⬤</div>
            </Marker>
        )
    });

    const fetchData = async () => {
        const dbRef = ref(db, 'celebreties');
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
            setPoints(Object.values(snapshot.val()));
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return(
        <div style={{width: "100vw", height: "100vh"}}>
            <Map
                mapboxAccessToken={process.env.REACT_APP_MAPBOX_API_KEY}
                style={{width: "100%", height: "100%"}}
                mapStyle="mapbox://styles/mapbox/light-v11"
                projection="mercator"
                dragRotate={false}
            >
                {points_list}
            </Map>
        </div>
    )
}

export default Home;