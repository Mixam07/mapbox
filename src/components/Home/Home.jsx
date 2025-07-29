import Map, { Marker } from 'react-map-gl';
import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import FilterContainer from './Filter/FilterContainer';
import CreateCelebretyContainer from '../CreateCelebrety/CreateCelebretyContainer';
import ReportContainer from '../Report/ReportContainer';
import Popup from '../Popup/Popup';

const Home = (props) => {
    const listRef = useRef(null);
    const [isPopupActive, setIsPopupActive] = useState(false)
    const [activeId, setActiveId] = useState(-1);
    const onClick = (e, id) => {
        if(!e.target.classList.contains("button")){
            setActiveId(id)
            props.setIsReportActive(true);
        }
    } 
    const celebreties = props.celebreties.map((item, i) => {
        return(
            <li key={i} onClick={ (e) => { onClick(e, item.id) } } className="bg-400 flex rounded-xl justify-between items-center py-2 px-4 cursor-pointer">
                <div className="w-14">
                    <img className="w-full h-14 rounded-xl" src={item?.photo} alt="photo" />
                </div>
                <div className="w-[calc((100%-7rem-3.5rem)/6)] text-center">{item.first_name} {item.last_name}</div>
                <div className="w-[calc((100%-7rem-3.5rem)/6)] text-center">{item.age}</div>
                <div className="w-[calc((100%-7rem-3.5rem)/6)] text-center">{item.country}</div>
                <div className="w-[calc((100%-7rem-3.5rem)/6)] text-center">{item.city}</div>
                <div className="w-[calc((100%-7rem-3.5rem)/6)] text-center">{item.tags.map((item, i) => {if(i < 5) return item + " "})}</div>
                <div className="w-[calc((100%-7rem-3.5rem)/6)] text-center">{item.category}</div>
                <div className="w-28">
                    <NavLink to={`/profile/${item.id}`} className="bg-300 block w-full py-2.5 px-4 text-center text-400 rounded-2xl button">View</NavLink>
                </div>
            </li>
        )
    });
    const points = props.points.map((item, i) => {
        if(item.location){
            return(
                <Marker
                    className="relarive"
                    key={i+1}
                    longitude={item.location.longitude}
                    latitude={item.location.latitude}
                    anchor="bottom"
                >
                    <button onClick={ () => { props.toggleActivePoint(i) } } className="relative w-4 h-4 block bg-300 rounded-full before:content-['']
                        before:absolute before:block before:top-2/4 before:left-2/4 before:w-[150%] before:h-[150%] before:bg-300/10
                        before:z-[-1] before:translate-x-[-50%] before:translate-y-[-50%] before:rounded-full before:shadow-2xl"></button>
                    <div className={`absolute bottom-2/4 right-[-0.5rem] translate-y-full translate-x-full bg-300/20 py-2 px-4 rounded-r-2xl rounded-b-2xl
                        border-[1px] border-solid border-white ${!item.isShow && "opacity-0"}`}>
                        <div className='whitespace-nowrap text-lg mb-2'>First name: {item.first_name}</div>
                        <div className='whitespace-nowrap text-lg mb-2'>Last name: {item.last_name}</div>
                        <div className='whitespace-nowrap text-lg mb-2'>Country: {item.country}</div>
                        <div className='whitespace-nowrap text-lg mb-2'>City: {item.city}</div>
                        <div className='whitespace-nowrap text-lg mb-2'>Last update: {item.last_update}</div>
                        {/*<div className='whitespace-nowrap text-lg mb-3'>Accuracy: 60%</div>*/}
                        <NavLink to={"/profile/" + item.id} className="uppercase whitespace-nowrap text-300 text-lg relative
                            before:content-[''] before:block before:absolute before:bottom-0 before:left-0 before:w-full before:h-[1px] before:bg-300">
                            Check details
                        </NavLink>
                    </div>
                </Marker>
            )
        }
    });
    const search_celebreties = props.searchCelebretyList.map((item, i) => (
        <li key={i+1} className="">
            <NavLink onClick={ () => { props.changeSearchNumberThunkCreator(item.id) } } to={`/profile/${item?.id}`} className="flex rounded-xl justify-between items-center py-2 px-4">
                <div className="w-14">
                    <img className="w-full h-14 rounded-xl" src={item?.photo} alt="photo" />
                </div>
                <div className="w-[calc((100%-7rem-3.5rem)/5)] text-center">{item.first_name} {item.last_name}</div>
                <div className="w-[calc((100%-7rem-3.5rem)/5)] text-center">{item.age}</div>
                <div className="w-[calc((100%-7rem-3.5rem)/5)] text-center">{item.country}</div>
                <div className="w-[calc((100%-7rem-3.5rem)/5)] text-center">{item.city}</div>
                <div className="w-[calc((100%-7rem-3.5rem)/5)] text-center">{item.tags.map((item, i) => {if(i < 5) return item + " "})}</div>
                <div className="w-[calc((100%-7rem-3.5rem)/5)] text-center">{item.category}</div>
            </NavLink>
        </li>
    ));

    useEffect(() => {
        return () => {
            props.setIsMapActive(true);
            props.setSearchCelebretyInput("");

            window.scrollTo(0, 0);
        }
    }, []);

    useEffect(() => {
        if(props.isReportActive){
            document.body.style.overflow = 'hidden';
        }else{
            document.body.style.overflow = 'auto';
        }
    }, [props.isReportActive]);

    const onChange = async (e) => {
        const bodyHeight = document.body.clientHeight;
        const headerHeight = 91;
        const searchHeight = 82;

        await props.setSearchCelebretyInput(e.target.value);

        if(listRef.current){
            const visibleHeight = bodyHeight - headerHeight - searchHeight;

            if(listRef.current.clientHeight > visibleHeight){
                window.scrollTo(0, visibleHeight);
            }else{
                window.scrollTo(0, listRef.current.clientHeight);
            }
        }
    }

    return(
        <>
            { 
                props.isMapActive?
                <>
                    <section className="w-full relative">
                        <FilterContainer />
                        <div className="h-[calc(100vh-5.75rem)]">
                            <Map
                                mapboxAccessToken={process.env.REACT_APP_MAPBOX_API_KEY}
                                className="h-full w-full"
                                mapStyle="mapbox://styles/mapbox/light-v11"
                                projection="mercator"
                                dragRotate={false}
                                
                            >
                                {points}
                            </Map>
                        </div>
                        <div className="max-w-4xl w-full absolute bottom-0 right-2/4 translate-x-2/4">
                            <div className="bg-gradient-to-l from-500 to-500/75 p-2.5 rounded-xl w-full">
                                <div className='relative'>
                                    <input className="w-full py-5 pr-12 pl-6 rounded-xl uppercase font-semibold text-2xls"
                                        placeholder="Find a celebrety" type="text" value={props.searchCelebretyInput}
                                        onChange={onChange} />
                                    <button onClick={ () => { props.setIsCreateCelebretyActive(true) } }
                                        className="bg-300 text-white uppercase font-bold py-5 px-10 rounded-2xl
                                        absolute bottom-2/4 translate-y-2/4 right-0.5">Add celebrety</button>
                                </div>
                            </div>
                        </div>
                    </section>
                    {
                        search_celebreties.length !== 0?
                        <ul ref={listRef} className="bg-white w-full py-5 px-20">
                            {search_celebreties}
                        </ul>: ""
                    }
                </>:
                <>
                    <section className="h-[calc(100vh-5.75rem)] w-[100vw] relative flex justify-center">
                        <div className="max-w-[90%] w-full flex justify-center flex-col">
                            <div className="mx-auto bg-gradient-to-l from-500 to-500/75 py-10 px-7 h-[85%] w-full rounded-2xl mb-5">
                                <div className={`flex justify-between items-center mb-3 ${props.celebreties?.length > 7 ? "pl-12 pr-16": "px-12"}`}>
                                    <div className="w-14"></div>
                                    <div className="w-[calc((100%-7rem-3.5rem)/6)] text-center">Name</div>
                                    <div className="w-[calc((100%-7rem-3.5rem)/6)] text-center">Age</div>
                                    <div className="w-[calc((100%-7rem-3.5rem)/6)] text-center">Country</div>
                                    <div className="w-[calc((100%-7rem-3.5rem)/6)] text-center">City</div>
                                    <div className="w-[calc((100%-7rem-3.5rem)/6)] text-center">Tags</div>
                                    <div className="w-[calc((100%-7rem-3.5rem)/6)] text-center">Type of activity</div>
                                    <div className="w-28"></div>
                                </div>
                                <ul className="flex flex-col gap-y-4 overflow-auto h-[calc(100%-1.75rem)] px-7 custome-scrollbar">
                                    {celebreties}
                                </ul>
                            </div>
                            <div className="flex justify-end gap-x-20 items-center">
                                <p className="font-semibold text-xl">If you haven't found a celebrity, you can add one</p>
                                <button onClick={ () => { props.setIsCreateCelebretyActive(true) } }
                                    className="bg-300 text-white uppercase font-bold py-5 px-10 rounded-2xl">Add celebrety</button>
                            </div>
                        </div>
                    </section>
                </>
            }
            <CreateCelebretyContainer isActive={props.isCreateCelebretyActive} setIsActive={props.setIsCreateCelebretyActive} setIsPopupActive={setIsPopupActive} />
            <ReportContainer activeId={activeId} setActiveId={setActiveId} isActive={props.isReportActive} setIsActive={props.setIsReportActive} setIsPopupActive={setIsPopupActive} />
            <Popup isActive={isPopupActive} setIsActive={setIsPopupActive} />
        </>
    )
}

export default Home;