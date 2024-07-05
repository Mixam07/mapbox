import Map, { Marker } from 'react-map-gl';
import { useEffect, useState } from 'react';
import { get, ref } from 'firebase/database';
import { db } from './firebase';
import { NavLink } from 'react-router-dom';
import Filter from './Filter';

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
                <button onClick={ (e) => {toggleInfo(e, i)} } className="relative w-4 h-4 block bg-300 rounded-full before:content-['']
                    before:absolute before:block before:top-2/4 before:left-2/4 before:w-[150%] before:h-[150%] before:bg-300/10
                    before:z-[-1] before:translate-x-[-50%] before:translate-y-[-50%] before:rounded-full before:shadow-2xl"></button>
                <div className={`absolute bottom-2/4 right-[-0.5rem] translate-y-full translate-x-full bg-300/20 py-2 px-4 rounded-r-2xl rounded-b-2xl
                    border-[1px] border-solid border-white ${!item.isShow && "opacity-0"}`}>
                    <div className='whitespace-nowrap text-lg mb-2'>First name: {item.first_name}</div>
                    <div className='whitespace-nowrap text-lg mb-2'>Last name: {item.last_name}</div>
                    <div className='whitespace-nowrap text-lg mb-2'>Country: {item.country}</div>
                    <div className='whitespace-nowrap text-lg mb-2'>City: {item.city}</div>
                    <div className='whitespace-nowrap text-lg mb-2'>Last update: {item.last_update}</div>
                    <div className='whitespace-nowrap text-lg mb-3'>Accuracy: 60%</div>
                    <NavLink to={"/profile/" + item.id} className="uppercase whitespace-nowrap text-300 text-lg relative
                        before:content-[''] before:block before:absolute before:bottom-0 before:left-0 before:w-full before:h-[1px] before:bg-300">
                        Check details
                    </NavLink>
                </div>
            </Marker>
        )
    });

    const toggleInfo = (e, i) => {
        e.preventDefault();
        console.log(i);

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

        return () => {
            props.setIsMapActive(true);
        }
    }, []);

    return(
        <div className="h-[calc(100vh-5.75rem)] w-[100vw] relative" onClick={onClick}>
            <Filter setPoints={setPoints} />
            <Map
                mapboxAccessToken={process.env.REACT_APP_MAPBOX_API_KEY}
                className="h-full w-full"
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