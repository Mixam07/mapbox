import { NavLink } from "react-router-dom";
import Map, { Source, Layer, Marker } from 'react-map-gl';
import location_violet from "../../../assets/icons/location_violet.svg";
import location_orange from "../../../assets/icons/location_orange.svg";
import hiden from "../../../assets/icons/hiden.svg";
import { auth, db } from "../../../firebase/initialization";
import { onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
import { get, ref } from "firebase/database";

const MapComponent = (props) => {
    const [user, setUser] = useState(null);
    const [activePoint, setActivePoint] = useState(-1);
    const addresses = [];

    for(let i = 0;i < props.celebrety?.addresses?.length;i++){
        const item = props.celebrety.addresses[i];

        if(user?.isPremium){
            addresses.push(item);
        }else  if(i === props.celebrety.addresses.length - 1){
            addresses.push(item);
        }
    }

    onAuthStateChanged(auth, async (user) => {
        const dbRef = ref(db, 'users');
        const snapshot = await get(dbRef);

        if(snapshot.exists()){
            const data = Object.values(snapshot.val());

            for(const key in data){
                const item = data[key];

                if(item?.email === user?.email){
                    setUser(item)
                }
            }
        }
    });

    const coordinates = addresses?.map(item => [item.location.longitude, item.location.latitude]);
    
    const center = {
        latitude: coordinates?.reduce((total, coord) => total + coord[1], 0) / coordinates?.length,
        longitude: coordinates?.reduce((total, coord) => total + coord[0], 0) / coordinates?.length,
    };

    const bounds = coordinates?.reduce(
        (bounds, coord) => {
        return {
            minLat: Math.min(bounds?.minLat, coord[1]),
            maxLat: Math.max(bounds?.maxLat, coord[1]),
            minLng: Math.min(bounds?.minLng, coord[0]),
            maxLng: Math.max(bounds?.maxLng, coord[0]),
        };
        },
        {
            minLat: Number.MAX_VALUE,
            maxLat: Number.MIN_VALUE,
            minLng: Number.MAX_VALUE,
            maxLng: Number.MIN_VALUE,
        }
    );

    const width = window.innerWidth;
    const height = window.innerHeight;

    const zoom = Math.min(
        (Math.log2(360 / Math.abs(bounds?.maxLng - bounds?.minLng)) * width) / 1000,
        (Math.log2(180 / Math.abs(bounds?.maxLat - bounds?.minLat)) * height) / 1000
    );

    const geojson = {
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: coordinates,
        },
    };

    const layerStyle = {
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
            'line-join': 'round',
            'line-cap': 'round',
        },
        paint: {
            'line-color': '#4B2D9F',
            'line-width': 4,
        },
    };

    return (
        <div className="mb-4 pb-6 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px]
            after:bg-700">
            <h3 className="uppercase font-bold text-center mb-4">Path History</h3>
            {
                user ?
                <div className="relative h-[800px] rounded-2xl overflow-hidden">
                    <Map
                        initialViewState={{
                            ...center,
                            zoom: zoom,
                        }}
                        mapboxAccessToken={process.env.REACT_APP_MAPBOX_API_KEY}
                        className="h-full w-full"
                        mapStyle="mapbox://styles/mapbox/light-v11"
                        projection="mercator"
                        dragRotate={false}
                        
                    >
                        {
                            addresses?.map((item, i) => {
                                return (
                                    <Marker
                                        key={i+1}
                                        longitude={item.location.longitude}
                                        latitude={item.location.latitude}
                                        style={{"z-index": "0"}}
                                    >
                                        <div className={`${i === coordinates.length - 1? "bg-[#DFA4A2]": "bg-[#D0D5E8]"} relative w-8 h-8 rounded-full flex items-center justify-center`}>
                                            <button onClick={() => { setActivePoint(i === activePoint? -1: i) }} className="bg-white w-4 h-4 rounded-full flex items-center justify-center">
                                                <div className={`${i === coordinates.length - 1? "bg-800": "bg-300"} w-2.5 h-2.5 rounded-full relative`}>
                                                    {
                                                        i === 0 &&
                                                        <img src={location_violet} alt="location"
                                                        className="absolute left-2/4 bottom-2/4 translate-x-[-50%] min-w-5" />
                                                    }
                                                    {
                                                        i === coordinates.length - 1 &&
                                                        <img src={location_orange} alt="location"
                                                        className="absolute left-2/4 bottom-2/4 translate-x-[-50%] min-w-5" />
                                                    }
                                                </div>
                                            </button>
                                            {
                                                i !== coordinates.length - 1 &&
                                                <div className={`absolute bottom-[-2%] right-[-2%] translate-y-full translate-x-full bg-400 border-[1px]
                                                    border-solid border-300 rounded-2xl rounded-tl-none py-5 px-6 flex flex-col items-center opacity
                                                    transition-500 ${activePoint === i? "opacity-1": "opacity-0"}`}>
                                                    <div className="whitespace-nowrap uppercase font-bold mb-2 text-lg">{item.city && item.city + ", "}{item.country}</div>
                                                    <div className="flex justify-center gap-x-2 mb-2">
                                                        <div className="whitespace-nowrap uppercase font-semibold text-sm">{item.date}</div>
                                                        <div className="whitespace-nowrap uppercase font-semibold text-sm">{item.time}</div>
                                                    </div>
                                                    <div className="whitespace-nowrap text-300 font-semibold text-sm underline">Preview Premium</div>
                                                </div>
                                            }
                                            {
                                                i === coordinates.length - 1 &&
                                                <div className="absolute top-[-2%] right-[-2%] translate-y-[-100%] translate-x-full bg-400 border-[1px]
                                                    border-solid border-800 rounded-2xl rounded-bl-none py-5 px-6 flex flex-col items-center">
                                                    <div className="whitespace-nowrap uppercase font-bold mb-2 text-lg text-800">CURRENT ADDRESS</div>
                                                    <div className="whitespace-nowrap uppercase font-bold mb-2 text-lg">{item.city && item.city + ", "}{item.country}</div>
                                                </div>
                                            }
                                        </div>
                                    </Marker>
                                )
                            })
                        }
                        <Source style={{"z-index": "1"}} id="route" type="geojson" data={geojson}>
                            <Layer {...layerStyle} />
                        </Source>
                    </Map>
                    {
                        props.celebrety?.addresses?.length !== 0 &&
                        <div className="absolute top-[40px] right-[44px] z-[11] bg-300 rounded-2xl px-2.5 py-6">
                            <div className="text-white text-center font-semibold uppercase mb-4">Last seen in</div>
                            <ul className="mb-6">
                                {
                                    props.celebrety?.addresses?.map((item, i) => {
                                        return(
                                            <li key={i+1} className={`px-8 flex gap-x-2 mb-2 ${i !== addresses?.length - 1 &&`relative before:content-['']
                                                before:bottom-0 before:left-0 before:absolute before:w-full before:h-[1px] before:bg-white`}`}>
                                                <div>
                                                    <img src={location_violet} alt="" />
                                                </div>
                                                <div>
                                                    <div className="text-white font-semibold uppercase mb-1">{item.city && item.city + ", "}{item.country}</div>
                                                    <div className="flex gap-x-2 mb-2.5">
                                                        <div className="font-semibold text-white text-xs">{item.date}</div>
                                                        <div className="font-semibold text-white text-xs">{item.time}</div>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                            <div className="uppercase text-white font-semibold text-center">
                                Don't find it? Submit new one <button onClick={ () => { props.setIsReportActive(true) } } className="underline">HERE</button>
                            </div>
                            {
                                !user.isPremium &&
                                <div className="absolute top-0 left-0 w-full h-full rounded-2xl backdrop-blur-md flex flex-col">
                                    <div className="justify-self-center flex-1 flex flex-col justify-center items-center">
                                        <div className="mb-3">
                                            <img src={hiden} alt="hiden" />
                                        </div>
                                        <p className="uppercase font-semibold text-400">Available by subscription only.</p>
                                    </div>
                                    <div className="flex justify-center">
                                        <NavLink className="justify-self-end mb-6 text-400 uppercase font-medium relative before:absolute
                                        before:bottom-[-2px] before:left-0 before:w-full before:h-[1px] before:bg-400" to="/buy">buy premium</NavLink>
                                    </div>
                                </div>
                            }
                        </div>
                    }
                </div>:
                <div className="flex flex-col items-center">
                    <p className="text-center w-full mb-6">Create free account to view {props.celebrety?.first_name} {props.celebrety?.last_name}’s address</p>
                    <NavLink className="bg-300 text-400 rounded-xl py-1.5 px-8" to="/register">Create free account</NavLink>
                </div>
            }
        </div>
    )
}

export default MapComponent;