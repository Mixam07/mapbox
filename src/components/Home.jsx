import Map, { Marker } from 'react-map-gl';
import { useEffect, useRef, useState } from 'react';
import { get, ref } from 'firebase/database';
import { db } from './firebase';
import { NavLink } from 'react-router-dom';
import Filter from './Filter';
import search from "../assets/icons/search.svg";

const Home = (props) => {
    const [celebreties, setCelebreties] = useState([]);
    const [searchCelebretyList, setSearchCelebretyList] = useState([]);
    const [points, setPoints] = useState([]);
    const inputRef = useRef(null);
    const points_list = points.map((item, i) => {
        return(
            <Marker
                className="relarive"
                key={i+1}
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
    const users = searchCelebretyList.map((item, i) => (
        <li key={i+1} className="border-solid border-t-[1px] border-[#E1E2ED] py-6">
            <NavLink to={`/profile/${item.id}`} className="flex items-center">
                <div className="w-full flex gap-x-4 items-center">
                    <img className="w-12 h-12 rounded-full object-cover" src={item.photo} alt="photo" />
                    <p className="uppercase font-semibold">{item.first_name} {item.last_name}</p>
                </div>
                <div className="w-full flex justify-center gap-x-14">
                    <p>{item.country}</p>
                    <p>{item.city}</p>
                </div>
                <ul className="w-full flex justify-end gap-x-4">
                    {item.tags.map((tag, i) => {
                        if(i < 3){
                            return(
                                <li className="py-1.5 px-3 bg-gradient-to-l from-500 to-500/75 rounded-2xl min-w-24 text-center">#{tag}</li>
                            )
                        }
                    })}
                </ul>
            </NavLink>
        </li>
    ));

    const toggleInfo = (e, i) => {
        e.preventDefault();

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
            setCelebreties(Object.values(snapshot.val()));
            setPoints(Object.values(snapshot.val()).map(data => {
                return{
                    ...data,
                    isShow: false
                }
            }));
        }
    }

    const closeInput = (e) => {
        if(e.target.classList.contains("canvas")){
            props.setIsFocus(false);
        }
    }

    const onChange = (e) => {
        props.setSearchCelebrety(e.target.value);

        const value = e.target.value.toLowerCase().split(' ');
        const newCelebretyList = [];
        
        celebreties.forEach(celebrety => {
            const first_name_first = celebrety.first_name.slice(0, value[0].length).toLowerCase();
            const last_name_first = celebrety.last_name.slice(0, value[0].length).toLowerCase();

            if(e.target.value !=+ "" && value.length < 3 && (value[0] === first_name_first || value[0] === last_name_first)){
                if(value[1]){
                    const first_name_second = celebrety.first_name.slice(0, value[1].length).toLowerCase();
                    const last_name_second = celebrety.last_name.slice(0, value[1].length).toLowerCase();

                    if(value[1] == first_name_second || value[1] == last_name_second){
                        newCelebretyList.push(celebrety);
                    }

                    return
                }

                newCelebretyList.push(celebrety);
            }
        });

        setSearchCelebretyList(newCelebretyList);
    }

    useEffect(() => {
        fetchData();

        return () => {
            props.setIsMapActive(true);
        }
    }, []);

    useEffect(() => {
        if(inputRef && props.isFocus){
            inputRef.current.focus();
        }
    }, [props.isFocus]);
    return(
        <>
            <section className="h-[calc(100vh-5.75rem)] w-[100vw] relative" onClick={onClick}>
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
            </section>
            <div onClick={closeInput} className={`canvas fixed top-0 left-0 z-[1000] w-full h-full bg-black/75 flex justify-center items-center
                duration-500 ${!props.isFocus && "opacity-0 pointer-events-none"}`}>
                <div className="max-w-7xl w-full">
                    <div className="bg-gradient-to-l from-500 to-500/75 p-3 rounded-xl w-full">
                        <div className="relative">
                            <input className={`w-full py-6 pr-16 pl-10 ${users.length === 0? "rounded-xl": "rounded-t-xl"} uppercase font-semibold text-2xls`}
                                placeholder="Find a celebrety" type="text" value={props.searchCelebrety}
                                onChange={onChange} ref={inputRef} />
                            <button className="absolute bottom-2/4 right-[2.5rem] translate-y-2/4">
                                <img src={search} alt="search" />
                            </button>
                            <ul className="absolute bottom-0 left-0 translate-y-full bg-white w-full px-10 rounded-b-xl">
                                {users}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home;