import Map, { Marker } from 'react-map-gl';
import { useEffect, useState } from 'react';
import { get, ref } from 'firebase/database';
import { db } from './firebase';
import { NavLink } from 'react-router-dom';

const Home = (props) => {
    const [points, setPoints] = useState([]);
    const points_list = points.map((item, i) => {
        return(
            <Marker
                className="relarive"
                key={i}
                longitude={item.location.longitude}
                latitude={item.location.latitude}
                anchor="bottom"
            >
                <button onClick={ (e) => {toggleInfo(e, i)} } style={{ color: '#E3B35F' }}>⬤</button>
                <div className={`absolute bottom-0 left-2/4 translate-x-[-50%] translate-y-full bg-100 p-1 rounded-lg
                    border-[1px] border-solid border-300 ${!item.isShow && "opacity-0"}`}>
                    <div className='whitespace-nowrap'>First name: {item.first_name}</div>
                    <div className='whitespace-nowrap'>Last name: {item.last_name}</div>
                    <div className='whitespace-nowrap'>Country: {item.country}</div>
                    <div className='whitespace-nowrap'>City: {item.city}</div>
                    <div className='whitespace-nowrap'>Last update: {item.last_update}</div>
                    <button className="uppercase block whitespace-nowrap">CHECK THE DATA</button>
                    <NavLink to={"/profile/" + item.id} className="uppercase block whitespace-nowrap">go to profile</NavLink>
                </div>
            </Marker>
        )
    });

    const toggleInfo = (e, i) => {
        e.preventDefault();
        console.log(e.clientY);

        setPoints([
            ...points.map((point, j) => {
                if(j === i){
                    return {
                        ...point,
                        isShow: !point.isShow
                    }
                }

                return {
                    ...point,
                    isShow: false
                }
            })
        ]);
    };

    const onClick = (e) => {
        if(e.target.classList.contains("mapboxgl-canvas")){
            setPoints([
                ...points.map((point, j) => {
                    return {
                        ...point,
                        isShow: false
                    }
                })
            ]);
        }
    }

    const fetchData = async () => {
        const dbRef = ref(db, 'celebreties');
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
            setPoints(Object.values(snapshot.val()).map(data => {
                return{
                    ...data,
                    isShow: false
                }
            }));
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return(
        <div style={{width: "100vw", height: "100vh"}} onClick={onClick}>
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